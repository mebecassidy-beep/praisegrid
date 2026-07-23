import type { Metadata } from "next";
import { AuthLayout } from "@/components/auth/auth-layout";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";

export const metadata: Metadata = {
  title: "Reset password | Praisegrid",
  description: "Choose a new password for your Praisegrid account.",
};

export default function ResetPasswordPage() {
  return (
    <AuthLayout title="Choose a new password" subtitle="Make it something you'll remember.">
      <ResetPasswordForm />
    </AuthLayout>
  );
}
