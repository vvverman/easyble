'use client';

import { PlusIcon } from 'lucide-react';
import { useState } from 'react';
import { kanbanBoardColumnClassNames } from '@/new-york/ui/kanban';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import {
  KanbanBoardColumnFooter,
  KanbanBoardColumnHeader,
} from '@/new-york/ui/kanban';

type NewColumnProps = {
  onAddColumn: (title: string) => void;
};

export function MyNewKanbanBoardColumn({ onAddColumn }: NewColumnProps) {
  const [isAdding, setIsAdding] = useState(false);

  if (isAdding) {
    return (
      <form
        className={kanbanBoardColumnClassNames}
        onSubmit={(e) => {
          e.preventDefault();
          const fd = new FormData(e.currentTarget);
          onAddColumn(fd.get('title') as string);
          setIsAdding(false);
        }}
      >
        <KanbanBoardColumnHeader>
          <Input name="title" autoFocus placeholder="Column title..." />
        </KanbanBoardColumnHeader>
        <KanbanBoardColumnFooter>
          <Button size="sm" type="submit">Add</Button>
          <Button size="sm" variant="outline" type="button" onClick={() => setIsAdding(false)}>Cancel</Button>
        </KanbanBoardColumnFooter>
      </form>
    );
  }

  return (
    <Button onClick={() => setIsAdding(true)} variant="outline">
      <PlusIcon /> <span className="sr-only">Add Column</span>
    </Button>
  );
}
