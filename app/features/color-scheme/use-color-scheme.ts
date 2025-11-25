'use client';

import { useEffect, useState } from 'react';

import type { ColorScheme } from './color-scheme-constants';
import { colorSchemes } from './color-scheme-constants';

const STORAGE_KEY = 'color-scheme';

function applyColorSchemeToDocument(colorScheme: ColorScheme) {
  if (typeof document === 'undefined') return;

  if (colorScheme === colorSchemes.system) {
    const media = window.matchMedia?.('(prefers-color-scheme: dark)');
    if (media?.matches) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    return;
  }

  if (colorScheme === colorSchemes.dark) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
}

function readInitialColorScheme(): ColorScheme {
  if (typeof window === 'undefined') {
    return colorSchemes.system;
  }

  const stored = window.localStorage.getItem(STORAGE_KEY) as ColorScheme | null;

  if (
    stored === colorSchemes.light ||
    stored === colorSchemes.dark ||
    stored === colorSchemes.system
  ) {
    return stored;
  }

  const prefersDark = window.matchMedia?.(
    '(prefers-color-scheme: dark)',
  ).matches;

  return prefersDark ? colorSchemes.dark : colorSchemes.light;
}

let externalSetColorScheme:
  | ((colorScheme: ColorScheme) => void)
  | null = null;

export function setColorScheme(colorScheme: ColorScheme) {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(STORAGE_KEY, colorScheme);
  }

  applyColorSchemeToDocument(colorScheme);

  if (externalSetColorScheme) {
    externalSetColorScheme(colorScheme);
  }
}

export function useColorScheme(): ColorScheme {
  const [colorScheme, setColorSchemeState] = useState<ColorScheme>(
    colorSchemes.system,
  );

  useEffect(() => {
    const initial = readInitialColorScheme();
    setColorSchemeState(initial);
    applyColorSchemeToDocument(initial);
    externalSetColorScheme = setColorSchemeState;

    const media = window.matchMedia?.('(prefers-color-scheme: dark)');
    if (!media) return;

    const handleChange = (event: MediaQueryListEvent) => {
      const stored = window.localStorage.getItem(
        STORAGE_KEY,
      ) as ColorScheme | null;

      if (!stored || stored === colorSchemes.system) {
        const nextScheme = event.matches
          ? colorSchemes.dark
          : colorSchemes.light;
        applyColorSchemeToDocument(nextScheme);
        setColorSchemeState(nextScheme);
      }
    };

    media.addEventListener('change', handleChange);

    return () => {
      media.removeEventListener('change', handleChange);

      if (externalSetColorScheme === setColorSchemeState) {
        externalSetColorScheme = null;
      }
    };
  }, []);

  return colorScheme;
}
