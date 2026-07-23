import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { AuthLayout } from "@/components/auth/auth-layout";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";

export const metadata: Metadata = {
  ...pageMetadata({
    title: "Forgot password | Praisegrid",
    description: "Reset your Praisegrid account password.",
    path: "/forgot-password",
  }),
  robots: { index: false, follow: false },
};

export default function ForgotPasswordPage() {
  return (
    <AuthLayout title="Forgot your password?" subtitle="We'll email you a reset link.">
      <ForgotPasswordForm />
    </AuthLayout>
  );
}
