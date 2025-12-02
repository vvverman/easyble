"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { requestPasswordReset } from "~/features/auth/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function ForgotPage() {
  const router = useRouter()
  const [identifier, setIdentifier] = useState("")
  const [pending, setPending] = useState(false)
  const [done, setDone] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!identifier.trim()) return
    setPending(true)
    await requestPasswordReset(new FormData(e.target as HTMLFormElement))
    setPending(false)
    setDone(true)
  }

  return (
    <div className="min-h-screen bg-[#0b0b0b] text-white flex items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md bg-[#0f0f0f] border-white/10">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-2xl font-semibold">Forgot password</CardTitle>
          <CardDescription className="text-white/70">
            Введите email или username — отправим ссылку для восстановления.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {done ? (
            <p className="text-sm text-white/80 text-center">
              Если такой пользователь есть, мы отправили письмо с инструкцией на его почту.
            </p>
          ) : (
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label htmlFor="identifier" className="text-white">Email или username</Label>
                <Input
                  id="identifier"
                  name="identifier"
                  placeholder="you@example.com или username"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="border-white/10 bg-white/5 text-white placeholder:text-white/40"
                  required
                />
              </div>
              <Button type="submit" className="w-full bg-white text-black hover:bg-white/90" disabled={pending}>
                {pending ? "Отправляем..." : "Отправить письмо"}
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="w-full text-white/80 hover:text-white"
                onClick={() => router.push("/login")}
              >
                Вернуться ко входу
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
