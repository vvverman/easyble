'use client';

import { CheckIcon, MoreVerticalIcon, Trash2Icon } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import {
  KanbanBoardCard,
  KanbanBoardCardButton,
  KanbanBoardCardDescription,
} from '@/new-york/ui/kanban';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Textarea } from '~/components/ui/textarea';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';
import { Sheet, SheetContent } from '../../../../components/ui/sheet';
import { Calendar } from '../../../../components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../../../../components/ui/popover';

const MAX_TITLE_LENGTH = 250;

type Card = {
  id: string;
  title: string;
  order: number;
  displayId: string;
};

type CardProps = {
  card: Card;
  onDeleteCard: (cardId: string) => void;
  onUpdateCardTitle: (cardId: string, title: string) => void;
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

export function KanbanCard({ card, onDeleteCard, onUpdateCardTitle }: CardProps) {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [draftTitle, setDraftTitle] = useState(card.title);
  const [isCompleted, setIsCompleted] = useState(false);
  const [description, setDescription] = useState('');
  const [comment, setComment] = useState('');

  const [taskType, setTaskType] = useState<TaskType>('task');

  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [startTime, setStartTime] = useState<string>('');
  const [deadlineDate, setDeadlineDate] = useState<Date | undefined>(undefined);
  const [deadlineTime, setDeadlineTime] = useState<string>('');

  useEffect(() => {
    setDraftTitle(card.title);
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

  function ensureDefaultStart() {
    if (!startDate) {
      const now = new Date();
      setStartDate(now);
      setStartTime(formatTimeValue(now));
    }
  }

  function handleSave() {
    const next = draftTitle.trim();
    if (next && next !== card.title) {
      onUpdateCardTitle(card.id, next);
    }
    setIsSheetOpen(false);
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
    // TODO: отправка комментария
    setComment('');
  }

  return (
    <>
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent
          side="right"
          className="flex h-screen max-h-screen w-[50vw] min-w-[320px] sm:max-w-none flex-col border-l bg-background p-0"
        >
          {/* Хедер */}
          <div className="border-b px-6 py-3">
            <div className="text-xs font-medium text-muted-foreground">#{card.displayId}</div>
          </div>

          {/* Тело: две равные колонки + вертикальный разделитель */}
          <div className="relative flex flex-1 overflow-hidden">
            <div className="pointer-events-none absolute inset-y-0 left-1/2 w-px bg-border" />

            {/* Левая колонка */}
            <div className="flex-1">
              <div className="h-full px-6 py-4 overflow-y-auto">
                <div className="space-y-5">
                  {/* Кнопки Выполнить / Старт */}
                  <div className="flex items-center gap-3">
                    <Button variant="outline" size="sm" className="h-8 px-4">
                      Выполнить
                    </Button>
                    <Button size="sm" className="h-8 px-4">
                      Старт
                    </Button>
                  </div>

                  {/* Заголовок */}
                  <div>
                    <Input
                      value={draftTitle}
                      onChange={(e) => handleTitleChange(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSave();
                        }
                      }}
                      className="text-sm font-medium leading-snug"
                      placeholder="Название задачи"
                    />
                  </div>

                  {/* Исполнители + тип + Дедлайн (остается наверху) */}
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

                    {/* Дедлайн – остается здесь */}
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
                      className="min-h-[140px] text-sm leading-snug"
                    />
                  </div>

                  {/* Блок под описанием: Начало, Проект, Создатель */}
                  <div className="space-y-4 text-xs">
                    {/* Начало */}
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

                    {/* Проект */}
                    <div className="space-y-1">
                      <div className="text-muted-foreground">Проект</div>
                      <Button variant="outline" size="sm" className="h-7 justify-start text-xs">
                        Выбрать проект…
                      </Button>
                    </div>

                    {/* Создатель (пока read-only) */}
                    <div className="space-y-1">
                      <div className="text-muted-foreground">Создатель</div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 justify-start text-xs cursor-default"
                        disabled
                      >
                        Неизвестно
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Правая колонка: комментарии */}
            <div className="flex flex-1 flex-col">
              <div className="flex-1 px-6 py-4">
                <div className="mb-3 text-xs font-medium text-muted-foreground">
                  Комментарии
                </div>
                <div className="h-full overflow-y-auto">
                  <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
                    Без комментариев
                  </div>
                </div>
              </div>

              <div className="border-t">
                <div className="px-6 py-3">
                  <Textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Комментарий…"
                    className="min-h-[80px] text-sm leading-snug"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendComment();
                      }
                    }}
                  />
                  <div className="mt-2 flex justify-end">
                    <Button size="sm" onClick={handleSendComment}>
                      Отправить
                    </Button>
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
          setIsSheetOpen(true);
        }}
        className="space-y-2"
      >
        <KanbanBoardCardDescription
          className={`break-words text-xs leading-snug ${
            isCompleted ? 'text-muted-foreground line-through' : ''
          }`}
        >
          {card.title}
        </KanbanBoardCardDescription>

        <div className="mt-1 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsCompleted((prev) => !prev);
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
            </button>
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
