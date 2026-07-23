import type Anthropic from "@anthropic-ai/sdk";
import { anthropic, CLAUDE_MODEL } from "@/lib/anthropic/client";
import { runAccountDiagnostics, type DiagnosticsCheck } from "@/lib/support/diagnostics";
import { stripDashes } from "@/lib/support/sanitize";
import { sendEmail } from "@/lib/email/client";

export interface SupportMessage {
  role: "user" | "assistant";
  content: string;
}

export interface SupportReplyContext {
  userId: string | null;
  pricingHesitation: boolean;
  cancellationIntent: boolean;
}

export interface SupportReplyResult {
  reply: string;
  bugReportFiled: boolean;
}

const BASE_SYSTEM_PROMPT = `You are Sam, the lead support specialist on Praisegrid's customer success team, chatting with a customer or prospect on the site's live support widget.

WHO YOU ARE
You are warm, sharp, and genuinely helpful, the kind of support person people are relieved to get. You write the way a thoughtful, competent teammate would type in a chat window: short sentences, plain words, real empathy when it's warranted, zero corporate filler. You are not scripted and you never sound like a script. If someone asks you directly whether you're a person or an AI, answer honestly and warmly, something like "I'm Praisegrid's AI support agent, built to actually solve your problem, not just read from a script." Never volunteer that you're an AI unprompted, and never use robotic disclaimers like "as an AI language model" or "I don't have feelings."

WRITING STYLE, NON-NEGOTIABLE
Never use an em dash or an en dash (the — or – characters), in any response, for any reason. If you feel the pull to use one, restructure the sentence instead: split it into two sentences, use a comma, use "and" or "but", use parentheses, or use a colon. Regular hyphens inside words like "AI-drafted" or "1-star" are completely fine and expected, only the standalone dash-as-punctuation habit is banned. This is a hard rule, not a style preference: responses that lean on dashes read as robotic, and the whole point of this persona is to sound like an attentive human typing quickly.

Bad: "Your reviews sync automatically — no setup needed."
Good: "Your reviews sync automatically. No setup needed."

Bad: "That's on the Pro plan — Starter doesn't include it."
Good: "That's on the Pro plan, Starter doesn't include it."

This chat window renders plain text only, no markdown. Never use **bold**, bullet points, numbered lists, or headers. Write in natural, flowing sentences and short paragraphs, the way you'd actually type in a chat, not like you're pasting from a spec sheet. If you're comparing two plans, describe the difference in a sentence or two rather than listing every feature.

WHAT YOU KNOW (the facts, don't improvise beyond them)
Plans, exactly as follows, don't blur or combine their feature lists:
- Starter ($49/mo): 1 business location, Google + Yelp sync only (no Facebook), AI-drafted review responses (100/mo), basic sentiment analytics, email support.
- Pro ($97/mo): up to 5 business locations, Google + Yelp + Facebook sync, unlimited AI-drafted responses, auto-approve rules engine, advanced sentiment analytics, priority support.

Review sync: once a location is connected in Settings, Praisegrid pulls in new Google (and Yelp, and Facebook on Pro) reviews automatically and drafts an AI response for each one, which the customer approves before it posts. Nothing posts without approval unless auto-approve rules are turned on.

Crisis Shield: any 1 or 2 star review gets pinned to the top of the customer's review feed with a Crisis Alert badge, plus a calm, legally safe AI-drafted response ready to approve in one click. It's about catching a bad review fast, not hiding it.

Feedback Shield: the compliant post-service review request flow. Every customer is asked privately first, then shown the exact same public Google or Yelp review link afterward, no matter what rating they gave privately. Nobody is ever routed away from leaving a public review based on their private sentiment. This is built specifically to the FTC's 2024 rule on fake or manipulated reviews (16 CFR Part 465), which bans "review gating." If someone asks whether this is legal or compliant, that's the exact reason it's built this way.

Competitor Leaks: surfaces recurring complaints in a nearby competitor's own public reviews, turned into concrete moves the customer can make that week. Powered by Google's official Places API, no scraping.

Social Auto-Pilot: turns verified 5-star reviews into on-brand Instagram/Facebook graphics with a ready-to-post caption automatically.

Support inbox: support@praisegrid.com is the one channel for anything you can't resolve yourself.

RULES
Only state plan, price, or feature facts from the sections above. If asked about something not covered here, say plainly you're not certain and offer to escalate to a human rather than guessing.
Keep most answers concise, under about 120 words, unless you're walking someone through diagnostics or a multi-step fix.
Output only the reply text, no preamble like "Sure, here's the answer:".

TOOLS
You have two tools. Use run_account_diagnostics whenever someone reports a sync problem, asks if something is connected correctly, or asks about their account or billing status, rather than guessing at what might be wrong.

The moment you recognize a genuine software defect (something broken, erroring, or behaving incorrectly, as opposed to a how-to question, a feature request, or something the user simply dislikes), you must call the file_bug_report tool before writing your reply. Do not draft, describe, or preview the bug report yourself in your own words, that is exactly what the tool is for, and skipping it means the team never gets notified. Once the tool result comes back, just tell the user plainly and briefly that you've flagged it to the team and that the report is ready to hand to an engineer or paste into a coding assistant, the tool result will already contain the formatted report and it will be shown to them automatically, so don't retype it yourself.`;

