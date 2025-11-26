'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SquareKanbanIcon } from 'lucide-react';
import type { ComponentProps } from 'react';

import { Button, buttonVariants } from '~/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from '~/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';
import { cn } from '~/lib/utils';
import { authClient } from '@/lib/auth-client';

export function Header({ className, ...props }: ComponentProps<'header'>) {
  const pathname = usePathname();
  const isExampleActive = pathname === '/example';

  const { data: session, isPending } = authClient.useSession();

  const handleGoogleSignIn = async () => {
    try {
      await authClient.signIn.social({
        provider: 'google',
      });
    } catch (error) {
      console.error('Google sign-in failed', error);
    }
  };

  const handleSignOut = async () => {
    try {
      await authClient.signOut();
    } catch (error) {
      console.error('Sign out failed', error);
    }
  };

  const userEmail = session?.user?.email;

  return (
    <header
      className={cn(
        'fixed top-0 left-0 z-50 w-full border-b backdrop-blur-md',
        className,
      )}
      {...props}
    >
      <div className="container mx-auto flex h-(--header-height) items-center justify-between gap-2 px-4">
        <Link
          className="flex items-center gap-2 self-center font-medium"
          href="/"
        >
          <div className="bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-md sm:size-6">
            <SquareKanbanIcon className="size-6 sm:size-4" />
          </div>

          <span className="hidden font-mono sm:block">Easyble</span>
        </Link>

        <nav className="flex gap-2 sm:absolute sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2">
          <Link
            href="/example"
            className={cn(
              buttonVariants({ size: 'sm', variant: 'ghost' }),
              isExampleActive && 'bg-accent text-primary',
            )}
          >
            Example
          </Link>
        </nav>

        <div className="flex gap-2">
          {session?.user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="sm" variant="outline">
                  {userEmail ?? 'Аккаунт'}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Аккаунт</DropdownMenuLabel>
                {userEmail && (
                  <DropdownMenuItem disabled>{userEmail}</DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                  Выйти
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            !isPending && (
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="sm" variant="outline">
                    Войти
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Войти в Easyble</DialogTitle>
                    <DialogDescription>
                      Авторизуйтесь, чтобы сохранять свои доски и задачи.
                    </DialogDescription>
                  </DialogHeader>

                  <Button
                    className="mt-4 w-full"
                    variant="default"
                    onClick={handleGoogleSignIn}
                  >
                    Войти через Google
                  </Button>
                </DialogContent>
              </Dialog>
            )
          )}
        </div>
      </div>
    </header>
  );
}
