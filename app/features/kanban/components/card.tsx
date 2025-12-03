'use client';

import { CheckIcon, MoreVerticalIcon, Trash2Icon } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import {
  KanbanBoardCard,
  KanbanBoardCardButton,
  KanbanBoardCardDescription,
} from '@/new-york/ui/kanban';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTitle } from '../../../../components/ui/sheet';
import { Calendar } from '../../../../components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../../../../components/ui/popover';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Switch } from '@/components/animate-ui/components/base/switch';
import { cn } from '@/lib/utils';

const MAX_TITLE_LENGTH = 250;

type Card = {
  id: string;
  title: string;
  order: number;
  displayId: string;
  ownerName?: string | null;
  ownerEmail?: string | null;
  ownerImage?: string | null;
  path?: string | null;
  comments?: {
    id: string;
    content: string;
    createdAt?: string | null;
    authorName?: string | null;
    authorEmail?: string | null;
    authorImage?: string | null;
  }[];
  history?: {
    id: string;
    when?: string | null;
    whenTs?: number | null;
    who?: string | null;
    what?: string | null;
  }[];
  completed?: boolean;
};

type CardProps = {
  card: Card;
  onDeleteCard: (cardId: string) => void;
  onUpdateCardTitle: (cardId: string, title: string) => void;
  onCompleteCard: (cardId: string) => void;
};

type TaskType = 'task' | 'meeting' | 'call';

const TASK_TYPE_LABELS: Record<TaskType, string> = {
  task: 'Задача',
  meeting: 'Встреча',
  call: 'Созвон',
};

