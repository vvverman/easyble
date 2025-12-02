'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';
import type { ComponentProps } from 'react';

import { Button, buttonVariants } from '~/components/ui/button';
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
  const router = useRouter();
  const isExampleActive = pathname === '/example';

  const { data: session, isPending } = authClient.useSession();

  const handleSignOut = async () => {
    try {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            router.push('/');
          },
        },
      });
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
            <Image
              src="/favicon.ico"
              alt="Easyble"
              width={24}
              height={24}
              className="rounded-md sm:size-4"
            />
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
            Доска
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
              <Link
                href="/login"
                className={buttonVariants({ size: 'sm', variant: 'outline' })}
              >
                Войти
              </Link>
            )
          )}
        </div>
      </div>
    </header>
  );
}
