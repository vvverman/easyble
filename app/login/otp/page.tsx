import { OtpForm } from "@/components/otp-form"

export default function LoginOtpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md rounded-xl border bg-card p-6 shadow-sm">
        <h1 className="text-2xl font-semibold mb-2">Введите код</h1>
        <p className="text-sm text-muted-foreground mb-4">
          Введите 6-значный код, который мы отправили на вашу почту.
        </p>
        <OtpForm />
      </div>
    </div>
  )
}