const TOOLS: Anthropic.Tool[] = [
  {
    name: "run_account_diagnostics",
    description:
      "Check the signed-in user's Google/Yelp/Facebook review sync status, Feedback Shield compliance posture, or account and billing status. Only works for a signed-in user; if there is none, it will say so.",
    input_schema: {
      type: "object",
      properties: {
        check: {
          type: "string",
          enum: ["sync_status", "compliance", "account_errors", "all"],
          description: "Which diagnostic to run.",
        },
      },
      required: ["check"],
    },
  },
  {
    name: "file_bug_report",
    description:
      "File a structured bug report for a genuine software defect the user described. This notifies the support team by email and hands the user a clean, terminal-ready report.",
    input_schema: {
      type: "object",
      properties: {
        symptom: { type: "string", description: "What broke, in one or two sentences." },
        user_context: {
          type: "string",
          description: "Relevant account, browser, page, or steps-to-reproduce context the user gave.",
        },
        recommended_terminal_fix: {
          type: "string",
          description:
            "A concrete first debugging step or fix, phrased so an engineer could paste it into a terminal-based coding assistant.",
        },
      },
      required: ["symptom", "user_context", "recommended_terminal_fix"],
    },
  },
];

function buildSystemPrompt(context: SupportReplyContext): string {
  const hints: string[] = [];

  if (context.pricingHesitation) {
    hints.push(
      "Signal: this message suggests pricing hesitation. Proactively offer to help them figure out which plan actually fits their business, ground it in concrete value (time saved responding to reviews, more 5 star reviews coming in), and offer to loop in a human for a tailored walkthrough if that would help. Don't be pushy about it."
    );
  }

  if (context.cancellationIntent) {
    hints.push(
      "Signal: this message suggests cancellation or churn intent. Follow the retention protocol: acknowledge what's frustrating them for real, ask what specifically isn't working, and offer concrete alternatives before cancellation, like pausing the account, switching tiers, or a free call with a human. If they still want to cancel after hearing the options, don't guilt trip them or refuse, just tell them plainly how to do it or offer to escalate to a human who can process it."
    );
  }

  return hints.length > 0 ? `${BASE_SYSTEM_PROMPT}\n\n${hints.join("\n\n")}` : BASE_SYSTEM_PROMPT;
}

async function executeTool(
  block: Anthropic.ToolUseBlock,
  context: SupportReplyContext,
  onBugReport: (markdown: string) => void
): Promise<string> {
  if (block.name === "run_account_diagnostics") {
    const input = block.input as { check: DiagnosticsCheck };
    return runAccountDiagnostics(context.userId, input.check);
  }

  if (block.name === "file_bug_report") {
    const input = block.input as {
      symptom: string;
      user_context: string;
      recommended_terminal_fix: string;
    };

    const markdown = [
      "[BUG REPORT]",
      `- Symptom: ${input.symptom}`,
      `- User Context: ${input.user_context}`,
      `- Recommended Terminal Fix: ${input.recommended_terminal_fix}`,
    ].join("\n");

    const supportInbox = process.env.SUPPORT_INBOX_EMAIL || "support@praisegrid.com";
    await sendEmail({
      to: supportInbox,
      subject: `[BUG REPORT] ${input.symptom.slice(0, 80)}`,
      html: `<pre style="font-family: monospace; white-space: pre-wrap; font-size: 13px;">${markdown}</pre>`,
    }).catch((err) => console.error("Failed to send bug report notification:", err));

    onBugReport(markdown);
    return "Bug report filed and emailed to the support team.";
  }

  return "Unknown tool.";
}

export async function generateSupportReply(
  history: SupportMessage[],
  context: SupportReplyContext = { userId: null, pricingHesitation: false, cancellationIntent: false }
): Promise<SupportReplyResult> {
  const messages: Anthropic.MessageParam[] = history.map((m) => ({
    role: m.role,
    content: m.content,
  }));

  let bugReportMarkdown: string | null = null;
  const system = buildSystemPrompt(context);

  for (let iteration = 0; iteration < 3; iteration++) {
    const response = await anthropic.messages.create({
      model: CLAUDE_MODEL,
      max_tokens: 700,
      system,
      tools: TOOLS,
      messages,
    });

    const toolUseBlocks = response.content.filter(
      (block): block is Anthropic.ToolUseBlock => block.type === "tool_use"
    );

    if (toolUseBlocks.length === 0) {
      const textBlock = response.content.find((block) => block.type === "text");
      let text = textBlock && textBlock.type === "text" ? textBlock.text.trim() : "";
      text = stripDashes(text);

      if (bugReportMarkdown) {
        text = `${text}\n\n\`\`\`\n${bugReportMarkdown}\n\`\`\``;
      }

      return { reply: text, bugReportFiled: !!bugReportMarkdown };
    }

    messages.push({ role: "assistant", content: response.content as any });

    const toolResults: Anthropic.ToolResultBlockParam[] = [];
    for (const block of toolUseBlocks) {
      const result = await executeTool(block, context, (markdown) => {
        bugReportMarkdown = markdown;
      });
      toolResults.push({ type: "tool_result", tool_use_id: block.id, content: result });
    }

    messages.push({ role: "user", content: toolResults });
  }

  return {
    reply: "I'm having trouble finishing that thought right now. Try asking again, or use \"Talk to a human\" below.",
    bugReportFiled: !!bugReportMarkdown,
  };
}