function formatDateLabel(date?: Date) {
  if (!date) return 'Выбрать дату';
  return date.toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

function formatTimeValue(date: Date) {
  const h = date.getHours().toString().padStart(2, '0');
  const m = date.getMinutes().toString().padStart(2, '0');
  return `${h}:${m}`;
}

export function KanbanCard({ card, onDeleteCard, onUpdateCardTitle, onCompleteCard }: CardProps) {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [draftTitle, setDraftTitle] = useState(card.title);
  const [description, setDescription] = useState('');
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState(card.comments ?? []);
  const [showComments, setShowComments] = useState(true);
  const [showHistory, setShowHistory] = useState(true);
  const [historyState, setHistoryState] = useState(
    card.history ??
      [
        {
          id: `${card.id}-created`,
          when: 'Создано',
          whenTs: Date.now(),
          who: card.ownerName || card.ownerEmail || 'Система',
          what: 'Создал задачу',
        },
      ],
  );

  const [taskType, setTaskType] = useState<TaskType>('task');

  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [startTime, setStartTime] = useState<string>('');
  const [deadlineDate, setDeadlineDate] = useState<Date | undefined>(undefined);
  const [deadlineTime, setDeadlineTime] = useState<string>('');

  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [isCompleted, setIsCompleted] = useState(card.completed ?? false);

  useEffect(() => {
    setDraftTitle(card.title);
    setIsEditingTitle(false);
    setIsCompleted(card.completed ?? false);
  }, [card.title]);

  const initials = useMemo(() => {
    const src = card.title || card.displayId;
    return (
      src
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((p) => p[0] || '')
        .join('')
        .toUpperCase()
        .slice(0, 2) || '?'
    );
  }, [card.title, card.displayId]);

  const remainingTitle = useMemo(
    () => Math.max(0, MAX_TITLE_LENGTH - draftTitle.length),
    [draftTitle],
  );

  function ensureDefaultStart() {
    if (!startDate) {
      const now = new Date();
      setStartDate(now);
      setStartTime(formatTimeValue(now));
    }
  }

  function appendHistory(what: string) {
    const now = new Date();
    const ts = now.getTime();
    setHistoryState((prev) => [
      ...prev,
      {
        id: `${card.id}-hist-${now.getTime()}-${prev.length}`,
        when: now.toLocaleString('ru-RU', {
          day: '2-digit',
          month: '2-digit',
          year: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
        }),
        whenTs: ts,
        who: card.ownerName || card.ownerEmail || 'Вы',
        what,
      },
    ]);
  }

  function handleSave() {
    const next = draftTitle.trim();
    if (next && next !== card.title) {
      onUpdateCardTitle(card.id, next);
    }
    setIsEditingTitle(false);
  }

  function handleTitleChange(value: string) {
    if (value.length > MAX_TITLE_LENGTH) {
      setDraftTitle(value.slice(0, MAX_TITLE_LENGTH));
    } else {
      setDraftTitle(value);
    }
  }

  function handleSendComment() {
    const trimmed = comment.trim();
    if (!trimmed) return;
    const now = new Date();
    setComments((prev) => [
      ...prev,
      {
        id: `${card.id}-${now.getTime()}`,
        content: trimmed,
        createdAt: now.toISOString(),
        authorName: 'Вы',
        authorEmail: card.ownerEmail ?? undefined,
        authorImage: card.ownerImage ?? undefined,
      },
    ]);
    setComment('');
  }

  function handleCompleteClick() {
    onCompleteCard(card.id);
    setIsRunning(false);
    setIsCompleted(true);
    appendHistory('Пометил как выполнено');
  }

  function handleStartPause() {
    if (isCompleted) return;
    ensureDefaultStart();
    if (isRunning) {
      setIsRunning(false);
      appendHistory('Поставил на паузу');
    } else {
      setIsRunning(true);
      appendHistory('Начал выполнение');
    }
  }

  const historyEntries = historyState;

  const feedEntries = useMemo(() => {
    const merged: { type: 'comment' | 'history'; ts: number; item: any }[] = [];
    if (showComments) {
      comments.forEach((c, idx) => {
        const ts = c.createdAt ? new Date(c.createdAt).getTime() : idx;
        merged.push({ type: 'comment', ts: isNaN(ts) ? idx : ts, item: c });
      });
    }
    if (showHistory) {
      historyEntries.forEach((h, idx) => {
        const ts =
          typeof h.whenTs === 'number'
            ? h.whenTs
            : h.when
              ? new Date(h.when).getTime()
              : idx;
        merged.push({ type: 'history', ts: isNaN(ts) ? idx : ts, item: h });
      });
    }
    return merged.sort((a, b) => a.ts - b.ts);
  }, [comments, historyEntries, showComments, showHistory]);

  const creatorLabel = card.ownerName || card.ownerEmail || 'Неизвестно';
  const pathLabel = card.path || 'Team/Project/Board';

  return (
    <>
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent
          side="right"
          className="flex h-screen max-h-screen w-[50vw] min-w-[320px] sm:max-w-none flex-col border-l bg-background p-0"
        >
          <div className="relative flex h-full flex-col">
            <div className="pointer-events-none absolute inset-y-0 left-1/2 w-px bg-border" />

            {/* Хедер */}
            <div className="border-b px-6 py-3">
              <SheetTitle className="sr-only">Карточка задачи #{card.displayId}</SheetTitle>
              <div className="text-xs font-medium text-muted-foreground">#{card.displayId}</div>
            </div>

            {/* Тело: две равные колонки */}
            <div className="flex flex-1 overflow-hidden">
              {/* Левая колонка */}
              <div className="flex-1">
                <div className="h-full px-6 py-4 overflow-y-auto">
                <div className="space-y-5">
                  {/* Кнопки / статус */}
                  <div className="flex items-center gap-3">
                    {isCompleted ? (
                      <span className="text-xs font-semibold text-emerald-500">
                        Статус: выполнена
                      </span>
                    ) : (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 px-4"
                          type="button"
                          onClick={handleCompleteClick}
                        >
                          Выполнить
                        </Button>
                        <Button
                          size="sm"
                          className="h-8 px-4"
                          type="button"
                          onClick={handleStartPause}
                        >
                          {isRunning ? 'Пауза' : 'Старт'}
                        </Button>
                      </>
                    )}
                  </div>

                  {/* Заголовок */}
                  <div className="space-y-1">
                    {isEditingTitle ? (
                      <>
                        <Textarea
                          value={draftTitle}
                          autoFocus
                          rows={3}
                          onChange={(e) => handleTitleChange(e.target.value)}
                          onBlur={handleSave}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                              e.preventDefault();
                              handleSave();
                            }
                          }}
                          className="min-h-[72px] break-all text-base font-semibold leading-snug"
                          placeholder="Название задачи"
                        />
                        <div className="flex justify-end">
                          <span className="text-[10px] text-muted-foreground">
                            {remainingTitle}
                          </span>
                        </div>
                      </>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setIsEditingTitle(true)}
                        className="flex w-full items-start rounded-md px-1 py-1 text-left hover:bg-muted/60"
                      >
                        <span className="break-all text-base font-semibold leading-snug">
                          {draftTitle || 'Название задачи'}
                        </span>
                      </button>
                    )}
                  </div>

                  {/* Исполнители + тип + Дедлайн */}
                  <div className="space-y-4 text-xs">
                    <div className="space-y-1">
                      <div className="text-muted-foreground">Исполнители</div>
                      <Button variant="outline" size="sm" className="h-7 justify-start text-xs">
                        Назначить…
                      </Button>
                    </div>
                    <div className="space-y-1">
                      <div className="text-muted-foreground">Тип</div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            className="h-7 w-40 justify-between px-3 text-xs"
                          >
                            {TASK_TYPE_LABELS[taskType]}
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start">
                          <DropdownMenuItem onClick={() => setTaskType('task')}>
                            Задача
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setTaskType('meeting')}>
                            Встреча
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setTaskType('call')}>
                            Созвон
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    {/* Дедлайн */}
                    <div className="space-y-1">
                      <div className="text-muted-foreground">Дедлайн</div>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="w-full justify-start text-left font-normal"
                          >
                            {formatDateLabel(deadlineDate)}
                            {deadlineTime && ` • ${deadlineTime}`}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <div className="flex flex-col gap-2 p-3">
                            <Calendar
                              mode="single"
                              selected={deadlineDate}
                              onSelect={(date) => setDeadlineDate(date ?? deadlineDate)}
                            />
                            <Input
                              type="time"
                              value={deadlineTime}
                              onChange={(e) => setDeadlineTime(e.target.value)}
                              className="h-8 text-xs"
                            />
                          </div>
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>

                  {/* Описание */}
                  <div className="space-y-2">
                    <div className="text-xs font-medium text-muted-foreground">Описание</div>
                    <Textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Опишите задачу подробнее…"
                      className="min-h-[140px] break-all text-sm leading-snug"
                    />
                  </div>

                  {/* Начало / Проект / Создатель */}
                  <div className="space-y-4 text-xs">
                    <div className="space-y-1">
                      <div className="text-muted-foreground">Начало</div>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="w-full justify-start text-left font-normal"
                            onClick={ensureDefaultStart}
                          >
                            {formatDateLabel(startDate)}
                            {startTime && ` • ${startTime}`}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <div className="flex flex-col gap-2 p-3">
                            <Calendar
                              mode="single"
                              selected={startDate}
                              onSelect={(date) => setStartDate(date ?? startDate)}
                            />
                            <Input
                              type="time"
                              value={startTime}
                              onChange={(e) => setStartTime(e.target.value)}
                              className="h-8 text-xs"
                            />
                          </div>
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div className="space-y-1">
                      <div className="text-muted-foreground">Путь</div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 justify-start text-xs cursor-default"
                        disabled
                      >
                        {pathLabel}
                      </Button>
                    </div>

                    <div className="space-y-1">
                      <div className="text-muted-foreground">Создатель</div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 justify-start text-xs cursor-default"
                        disabled
                      >
                        {creatorLabel}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Правая колонка: комментарии */}
            <div className="flex flex-1 flex-col">
              <div className="flex-1 px-6 py-4 space-y-3">
                <div className="h-full overflow-y-auto space-y-3 text-xs">
                  {feedEntries.length === 0 ? (
                    <div className="rounded-md border px-3 py-2 text-muted-foreground">
                      Пока нет записей
                    </div>
                  ) : (
                    feedEntries.map((entry, idx) => {
                      if (entry.type === 'history') {
                        const h = entry.item as typeof historyEntries[number];
                        return (
                          <div
                            key={`hist-${h.id}-${idx}`}
                            className="text-[11px] text-muted-foreground text-center flex items-center justify-center gap-2"
                          >
                            {h.when && <span>{h.when}</span>}
                            {h.when && (h.who || h.what) && (
                              <span className="mx-1 text-muted-foreground/60">•</span>
                            )}
                            {h.who && <span className="truncate">{h.who}</span>}
                            {h.who && h.what && (
                              <span className="mx-1 text-muted-foreground/60">•</span>
                            )}
                            {h.what && <span className="truncate">{h.what}</span>}
                          </div>
                        );
                      }

                      const c = entry.item as (typeof comments)[number];
                      const author = c.authorName || c.authorEmail || 'Без имени';
                      const initials =
                        (author ?? '')
                          .split(/\s+/)
                          .map((p) => p[0] || '')
                          .join('')
                          .slice(0, 2)
                          .toUpperCase() || '?';
                      const when = c.createdAt
                        ? new Date(c.createdAt).toLocaleString('ru-RU', {
                            day: '2-digit',
                            month: '2-digit',
                            year: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit',
                          })
                        : '';
                      const bubbleTone =
                        idx % 2 === 0
                          ? 'bg-muted/80 border border-border/70'
                          : 'bg-primary/10 border border-primary/20';

                      return (
                        <div key={`comm-${c.id}-${idx}`} className="flex items-start gap-2">
                          <Avatar className="h-7 w-7 border">
                            {c.authorImage ? (
                              <AvatarImage src={c.authorImage} alt={author} />
                            ) : null}
                            <AvatarFallback className="text-[10px]">{initials}</AvatarFallback>
                          </Avatar>
                          <div className="flex flex-1 flex-col">
                            <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                              <span className="font-medium text-foreground">{author}</span>
                              <span>{when}</span>
                            </div>
                            <div
                              className={cn(
                                'mt-1 w-fit max-w-[80%] rounded-2xl px-3 py-2 text-[13px] leading-snug text-foreground',
                                bubbleTone,
                              )}
                            >
                              <span className="whitespace-pre-wrap break-words">{c.content}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              <div className="border-t">
                <div className="px-6 py-3 space-y-3">
                  <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                    <label className="flex items-center gap-2">
                      <Switch
                        checked={showComments}
                        onCheckedChange={(checked) => {
                          if (!checked && !showHistory) return;
                          setShowComments(!!checked);
                          if (!checked && showHistory === false) setShowHistory(true);
                        }}
                      />
                      <span className="text-foreground">Комменты</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <Switch
                        checked={showHistory}
                        onCheckedChange={(checked) => {
                          if (!checked && !showComments) return;
                          setShowHistory(!!checked);
                          if (!checked && showComments === false) setShowComments(true);
                        }}
                      />
                      <span className="text-foreground">Логи</span>
                    </label>
                  </div>
                  <Textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Комментарий…"
                    className="min-h-[80px] break-all text-sm leading-snug"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendComment();
                      }
                    }}
                  />
                  <div className="text-xs text-muted-foreground">
                    Нажмите Enter, чтобы отправить
                  </div>
                  <div className="mt-2 flex justify-end">
                    <Button size="sm" onClick={handleSendComment}>
                      Отправить
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        </SheetContent>
      </Sheet>

      {/* Карточка в колонке */}
      <KanbanBoardCard
        data={card}
      onClick={() => {
        setDraftTitle(card.title);
        ensureDefaultStart();
        setIsEditingTitle(false);
        setIsSheetOpen(true);
        setIsRunning(false);
        setIsCompleted(card.completed ?? isCompleted);
      }}
      className="space-y-2"
    >
      <KanbanBoardCardDescription
        className={`break-all text-xs leading-snug ${
            isCompleted ? 'text-muted-foreground line-through' : ''
          }`}
      >
        {card.title}
      </KanbanBoardCardDescription>

        <div className="mt-1 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              role="button"
              tabIndex={0}
              onClick={(e) => {
                e.stopPropagation();
                setIsCompleted((prev) => {
                  const next = !prev;
                  if (next) {
                    appendHistory('Пометил как выполнено');
                  } else {
                    appendHistory('Вернул в работу');
                  }
                  return next;
                });
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsCompleted((prev) => {
                    const next = !prev;
                    if (next) {
                      appendHistory('Пометил как выполнено');
                    } else {
                      appendHistory('Вернул в работу');
                    }
                    return next;
                  });
                }
              }}
              className={`flex h-5 w-5 items-center justify-center rounded-full border text-[10px] transition-colors ${
                isCompleted
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-muted-foreground/40 bg-background text-muted-foreground'
              }`}
            >
              <CheckIcon
                size={10}
                className={isCompleted ? '' : 'text-muted-foreground/60'}
              />
            </div>
            <span className="text-[11px] font-medium text-muted-foreground">
              #{card.displayId}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[9px] font-medium text-primary-foreground">
              {initials}
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <KanbanBoardCardButton className="h-5 w-5 p-0 text-muted-foreground hover:text-foreground">
                  <MoreVerticalIcon size={14} />
                </KanbanBoardCardButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    ensureDefaultStart();
                    setDraftTitle(card.title);
                    setIsEditingTitle(false);
                    setIsSheetOpen(true);
                  }}
                >
                  Изменить
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-destructive"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteCard(card.id);
                  }}
                >
                  <Trash2Icon className="mr-2 h-4 w-4" />
                  Удалить
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </KanbanBoardCard>
    </>
  );
}
