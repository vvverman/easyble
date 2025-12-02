import Image from "next/image"
import Link from "next/link"

import { LoginForm } from "@/components/login-form"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function LoginPage() {
  return (
    <div className="grid min-h-screen bg-[#0b0b0b] text-foreground lg:grid-cols-2">
      <div className="relative flex flex-col gap-6 px-6 py-8 sm:px-10">
        <div className="flex items-center gap-3 text-sm font-medium">
          <div className="bg-white/10 text-white flex size-10 items-center justify-center rounded-full border border-white/10">
            <Image src="/favicon.ico" alt="Easyble" width={24} height={24} className="rounded-md" />
          </div>
          <Link href="/" className="text-base text-white">Easyble</Link>
        </div>

        <div className="flex flex-1 items-center justify-center">
          <Card className="w-full max-w-md border-white/10 bg-[#0f0f0f] text-white shadow-2xl">
            <CardHeader className="space-y-2 text-center">
              <CardTitle className="text-3xl font-semibold tracking-tight">
                Login to your account
              </CardTitle>
              <CardDescription className="text-white/70 text-sm">
                Enter your email below to login to your account
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <LoginForm />
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="relative hidden overflow-hidden lg:block">
        <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-black/20 to-transparent" />
        <Image
          src="/images/login-goldfish.png"
          alt="Easyble preview"
          fill
          className="object-cover"
          priority
        />
      </div>
    </div>
  )
}
