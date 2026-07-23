import type { Metadata } from "next";
import { LegalH2, LegalP, LegalList, LegalPageLayout } from "@/components/legal/legal-page-layout";

export const metadata: Metadata = {
  title: "Terms of Service | Reputicious",
  description: "The terms that govern your use of Reputicious.",
};

export default function TermsPage() {
  return (
    <LegalPageLayout title="Terms of Service" updated="July 2026">
      <LegalP>
        These Terms of Service (&quot;Terms&quot;) govern your access to and use of Reputicious. By
        creating an account, you agree to these Terms.
      </LegalP>

      <LegalH2>Using Reputicious</LegalH2>
      <LegalP>
        You must provide accurate account information and are responsible for activity
        that happens under your account. You agree to use Reputicious only for lawful
        purposes and in a way that doesn&apos;t infringe on the rights of others or restrict
        anyone else&apos;s use of the service.
      </LegalP>

      <LegalH2>Subscriptions and billing</LegalH2>
      <LegalList>
        <li>Paid plans are billed in advance on a monthly or annual basis, as selected at signup.</li>
        <li>You can cancel at any time; access continues through the end of the current billing period.</li>
        <li>Free trials convert to a paid subscription unless canceled before the trial ends.</li>
      </LegalList>

      <LegalH2>AI-generated content</LegalH2>
      <LegalP>
        Reputicious uses AI to draft review responses based on your business&apos;s tone and
        past replies. You&apos;re responsible for reviewing AI-drafted responses before they&apos;re
        posted publicly, particularly if auto-approve rules are enabled.
      </LegalP>

      <LegalH2>Termination</LegalH2>
      <LegalP>
        You may stop using Reputicious and close your account at any time. We may suspend
        or terminate accounts that violate these Terms or misuse the service.
      </LegalP>

      <LegalH2>Changes to these Terms</LegalH2>
      <LegalP>
        We may update these Terms from time to time. We&apos;ll notify you of material changes
        before they take effect.
      </LegalP>

      <LegalH2>Contact us</LegalH2>
      <LegalP>
        Questions about these Terms? Email us at{" "}
        <a href="mailto:support@reputicious.com" className="font-medium text-foreground underline underline-offset-2">
          support@reputicious.com
        </a>
        .
      </LegalP>
    </LegalPageLayout>
  );
}
