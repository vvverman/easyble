import type { ReactElement, ReactNode } from 'react';

interface GeneralErrorBoundaryProps {
  children: ReactNode;
  fallback: ReactElement;
}

export function GeneralErrorBoundary({
  children,
  fallback,
}: GeneralErrorBoundaryProps) {
  // Поскольку react-router не нужен, просто рендерим детей без ошибок
  return <>{children}</>;
}
