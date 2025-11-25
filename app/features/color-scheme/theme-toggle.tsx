'use client';

import { MonitorIcon, MoonIcon, SunIcon } from 'lucide-react';
import type { ComponentProps, MouseEvent } from 'react';
import { TbBrightness } from 'react-icons/tb';

import { Button } from '~/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';
import { cn } from '~/lib/utils';

import type { ColorScheme } from './color-scheme-constants';
import { colorSchemes } from './color-scheme-constants';
import { setColorScheme, useColorScheme } from './use-color-scheme';

type ColorSchemeButtonProps = ComponentProps<'button'> & {
  value: ColorScheme;
};

function ColorSchemeButton({
  className,
  value,
  children,
  onClick,
  ...props
}: ColorSchemeButtonProps) {
  const currentColorScheme = useColorScheme();
  const isActive = currentColorScheme === value;

  function handleClick(event: MouseEvent<HTMLButtonElement>) {
    if (!isActive) {
      setColorScheme(value);
    }

    if (onClick) {
      onClick(event);
    }
  }

  return (
    <DropdownMenuItem asChild className="w-full">
      <button
        {...props}
        type="button"
        className={cn(
          className,
          isActive && 'text-primary [&_svg]:!text-primary',
        )}
        disabled={isActive}
        onClick={handleClick}
      >
        {children}
      </button>
    </DropdownMenuItem>
  );
}

export function ThemeToggle() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          aria-label="Open theme menu"
          className="size-8"
          size="icon"
          variant="outline"
        >
          <TbBrightness />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" sideOffset={4}>
        <DropdownMenuLabel className="sr-only">Appearance</DropdownMenuLabel>

        <DropdownMenuSeparator className="sr-only" />

        <DropdownMenuGroup>
          <ColorSchemeButton value={colorSchemes.light}>
            <SunIcon />
            Light
          </ColorSchemeButton>

          <ColorSchemeButton value={colorSchemes.dark}>
            <MoonIcon />
            Dark
          </ColorSchemeButton>

          <ColorSchemeButton value={colorSchemes.system}>
            <MonitorIcon />
            System
          </ColorSchemeButton>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
