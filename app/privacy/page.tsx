import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { LegalH2, LegalP, LegalList, LegalPageLayout } from "@/components/legal/legal-page-layout";

export const metadata: Metadata = pageMetadata({
  title: "Privacy Policy | Praisegrid",
  description: "How Praisegrid collects, uses, and protects your data.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <LegalPageLayout title="Privacy Policy" updated="July 2026">
      <LegalP>
        This Privacy Policy explains what information Praisegrid (&quot;we,&quot; &quot;us&quot;) collects when
        you use our website and dashboard, how we use it, and the choices you have.
      </LegalP>

      <LegalH2>Information we collect</LegalH2>
      <LegalList>
        <li>Account information you provide, such as your name, email address, and business details.</li>
        <li>Review and platform data you connect (e.g. Google, Yelp, Facebook) so we can display and respond to reviews on your behalf.</li>
        <li>Billing information processed by our payment provider, Stripe, we do not store full card numbers on our servers.</li>
        <li>Usage data such as pages visited and features used, to help us improve the product.</li>
      </LegalList>

      <LegalH2>How we use your information</LegalH2>
      <LegalList>
        <li>To operate and maintain your account and dashboard.</li>
        <li>To generate AI-drafted review responses using your connected review data.</li>
        <li>To process payments and manage subscriptions.</li>
        <li>To communicate with you about your account, product updates, or support requests.</li>
      </LegalList>

      <LegalH2>Third-party services</LegalH2>
      <LegalP>
        We rely on a small number of trusted service providers to operate Praisegrid,
        including Supabase for authentication and data storage, Stripe for payment
        processing, and Anthropic&apos;s Claude API for generating AI-drafted review
        responses. Each provider only receives the data necessary to perform its function.
      </LegalP>

      <LegalH2>Your rights</LegalH2>
      <LegalP>
        You can access, update, or delete your account information at any time from your
        settings, or by contacting us directly. Depending on your location, you may have
        additional rights under applicable data protection law.
      </LegalP>

      <LegalH2>Contact us</LegalH2>
      <LegalP>
        Questions about this policy? Reach out any time at{" "}
        <a href="mailto:support@praisegrid.com" className="font-medium text-foreground underline underline-offset-2">
          support@praisegrid.com
        </a>
        .
      </LegalP>
    </LegalPageLayout>
  );
}
