"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { authClient } from "@/lib/auth-client"

export function OtpForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get("email") || ""
  const length = 6
  const [digits, setDigits] = useState<string[]>(Array(length).fill(""))
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const inputRefs = useRef<Array<HTMLInputElement | null>>([])

  useEffect(() => {
    inputRefs.current[0]?.focus()
  }, [])

  const code = digits.join("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (!email) {
      setError("Email не указан")
      return
    }
    if (code.length < length) {
      setError(`Введите ${length}-значный код`)
      return
    }
    try {
      setIsSubmitting(true)
      await authClient.signIn.emailOtp({
        email,
        otp: code,
        callbackURL: "/login/complete",
      })
      router.push("/login/complete")
    } catch (err: any) {
      console.error(err)
      setError(err?.message ?? "Неверный код")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleResend = async () => {
    if (!email) {
      setError("Email не указан")
      return
    }
    setError(null)
    try {
      await fetch("/api/auth/email-otp/send-verification-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, type: "sign-in" }),
      })
    } catch (err: any) {
      console.error(err)
      setError(err?.message ?? "Не удалось отправить код")
    }
  }

  const setDigit = (index: number, value: string) => {
    const char = value.replace(/\D/g, "").slice(-1)
    if (!char && value.length > 1) return
    setDigits((prev) => {
      const next = [...prev]
      next[index] = char ?? ""
      return next
    })
  }

  const handleChange = (index: number, value: string) => {
    setDigit(index, value)
    if (value && index < length - 1) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
    if (e.key === "ArrowLeft" && index > 0) {
      e.preventDefault()
      inputRefs.current[index - 1]?.focus()
    }
    if (e.key === "ArrowRight" && index < length - 1) {
      e.preventDefault()
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handlePaste = (index: number, e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length)
    if (!text) return
    const next = [...digits]
    for (let i = 0; i < text.length && index + i < length; i++) {
      next[index + i] = text[i]
    }
    setDigits(next)
    const focusIdx = Math.min(index + text.length, length - 1)
    inputRefs.current[focusIdx]?.focus()
  }

  if (!email) {
    return (
      <div className="text-sm text-muted-foreground">
        Не указан email. Вернитесь на страницу входа.
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-sm">
      <p className="text-sm text-muted-foreground">
        We sent a {length}-digit code to your email {email}
      </p>

      <div className="flex items-center justify-between gap-2">
        {Array.from({ length }).map((_, idx) => (
          <input
            key={idx}
            ref={(el) => (inputRefs.current[idx] = el)}
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={1}
            value={digits[idx]}
            onChange={(e) => handleChange(idx, e.target.value)}
            onKeyDown={(e) => handleKeyDown(idx, e)}
            onPaste={(e) => handlePaste(idx, e)}
            className="h-12 w-10 rounded-md border border-white/10 bg-white/5 text-center text-lg font-semibold text-white shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        ))}
      </div>

      <p className="text-xs text-muted-foreground">
        Enter the {length}-digit code sent to your email.
      </p>

      {error && <p className="text-xs text-destructive">{error}</p>}

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Verifying..." : "Verify"}
      </Button>

      <p className="text-xs text-muted-foreground text-center">
        Didn&apos;t receive the code?{" "}
        <button
          type="button"
          onClick={handleResend}
          className="underline underline-offset-4 text-foreground"
        >
          Resend
        </button>
      </p>
    </form>
  )
}
