import LoginForm from "@/components/LoginForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Portal Authentication | VITALIS-360",
  description: "Sign in to VITALIS-360 Clinician, Patient, or Administrative Staff portal.",
};

export default function LoginPage() {
  return <LoginForm initialRole={null} />;
}
