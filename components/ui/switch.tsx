"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

type SwitchProps = {
  checked?: boolean
  defaultChecked?: boolean
  onCheckedChange?: (checked: boolean) => void
} & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onChange">

export const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>(
  ({ checked, defaultChecked, onCheckedChange, className, ...props }, ref) => {
    const [internal, setInternal] = React.useState<boolean>(defaultChecked ?? false)
    const isControlled = checked !== undefined
    const value = isControlled ? checked : internal

    const toggle = () => {
      const next = !value
      if (!isControlled) setInternal(next)
      onCheckedChange?.(next)
    }

    return (
      <button
        type="button"
        role="switch"
        aria-checked={value}
        onClick={toggle}
        ref={ref}
        className={cn(
          "relative inline-flex h-5 w-9 items-center rounded-full border border-border bg-muted transition",
          value && "bg-primary/70",
          className,
        )}
        {...props}
      >
        <span
          className={cn(
            "inline-block h-4 w-4 translate-x-0.5 rounded-full bg-background shadow transition",
            value && "translate-x-4",
          )}
        />
      </button>
    )
  },
)
Switch.displayName = "Switch"
