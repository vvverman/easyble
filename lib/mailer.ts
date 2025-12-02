import nodemailer from "nodemailer"

type MailerConfig = {
  host: string
  port: number
  user: string
  pass: string
  from: string
  secure?: boolean
}

const required = ["SMTP_HOST", "SMTP_PORT", "SMTP_USER", "SMTP_PASS", "SMTP_FROM"] as const

function getConfig(): MailerConfig {
  const missing: string[] = []
  const env: Record<string, string | undefined> = {}

  for (const key of required) {
    env[key] = process.env[key]
    if (!env[key]) missing.push(key)
  }

  if (missing.length) {
    throw new Error(`Missing SMTP config: ${missing.join(", ")}`)
  }

  return {
    host: env.SMTP_HOST!,
    port: Number(env.SMTP_PORT),
    user: env.SMTP_USER!,
    pass: env.SMTP_PASS!,
    from: env.SMTP_FROM!,
    secure: process.env.SMTP_SECURE === "true",
  }
}

let cachedTransporter: any = null

function getTransporter() {
  if (cachedTransporter) return cachedTransporter
  const cfg = getConfig()
  cachedTransporter = nodemailer.createTransport({
    host: cfg.host,
    port: cfg.port,
    secure: cfg.secure ?? cfg.port === 465,
    auth: {
      user: cfg.user,
      pass: cfg.pass,
    },
  })
  return cachedTransporter
}

export type SendMailInput = {
  to: string
  subject: string
  text?: string
  html?: string
}

export async function sendMail({ to, subject, text, html }: SendMailInput) {
  const transporter = getTransporter()
  const cfg = getConfig()

  await transporter.sendMail({
    from: cfg.from,
    to,
    subject,
    text,
    html,
  })
}

// Convenience example: invitation
export async function sendInviteEmail(to: string, inviteLink: string) {
  const subject = "You're invited"
  const text = `Вас пригласили в проект. Перейдите по ссылке: ${inviteLink}`
  const html = `<p>Вас пригласили в проект.</p><p><a href="${inviteLink}">Открыть приглашение</a></p>`
  await sendMail({ to, subject, text, html })
}
