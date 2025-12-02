import { redirect } from "next/navigation"
import { acceptBoardInvite } from "~/app/features/boards/invite-actions"
import { headers } from "next/headers"
import { auth } from "@/auth"

export const dynamic = "force-dynamic"

export default async function InvitePage({
  params,
}: {
  params: Promise<{ token: string }>
}) {
  const { token } = await params

  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session?.user?.id) {
    // просим войти и вернуться к этому инвайту
    redirect(`/login?next=/invite/${token}`)
  }

  try {
    await acceptBoardInvite(token)
  } catch (err: any) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-6">
        <div className="max-w-md text-center space-y-3">
          <h1 className="text-2xl font-semibold">Приглашение</h1>
          <p className="text-sm text-muted-foreground">
            {err?.message || "Приглашение недействительно или истекло."}
          </p>
        </div>
      </div>
    )
  }

  redirect("/projects")
}
