import {
  AccessibilityIcon,
  PackageIcon,
  PaintbrushIcon,
  PaletteIcon,
  PlugIcon,
} from 'lucide-react';

import { cn } from '~/lib/utils';

const featureIconMap = {
  'zero-dependencies': PackageIcon,
  'css-performance': PaletteIcon,
  accessibility: AccessibilityIcon,
  theming: PaintbrushIcon,
  'framework-agnostic': PlugIcon,
};

const features = {
  'zero-dependencies': {
    title: 'Эмпатичные формулировки',
    description:
      'Easyble подсказывает мягкие и уважительные варианты, когда вы пишете задачи и комментарии, чтобы в тексте было меньше резкости и больше ясности.',
  },
  'css-performance': {
    title: 'Забота о команде',
    description:
      'Структура карточек помогает учитывать контекст, нагрузку и договорённости, а не только дедлайны и статус задачи.',
  },
  accessibility: {
    title: 'ИИ как бережный помощник',
    description:
      'Искусственный интеллект помогает переформулировать задачи и уточнить детали, но не навязывает решения и не подменяет живое общение.',
  },
  theming: {
    title: 'Лёгкий фокус на важном',
    description:
      'Интерфейс устроен так, чтобы не перегружать внимание: минимум визуального шума, максимум фокуса на следующем шаге команды.',
  },
  'framework-agnostic': {
    title: 'Привычные процессы, новый тон',
    description:
      'Вы по-прежнему планируете спринты и ведёте колонки, просто делаете это по‑человечески — без пассивной агрессии и микроменеджмента.',
  },
};

const imageClassNames =
  'border-border w-3xl max-w-none rounded-xl border sm:w-228 md:-ml-4 lg:-ml-0';

export function Description() {
  return (
    <div className="py-24 sm:py-32">
      <div className="px-4">
        <div className="mx-auto grid max-w-2xl grid-cols-1 items-center gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
          <div className="lg:pr-8">
            <div className="lg:max-w-xl">
              <h2 className="text-primary text-base font-semibold">
                Почему командам нравится Easyble
              </h2>

              <p className="text-foreground mt-2 text-4xl font-semibold tracking-tight text-pretty sm:text-5xl">
                Таск‑менеджер с эмпатией по умолчанию
              </p>

              <p className="text-muted-foreground mt-6 text-lg/8">
                Easyble помогает писать задачи так, чтобы их хотелось читать:
                без наездов, недосказанности и лишнего стресса. Это рабочее
                пространство, где уважение встроено в процесс.
              </p>

              <dl className="text-muted-foreground mt-10 max-w-xl space-y-8 text-base/7 lg:max-w-none">
                {Object.entries(features).map(([key, feature]) => {
                  const Icon =
                    featureIconMap[key as keyof typeof featureIconMap];
                  return (
                    <div key={feature.title} className="relative pl-9">
                      <dt className="text-foreground inline font-semibold">
                        <Icon
                          aria-hidden="true"
                          className="text-primary absolute top-1 left-1 size-5"
                        />
                        {feature.title}
                      </dt>{' '}
                      <dd className="inline">{feature.description}</dd>
                    </div>
                  );
                })}
              </dl>
            </div>
          </div>

          <img
            alt="Доска задач Easyble (светлая тема)"
            className={cn(imageClassNames, 'dark:hidden')}
            height={1442}
            src="/images/app-light.png"
            width={2432}
          />

          <img
            alt="Доска задач Easyble (тёмная тема)"
            className={cn(imageClassNames, 'hidden dark:block')}
            height={1442}
            src="/images/app-dark.png"
            width={2432}
          />
        </div>
      </div>
    </div>
  );
}
