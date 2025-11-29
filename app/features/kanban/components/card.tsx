'use client';

import { CheckIcon, MoreVerticalIcon, Trash2Icon } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import {
  KanbanBoardCard,
  KanbanBoardCardButton,
  KanbanBoardCardButtonGroup,
  KanbanBoardCardDescription,
} from '@/new-york/ui/kanban';
import { Button } from '~/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '~/components/ui/dialog';
import { Input } from '~/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';

const MAX_TITLE_LENGTH = 1024;

type Card = {
  id: string;
  title: string;
  order: number;
};

type CardProps = {
  card: Card;
  onDeleteCard: (cardId: string) => void;
  onUpdateCardTitle: (cardId: string, title: string) => void;
};

export function KanbanCard({ card, onDeleteCard, onUpdateCardTitle }: CardProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [draftTitle, setDraftTitle] = useState(card.title);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    setDraftTitle(card.title);
  }, [card.title]);

  const initials = useMemo(() => {
    const src = card.title || card.id;
    return src
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((p) => p[0] || '')
      .join('')
      .toUpperCase()
      .slice(0, 2) || '?';
  }, [card.title, card.id]);

  function handleSave() {
    const next = draftTitle.trim();
    if (next && next !== card.title) {
      onUpdateCardTitle(card.id, next);
    }
    setIsDialogOpen(false);
  }

  function handleTitleChange(value: string) {
    if (value.length > MAX_TITLE_LENGTH) {
      setDraftTitle(value.slice(0, MAX_TITLE_LENGTH));
    } else {
      setDraftTitle(value);
    }
  }

  return (
    <>
      {/* правая панель задачи */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent
          className="fixed top-0 right-0 left-auto translate-x-0 translate-y-0 z-50 flex h-screen max-h-screen w-full flex-col border-l bg-background p-0 sm:w-[420px]"
        >
          <div className="border-b px-6 pt-4 pb-3 space-y-2">
            <DialogHeader className="p-0">
              <DialogTitle className="text-left text-xs font-medium text-muted-foreground">
                {card.id}
              </DialogTitle>
            </DialogHeader>
            <h2 className="text-base font-semibold leading-snug break-words">
              {draftTitle || 'Новая задача'}
            </h2>
          </div>

          <div className="border-b px-6">
            <div className="flex gap-6 text-sm">
              <button className="border-b-2 border-primary py-3 text-primary">
                Чат
              </button>
              <button className="py-3 text-muted-foreground">
                Инфо / Лог
              </button>
              <button className="py-3 text-muted-foreground">
                Описание
              </button>
              <button className="py-3 text-muted-foreground">
                Подзадачи
              </button>
            </div>
          </div>

          <div className="flex flex-1 flex-col gap-4 px-6 py-4">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Название</p>
              <div className="relative">
                <Input
                  value={draftTitle}
                  autoFocus
                  onChange={(e) => handleTitleChange(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSave();
                    }
                  }}
                  className="pr-20 text-sm leading-snug"
                />
                <span className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-[11px] text-muted-foreground">
                  {draftTitle.length} / {MAX_TITLE_LENGTH}
                </span>
              </div>
            </div>

            <div className="flex-1 rounded-md border bg-muted/30 px-4 py-3 text-sm leading-snug text-muted-foreground">
              Здесь пока пусто. Напишите сообщение в чат.
            </div>
          </div>

          <DialogFooter className="px-6 pb-4 pt-2">
            <Button
              variant="outline"
              type="button"
              onClick={() => {
                setDraftTitle(card.title);
                setIsDialogOpen(false);
              }}
            >
              Отмена
            </Button>
            <Button type="button" onClick={handleSave}>
              Сохранить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* карточка в колонке */}
      <KanbanBoardCard
        data={card}
        onClick={() => {
          setDraftTitle(card.title);
          setIsDialogOpen(true);
        }}
        className="space-y-2"
      >
        <div className="flex items-start gap-3">
          {/* чекбокс слева */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsCompleted((prev) => !prev);
            }}
            className={`mt-0.5 flex h-6 w-6 items-center justify-center rounded-full border transition-colors ${
              isCompleted
                ? 'border-primary bg-primary text-primary-foreground'
                : 'border-muted-foreground/40 text-muted-foreground'
            }`}
          >
            {isCompleted && <CheckIcon size={14} />}
          </button>

          {/* текст задачи */}
          <div className="flex-1">
            <KanbanBoardCardDescription
              className={`break-words text-xs leading-snug ${
                isCompleted ? 'text-muted-foreground line-through' : ''
              }`}
            >
              {card.title}
            </KanbanBoardCardDescription>
          </div>

          {/* меню справа */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <KanbanBoardCardButton className="ml-1 p-0 text-muted-foreground hover:text-foreground">
                <MoreVerticalIcon size={16} />
              </KanbanBoardCardButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  setIsDialogOpen(true);
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

        {/* аватар автора снизу справа */}
        <div className="mt-1 flex justify-end">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
            {initials}
          </div>
        </div>
      </KanbanBoardCard>
    </>
  );
}
