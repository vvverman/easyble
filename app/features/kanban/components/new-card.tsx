'use client';

import { useMemo, useState } from 'react';
import { CheckIcon, MoreVerticalIcon } from 'lucide-react';
import { KanbanBoardCard } from '@/new-york/ui/kanban';
import { Input } from '~/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';

const MAX_TITLE_LENGTH = 250;

type NewCardFormProps = {
  columnId: string;
  onAddCard: (columnId: string, content: string) => void;
  onCancel: () => void;
};

export function NewCardForm({ columnId, onAddCard, onCancel }: NewCardFormProps) {
  const [content, setContent] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);

  const initials = useMemo(() => {
    const src = content || '??';
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
  }, [content]);

  function handleChange(value: string) {
    if (value.length > MAX_TITLE_LENGTH) {
      setContent(value.slice(0, MAX_TITLE_LENGTH));
    } else {
      setContent(value);
    }
  }

  function submitNewCard(e: React.FormEvent<HTMLFormElement> | React.KeyboardEvent) {
    e.preventDefault();
    const trimmed = content.trim();
    if (!trimmed) return;
    onAddCard(columnId, trimmed);
    setContent('');
    onCancel();
  }

  const remaining = Math.max(0, MAX_TITLE_LENGTH - content.length);

  return (
    <form className="px-2 pt-1" onSubmit={submitNewCard}>
      <KanbanBoardCard data={{ id: 'new' }} className="space-y-2">
        <Input
          autoFocus
          value={content}
          onChange={(e) => handleChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              submitNewCard(e);
            }
            if (e.key === 'Escape') {
              e.preventDefault();
              onCancel();
            }
          }}
          placeholder="Новая задача"
          className="h-auto border-none bg-transparent p-0 text-xs leading-snug shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
        />

        <div className="mt-1 flex items-center justify-between">
          <div className="flex items-center gap-1">
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
            <span className="text-[10px] text-muted-foreground">
              {remaining}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[9px] font-medium text-primary-foreground">
              {initials}
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  onClick={(e) => e.stopPropagation()}
                  className="flex h-5 w-5 items-center justify-center text-muted-foreground hover:text-foreground"
                >
                  <MoreVerticalIcon size={14} />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    submitNewCard(e as any);
                  }}
                >
                  Создать
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    onCancel();
                  }}
                >
                  Отменить
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </KanbanBoardCard>
    </form>
  );
}
