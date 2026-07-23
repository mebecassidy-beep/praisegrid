import type { Metadata } from "next";
import { Suspense } from "react";
import { pageMetadata } from "@/lib/seo";
import { AuthLayout } from "@/components/auth/auth-layout";
import { SignupForm } from "@/components/auth/signup-form";

export const metadata: Metadata = pageMetadata({
  title: "Sign up | Praisegrid",
  description: "Create your Praisegrid account to start managing reviews.",
  path: "/signup",
});

export default function SignupPage() {
  return (
    <AuthLayout title="Create your account" subtitle="Start managing your reviews in minutes.">
      <Suspense fallback={null}>
        <SignupForm />
      </Suspense>
    </AuthLayout>
  );
}
