import type { ComponentProps } from 'react';

import { cn } from '~/lib/utils';
import { ThemeToggle } from '../color-scheme/theme-toggle';

export function Footer({ className, ...props }: ComponentProps<'footer'>) {
  return (
    <footer
      className={cn('border-t sm:h-[var(--header-height)]', className)}
      {...props}
    >
      <div className="container mx-auto flex h-full flex-col items-center justify-between gap-4 px-4 py-4 sm:flex-row md:py-0">
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <span className="text-sm text-muted-foreground">
            Светлая и тёмная темы — под настроение команды.
          </span>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>© 2025 Easyble. Эмпатичный таск‑менеджер для команд.</span>
        </div>
      </div>
    </footer>
  );
}
