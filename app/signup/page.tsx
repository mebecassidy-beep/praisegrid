import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthLayout } from "@/components/auth/auth-layout";
import { SignupForm } from "@/components/auth/signup-form";

export const metadata: Metadata = {
  title: "Sign up | Reputicious",
  description: "Create your Reputicious account to start managing reviews.",
};

export default function SignupPage() {
  return (
    <AuthLayout title="Create your account" subtitle="Start managing your reviews in minutes.">
      <Suspense fallback={null}>
        <SignupForm />
      </Suspense>
    </AuthLayout>
  );
}
