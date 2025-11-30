import { NextResponse, type NextRequest } from "next/server"
import { cookies } from "next/headers"

const PROTECTED_PREFIXES = ["/projects", "/dashboard"]

export async function middleware(req: NextRequest) {
const { pathname } = req.nextUrl

const isProtected = PROTECTED_PREFIXES.some((prefix) =>
pathname.startsWith(prefix),
)

if (!isProtected) {
return NextResponse.next()
}

const cookieStore = await cookies()
const hasSession =
cookieStore.has("better-auth.session_token") ||
cookieStore
.getAll()
.some((c) => c.name.startsWith("better-auth.session"))

if (!hasSession) {
const url = req.nextUrl.clone()
url.pathname = "/"
url.search = ""
return NextResponse.redirect(url)
}

return NextResponse.next()
}

export const config = {
runtime: "nodejs",
matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
