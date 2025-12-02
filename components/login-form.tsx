"use client"

"use client"

import Link from "next/link"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { authClient } from "@/lib/auth-client"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
  }

  const handleGoogle = async () => {
    await authClient.signIn.social({ provider: "google", callbackURL: "/login/complete" })
  }

  return (
    <form
      className={cn("flex flex-col gap-6", className)}
      onSubmit={handleSubmit}
      {...props}
    >
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input id="email" type="email" placeholder="m@example.com" required />
        </Field>
        <Field>
          <div className="flex items-center">
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <Link
              href="/forgot"
              className="ml-auto text-sm underline-offset-4 hover:underline"
            >
              Forgot your password?
            </Link>
          </div>
          <Input id="password" type="password" required />
        </Field>
        <Field>
          <Button type="submit">Login</Button>
        </Field>
        <FieldSeparator>Or continue with</FieldSeparator>
        <Field>
          <Button variant="outline" type="button" onClick={handleGoogle}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="size-4"
            >
              <path
                fill="currentColor"
                d="M21.35 11.1h-9.18v2.92h5.27c-.23 1.24-.95 2.3-2.03 3.01v2.5h3.28c1.93-1.78 3.04-4.4 3.04-7.52 0-.73-.07-1.44-.21-2.11z"
              />
              <path
                fill="currentColor"
                d="M12.17 22c2.75 0 5.06-.9 6.75-2.47l-3.28-2.5c-.91.61-2.08.97-3.47.97-2.67 0-4.93-1.8-5.74-4.22H3.07v2.64C4.76 19.98 8.17 22 12.17 22z"
              />
              <path
                fill="currentColor"
                d="M6.43 13.78c-.21-.61-.33-1.27-.33-1.94s.12-1.33.33-1.94V7.26H3.07C2.39 8.65 2 10.23 2 11.84c0 1.61.39 3.19 1.07 4.58l3.36-2.64z"
              />
              <path
                fill="currentColor"
                d="M12.17 5.33c1.49 0 2.83.51 3.88 1.52l2.9-2.9C17.21 2.74 14.9 2 12.17 2 8.17 2 4.76 4.02 3.07 7.26l3.36 2.64c.81-2.42 3.07-4.22 5.74-4.22z"
              />
            </svg>
            Login with Google
          </Button>
          <FieldDescription className="text-center" />
        </Field>
      </FieldGroup>
    </form>
  )
}
