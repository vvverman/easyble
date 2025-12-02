"use client"

import { useState, useTransition } from "react"
import { Plus } from "lucide-react"
import { sendBoardInvite } from "@/app/features/boards/invite-actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export function SendBoardInviteForm({ boardId }: { boardId: string }) {
  const [email, setEmail] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()
  const [open, setOpen] = useState(false)

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    if (!email) {
      setError("Укажите email")
      return
    }

    startTransition(async () => {
      try {
        const formData = new FormData()
        formData.append("email", email)
        formData.append("boardId", boardId)
        await sendBoardInvite(formData)
        setSuccess("Приглашение отправлено")
        setEmail("")
        setOpen(false)
      } catch (err: any) {
        console.error(err)
        setError(err?.message ?? "Не удалось отправить приглашение")
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          type="button"
          className="relative flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition duration-150 hover:z-10 hover:scale-110 hover:border-white/40 hover:bg-white/20"
        >
          <Plus className="h-4 w-4" />
          <span className="sr-only">Invite</span>
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite to board</DialogTitle>
          <DialogDescription>
            Укажите email пользователя. Он получит письмо и увидит доску, войдя под этим адресом.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-3">
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="user@example.com"
            required
          />
          {error && <p className="text-xs text-destructive">{error}</p>}
          {success && <p className="text-xs text-muted-foreground">{success}</p>}
          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={pending}>
              {pending ? "Sending..." : "Send invite"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
