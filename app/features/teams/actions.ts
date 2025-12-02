"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { auth } from "@/auth";
import prisma from "~/lib/prisma";

export async function createTeam(formData: FormData) {
  const name = (formData.get("name") as string | null)?.trim();

  if (!name) {
    throw new Error("Team name is required");
  }

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const userId = session?.user?.id;
  if (!userId) {
    redirect("/login");
  }

  const user = await prisma.user.upsert({
    where: { id: userId! },
    update: {
      email: session?.user?.email ?? undefined,
      name: session?.user?.name ?? undefined,
      image: session?.user?.image ?? undefined,
    },
    create: {
      id: userId!,
      email: session?.user?.email ?? `user-${userId}@example.com`,
      name: session?.user?.name ?? "User",
      image: session?.user?.image ?? null,
    },
    select: { id: true },
  });

  const team = await prisma.team.create({
    data: {
      name,
      ownerId: user.id,
    },
  });

  redirect(`/projects/new?team=${team.id}`);
}

export async function updateTeam(formData: FormData) {
  const id = (formData.get('teamId') as string | null)?.trim();
  const name = (formData.get('name') as string | null)?.trim();

  if (!id || !name) {
    return;
  }

  // updateMany не кидает ошибку, если запись уже удалена
  await prisma.team.updateMany({
    where: { id },
    data: { name },
  });

  revalidatePath('/projects');
}

export async function deleteTeam(formData: FormData) {
  const id = (formData.get('teamId') as string | null)?.trim();
  if (!id) return;

  // Отвязываем проекты от команды, чтобы не было FK‑конфликтов
  await prisma.project.updateMany({
    where: { teamId: id },
    data: { teamId: null },
  });

  // Безопасно удаляем команду, даже если её уже нет
  await prisma.team.deleteMany({
    where: { id },
  });

  revalidatePath('/projects');
}
