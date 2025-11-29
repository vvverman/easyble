'use client';

import { useState } from 'react';
import { KanbanBoardCardTextarea } from '@/new-york/ui/kanban';
import { Button } from '~/components/ui/button';

const MAX_CONTENT_LENGTH = 1024;

type NewCardFormProps = {
  columnId: string;
  onAddCard: (columnId: string, content: string) => void;
  onCancel: () => void;
};

export function NewCardForm({ columnId, onAddCard, onCancel }: NewCardFormProps) {
  const [content, setContent] = useState('');

  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const value = e.target.value.slice(0, MAX_CONTENT_LENGTH);
    setContent(value);
  }

  function submitNewCard(e: React.FormEvent<HTMLFormElement> | React.KeyboardEvent) {
    e.preventDefault();
    const trimmed = content.trim();
    if (trimmed) {
      onAddCard(columnId, trimmed);
      setContent('');
      onCancel();
    }
  }

  return (
    <form className="px-2 pt-1" onSubmit={submitNewCard}>
      <KanbanBoardCardTextarea
        name="content"
        autoFocus
        placeholder="New task..."
        value={content}
        onChange={handleChange}
        onKeyDown={e => {
          if (e.key === 'Enter' && !e.shiftKey) {
            submitNewCard(e);
          }
          if (e.key === 'Escape') {
            e.preventDefault();
            onCancel();
          }
        }}
        maxLength={MAX_CONTENT_LENGTH}
        className="text-sm leading-snug"
      />
      <div className="mt-1 flex justify-between items-center">
        <div className="text-[10px] text-muted-foreground">
          {content.length} / {MAX_CONTENT_LENGTH}
        </div>
        <Button size="sm" type="submit">
          Add
        </Button>
      </div>
    </form>
  );
}
