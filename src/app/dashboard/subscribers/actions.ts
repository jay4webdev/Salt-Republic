"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { subscribers } from "@/db/schema";
import { getUser } from "@/lib/auth";

export async function deleteSubscriber(id: number) {
  if (!(await getUser())) redirect("/login");
  await db.delete(subscribers).where(eq(subscribers.id, id));
  revalidatePath("/dashboard/subscribers");
  return { ok: true as const };
}
