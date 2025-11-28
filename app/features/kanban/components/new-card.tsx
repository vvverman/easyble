'use client';

import { useState } from 'react';
import { KanbanBoardCardTextarea, KanbanBoardColumnFooter } from '@/new-york/ui/kanban';
import { Button } from '~/components/ui/button';

type NewCardFormProps = {
  columnId: string;
  onAddCard: (columnId: string, content: string) => void;
  onCancel: () => void;
};

export function NewCardForm({ columnId, onAddCard, onCancel }: NewCardFormProps) {
  const [content, setContent] = useState('');

  function submitNewCard(e: React.FormEvent<HTMLFormElement>) {
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
        onChange={e => setContent(e.target.value)}
        onKeyDown={e => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            submitNewCard(e);
          }
        }}
      />
      <KanbanBoardColumnFooter>
        <Button size="sm" type="submit">Add</Button>
        <Button size="sm" variant="outline" type="button" onClick={onCancel}>Cancel</Button>
      </KanbanBoardColumnFooter>
    </form>
  );
}
