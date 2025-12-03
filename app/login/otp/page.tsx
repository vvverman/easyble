import Image from "next/image"
import Link from "next/link"
import { Suspense } from "react"

import { OtpForm } from "@/components/otp-form"

export const dynamic = "force-dynamic"

export default function LoginOtpPage() {
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
          <div className="w-full max-w-md rounded-3xl border border-white/10 bg-[#0f0f0f] p-8 text-white shadow-2xl">
            <div className="space-y-3 text-center">
              <h1 className="text-2xl font-semibold">Enter verification code</h1>
              <p className="text-sm text-white/70">
                We sent a 6-digit code to your email.
              </p>
            </div>
            <div className="mt-6">
              <Suspense fallback={null}>
                <OtpForm />
              </Suspense>
            </div>
          </div>
        </div>
      </div>

      <div className="relative hidden overflow-hidden lg:block">
        <div className="absolute inset-0 bg-[#f3f3f3]" />
        <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
          <div className="flex h-14 w-14 items-center justify-center rounded-full border border-muted-foreground/40">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="h-6 w-6"
            >
              <path
                fill="currentColor"
                d="M5 4a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H5Zm0 2h14a1 1 0 0 1 1 1v.382l-8 4.444l-8-4.444V7a1 1 0 0 1 1-1Zm15 4.618V17a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-6.382l7.445 4.14a1 1 0 0 0 .11.056l.012.005l.011.005l.022.008h.002a1 1 0 0 0 .784 0h.002l.022-.008l.011-.005l.012-.005a1 1 0 0 0 .11-.056L20 10.618Z"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  )
}
