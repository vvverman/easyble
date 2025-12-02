"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { authClient } from "@/lib/auth-client"

export function OtpForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get("email") || ""
  const [code, setCode] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const inputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (!email) {
      setError("Email не указан")
      return
    }
    if (code.length < 6) {
      setError("Введите 6-значный код")
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

  if (!email) {
    return (
      <div className="text-sm text-muted-foreground">
        Не указан email. Вернитесь на страницу входа.
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-sm">
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">
          Мы отправили код на {email}
        </p>
        <Input
          ref={inputRef}
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={6}
          placeholder="••••••"
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\\D/g, "").slice(0, 6))}
          className="text-center text-lg tracking-[0.4em]"
        />
      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}
      <div className="flex gap-2">
        <Button type="submit" className="flex-1" disabled={isSubmitting}>
          {isSubmitting ? "Проверяем..." : "Войти"}
        </Button>
        <Button type="button" variant="outline" onClick={handleResend}>
          Отправить код снова
        </Button>
      </div>
    </form>
  )
}
