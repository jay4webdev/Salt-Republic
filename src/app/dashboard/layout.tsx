import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { getUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await getUser();
  if (!user) redirect("/login");

  return (
    <DashboardShell name={user.name} email={user.email}>
      {children}
    </DashboardShell>
  );
}
