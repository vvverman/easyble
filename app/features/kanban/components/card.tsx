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

const MAX_TITLE_LENGTH = 250;

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
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [draftTitle, setDraftTitle] = useState(card.title);
  const [isCompleted, setIsCompleted] = useState(false);
  const [description, setDescription] = useState('');
  const [comment, setComment] = useState('');

  useEffect(() => {
    setDraftTitle(card.title);
  }, [card.title]);

  const initials = useMemo(() => {
    const src = card.title || card.id;
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
  }, [card.title, card.id]);

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
            <div className="text-xs font-medium text-muted-foreground">#{card.id}</div>
          </div>

          {/* Тело: две равные колонки + вертикальный разделитель на всю высоту */}
          <div className="relative flex flex-1 overflow-hidden">
            {/* Вертикальный разделитель по центру, от верха тела до низа */}
            <div className="pointer-events-none absolute inset-y-0 left-1/2 w-px bg-border" />

            {/* Левая колонка: инфа о задаче */}
            <div className="flex-1">
              <div className="h-full px-6 py-4 overflow-y-auto">
                <div className="space-y-5">
                  <div className="flex items-center gap-3">
                    <Button variant="outline" size="sm" className="h-8 px-4">
                      Выполнить
                    </Button>
                    <Button size="sm" className="h-8 px-4">
                      Старт
                    </Button>
                  </div>

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

                  <div className="space-y-4 text-xs">
                    <div className="space-y-1">
                      <div className="text-muted-foreground">Исполнители</div>
                      <Button variant="outline" size="sm" className="h-7 justify-start text-xs">
                        Назначить…
                      </Button>
                    </div>
                    <div className="space-y-1">
                      <div className="text-muted-foreground">Проекты</div>
                      <Button variant="outline" size="sm" className="h-7 justify-start text-xs">
                        Выбрать проект…
                      </Button>
                    </div>
                    <div className="space-y-1">
                      <div className="text-muted-foreground">Дата</div>
                      <Button variant="outline" size="sm" className="h-7 justify-start text-xs">
                        Выбрать дату…
                      </Button>
                    </div>
                    <div className="space-y-1">
                      <div className="text-muted-foreground">Тип</div>
                      <Button variant="outline" size="sm" className="h-7 justify-start text-xs">
                        Действие
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="text-xs font-medium text-muted-foreground">Описание</div>
                    <Textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Опишите задачу подробнее…"
                      className="min-h-[140px] text-sm leading-snug"
                    />
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
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsCompleted((prev) => !prev);
            }}
            className={`flex h-5 w-5 items-center justify-center rounded-full border text-[10px] transition-colors ${
              isCompleted
                ? 'border-primary bg-primary text-primary-foreground'
                : 'border-muted-foreground/40 text-muted-foreground'
            }`}
          >
            {isCompleted && <CheckIcon size={10} />}
          </button>

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
