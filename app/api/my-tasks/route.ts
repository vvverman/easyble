import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { format } from "date-fns";
import { auth } from "@/auth";
import prisma from "~/lib/prisma";

export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() });
  const userId = session?.user?.id;
  if (!userId) {
    return NextResponse.json({ incoming: [], outgoing: [] }, { status: 401 });
  }

  const incomingTasks = await prisma.task.findMany({
    where: {
      assignees: { some: { userId } },
    },
    include: {
      column: { include: { board: { include: { project: true } } } },
    },
    orderBy: { createdAt: "desc" },
  });

  const outgoingTasks = await prisma.task.findMany({
    where: {
      creatorId: userId,
      assignees: { none: { userId } },
    },
    include: {
      column: { include: { board: { include: { project: true } } } },
    },
    orderBy: { createdAt: "desc" },
  });

  const mapTask = (t: any) => {
    const project = t.column?.board?.project;
    const displayId = project ? `${project.number ?? ""}-${t.projectTaskNumber}` : t.id;
    return {
      id: t.id,
      title: t.title,
      displayId,
      status: t.column?.title ?? "-",
      type: t.type ?? "-",
      createdAt: format(t.createdAt, "dd.MM.yyyy"),
      startDate: t.startDate ? format(t.startDate, "dd.MM.yyyy") : null,
      deadline: t.deadline ? format(t.deadline, "dd.MM.yyyy") : null,
    };
  };

  return NextResponse.json({
    incoming: incomingTasks.map(mapTask),
    outgoing: outgoingTasks.map(mapTask),
  });
}
