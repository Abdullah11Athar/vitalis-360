import LoginForm from "@/components/LoginForm";
import type { Metadata } from "next";

export function generateStaticParams() {
  return [
    { role: 'doctor' },
    { role: 'patient' },
    { role: 'staff' },
  ];
}

export const metadata: Metadata = {
  title: "Portal Authentication | VITALIS-360",
  description: "Sign in to VITALIS-360 Clinician, Patient, or Administrative Staff portal.",
};

export default async function RoleLoginPage({
  params,
}: {
  params: Promise<{ role: string }>;
}) {
  const { role } = await params;
  const validRole = (role === 'doctor' || role === 'patient' || role === 'staff') ? role : null;
  return <LoginForm initialRole={validRole} />;
}
