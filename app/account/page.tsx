import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { auth } from "@/auth"
import prisma from "~/lib/prisma"
import { updateProfile } from "~/features/account/actions"
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

// Avoid static prerender so DB access happens at request time
export const dynamic = "force-dynamic"

export default async function AccountPage() {
  const headersList = await headers()
  const session = await auth.api.getSession({
    headers: headersList,
  })

  const userId = session?.user?.id
  if (!userId) {
    redirect("/")
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { name: true, email: true, username: true, image: true },
  })

  if (!user) {
    redirect("/")
  }

  return (
    <div className="mx-auto flex max-w-xl flex-col gap-6 p-6">
      <Breadcrumb className="mb-1">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Account</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="space-y-1">
        <h1 className="text-2xl font-bold leading-tight">
          Account
        </h1>
        <p className="text-sm text-muted-foreground">
          Manage your profile information.
        </p>
      </div>

      <div className="space-y-1 text-sm">
        <p className="text-muted-foreground">Email</p>
        <p className="font-medium">{user.email}</p>
      </div>

      <form action={updateProfile} className="space-y-4">
        <div className="space-y-2">
          <label
            htmlFor="name"
            className="text-sm font-medium text-foreground"
          >
            Display name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            defaultValue={user.name ?? ""}
            required
            className="w-full rounded-md border px-3 py-2 text-sm bg-background"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="username"
            className="text-sm font-medium text-foreground"
          >
            Username
          </label>
          <input
            id="username"
            name="username"
            type="text"
            defaultValue={user.username ?? ""}
            required
            className="w-full rounded-md border px-3 py-2 text-sm bg-background"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="avatar"
            className="text-sm font-medium text-foreground"
          >
            Avatar URL
          </label>
          <input
            id="avatar"
            name="avatar"
            type="url"
            defaultValue={user.image ?? ""}
            placeholder="https://..."
            className="w-full rounded-md border px-3 py-2 text-sm bg-background"
          />
        </div>

        <button
          type="submit"
          className="w-full inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Save changes
        </button>
      </form>
    </div>
  )
}
