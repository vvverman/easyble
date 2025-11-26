import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { auth } from "@/auth"
import LandingPage from "~/features/landing/landing-page"

export default async function Home() {
  const headersList = await headers()

  const session = await auth.api.getSession({
    headers: headersList,
  })

  if (session?.session) {
    redirect("/projects")
  }

  return <LandingPage />
}
