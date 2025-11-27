/* eslint-disable unicorn/no-null */

// В продакшене color scheme можно будет реализовать через куки/headers.
// Здесь оставляем минимальный серверный модуль-заглушку без react-router.

export type ColorScheme = "light" | "dark" | "system";

export function getColorScheme(): ColorScheme {
  // Пока просто всегда возвращаем "system".
  return "system";
}

export async function setColorScheme(_scheme: ColorScheme): Promise<void> {
  // Заглушка: здесь можно будет реализовать установку схемы через куки/БД.
  return;
}
