"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { completeProfile } from "~/features/account/complete-profile"

export type CompleteProfileProps = {
  email: string
  displayName: string
  username: string
  avatar: string
}

export function CompleteProfileClient({ initial }: { initial: CompleteProfileProps }) {
  const router = useRouter()
  const [displayName, setDisplayName] = useState(initial.displayName)
  const [username, setUsername] = useState(initial.username)
  const [avatar, setAvatar] = useState(initial.avatar)
  const [pending, setPending] = useState(false)

  const email = initial.email

  useEffect(() => {
    setDisplayName(initial.displayName)
    setUsername(initial.username)
    setAvatar(initial.avatar)
  }, [initial.displayName, initial.username, initial.avatar])

  const canSubmit = useMemo(() => {
    return (displayName?.trim() || username?.trim()) && email
  }, [displayName, username, email])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!canSubmit) return
    setPending(true)
    try {
      await completeProfile({
        displayName: displayName.trim() || username.trim(),
        username: username.trim() || email.split("@")[0] || "",
        avatar: avatar.trim() || null,
        email,
      })
      router.push("/projects")
    } catch (error) {
      console.error("Profile update failed", error)
      setPending(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0c0c0c] text-white flex items-center justify-center px-4 py-12">
      <Card className="w-full max-w-2xl bg-[#0f0f0f] border-white/10 p-8">
        <div className="mb-6 space-y-2 text-center">
          <h1 className="text-2xl font-semibold">Complete your profile</h1>
          <p className="text-sm text-white/70">
            Мы создали аккаунт по вашей почте. Проверьте данные ниже и при необходимости обновите.
          </p>
        </div>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label className="text-white" htmlFor="email">Email</Label>
            <Input id="email" value={email} readOnly className="border-white/10 bg-white/5 text-white" />
          </div>
          <div className="space-y-2">
            <Label className="text-white" htmlFor="displayName">Имя</Label>
            <Input
              id="displayName"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Ваше имя"
              className="border-white/10 bg-white/5 text-white placeholder:text-white/40"
              required
            />
          </div>
          <div className="space-y-2">
            <Label className="text-white" htmlFor="username">Username</Label>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="username"
              className="border-white/10 bg-white/5 text-white placeholder:text-white/40"
              required
            />
          </div>
          <div className="space-y-2">
            <Label className="text-white" htmlFor="avatar">Avatar URL</Label>
            <Input
              id="avatar"
              value={avatar}
              onChange={(e) => setAvatar(e.target.value)}
              placeholder="https://..."
              className="border-white/10 bg-white/5 text-white placeholder:text-white/40"
            />
          </div>
          <Button type="submit" disabled={!canSubmit || pending} className="w-full bg-white text-black hover:bg-white/90">
            {pending ? "Сохраняем..." : "Продолжить"}
          </Button>
        </form>
      </Card>
    </div>
  )
}
