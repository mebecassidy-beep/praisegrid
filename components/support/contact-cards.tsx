import Link from "next/link";
import { Clock, Mail } from "lucide-react";
import { CopyEmailButton } from "@/components/support/copy-email-button";

const SUPPORT_EMAIL = "support@reputicious.com";

function ContactCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl bg-gradient-to-br from-blue-500/20 to-violet-600/20 p-px">
      <div className="h-full rounded-2xl bg-slate-900 p-5 sm:p-6">{children}</div>
    </div>
  );
}

export function ContactCards() {
  return (
    <div className="flex flex-col gap-4">
      <ContactCard>
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-violet-600">
          <Mail className="h-5 w-5 text-white" />
        </div>
        <h3 className="mt-4 text-base font-semibold text-white">Email our support team</h3>
        <p className="mt-1.5 text-sm leading-relaxed text-slate-400">
          For anything the chat agent can&apos;t finish, billing changes, account access, or a
          detailed issue, this inbox reaches the whole team directly.
        </p>
        <div className="mt-4 flex min-w-0 flex-wrap items-center gap-2">
          <a
            href={`mailto:${SUPPORT_EMAIL}`}
            className="min-w-0 truncate text-sm font-medium text-blue-300 underline-offset-4 hover:underline"
          >
            {SUPPORT_EMAIL}
          </a>
          <CopyEmailButton email={SUPPORT_EMAIL} />
        </div>
      </ContactCard>

      <ContactCard>
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-400">
          <Clock className="h-5 w-5 text-white" />
        </div>
        <h3 className="mt-4 text-base font-semibold text-white">Response time</h3>
        <p className="mt-1.5 text-sm leading-relaxed text-slate-400">
          The chat agent to your left answers most questions instantly, day or night. Emails and
          escalated chats get a human reply, typically the same business day for Pro accounts and
          within a business day for Starter.
        </p>
      </ContactCard>

      <ContactCard>
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-400">
          <Mail className="h-5 w-5 text-white" />
        </div>
        <h3 className="mt-4 text-base font-semibold text-white">Prefer to browse first?</h3>
        <p className="mt-1.5 text-sm leading-relaxed text-slate-400">
          Check the Help Center for quick answers on plans, review sync, and account setup before
          reaching out.
        </p>
        <Link
          href="/help"
          className="mt-4 inline-flex items-center text-sm font-medium text-blue-300 underline-offset-4 hover:underline"
        >
          Visit the Help Center
        </Link>
      </ContactCard>
    </div>
  );
}
