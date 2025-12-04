'use client';

import { MoreHorizontalIcon, PlusIcon } from 'lucide-react';
import { useState } from 'react';
import Image from 'next/image';
import type { KanbanBoardDropDirection } from '@/new-york/ui/kanban';
import {
  KanbanBoardColumn,
  KanbanBoardColumnHeader,
  KanbanBoardColumnIconButton,
  KanbanBoardColumnList,
  KanbanBoardColumnListItem,
  KanbanBoardColumnTitle,
  KanbanColorCircle,
} from '@/new-york/ui/kanban';
import { Button } from '~/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';
import { Input } from '~/components/ui/input';
import { KanbanCard } from './card';
import { NewCardForm } from './new-card';
import SimpleBar from 'simplebar-react';

type KanbanColor =
  | 'blue'
  | 'yellow'
  | 'green'
  | 'primary'
  | 'cyan'
  | 'gray'
  | 'indigo'
  | 'pink'
  | 'purple'
  | 'red'
  | 'violet';

type Card = {
  id: string;
  title: string;
  order: number;
  displayId: string;
  columnId?: string;
  ownerName?: string | null;
  ownerEmail?: string | null;
  ownerImage?: string | null;
  members?: { id?: string; name?: string | null; email?: string | null; image?: string | null }[];
  path?: string;
  comments?: {
    id: string;
    content: string;
    createdAt: string;
    authorName?: string | null;
    authorEmail?: string | null;
    authorImage?: string | null;
  }[];
  completed?: boolean;
};

type Column = {
  id: string;
  title: string;
  color: KanbanColor;
  items: Card[];
  order: number;
};

type ColumnProps = {
  column: Column;
  statusOptions: { id: string; title: string }[];
  onAddCard: (columnId: string, content: string) => void;
  onDeleteCard: (cardId: string) => void;
  onDeleteColumn: (columnId: string) => void;
  onMoveCardToColumn: (columnId: string, index: number, card: Card) => void;
  onUpdateCardTitle: (cardId: string, title: string) => void;
  onUpdateColumnTitle: (columnId: string, title: string) => void;
  onCompleteCard: (cardId: string) => void;
  onDragCancel: (cardId: string) => void;
  onDragEnd: (cardId: string, overId: string) => void;
  onOpenEasyble?: () => void;
};

export function KanbanColumn({
  column,
  statusOptions,
  onAddCard,
  onDeleteCard,
  onDeleteColumn,
  onMoveCardToColumn,
  onUpdateCardTitle,
  onUpdateColumnTitle,
  onCompleteCard,
  onDragCancel,
  onDragEnd,
  onOpenEasyble,
}: ColumnProps) {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isAddingCard, setIsAddingCard] = useState(false);

  function handleDropOverColumn(dataTransferData: string) {
    const card = JSON.parse(dataTransferData) as Card;
    onMoveCardToColumn(column.id, 0, card);
  }

  function handleDropOverListItem(cardId: string) {
    return (dataTransferData: string, dropDirection: KanbanBoardDropDirection) => {
      const card = JSON.parse(dataTransferData) as Card;
      const currentCardIndex = column.items.findIndex((item) => item.id === card.id);
      const targetCardIndex = column.items.findIndex((item) => item.id === cardId);

      const baseIndex = dropDirection === 'top' ? targetCardIndex : targetCardIndex + 1;
      let finalIndex = baseIndex;
      if (currentCardIndex !== -1 && currentCardIndex < baseIndex) {
        finalIndex = baseIndex - 1;
      }

      const safeIndex = Math.max(0, Math.min(finalIndex, column.items.length));
      const overCard = column.items[safeIndex];

      if (card.id === overCard?.id) {
        onDragCancel(card.id);
      } else {
        onMoveCardToColumn(column.id, safeIndex, card);
        onDragEnd(card.id, overCard?.id || column.id);
      }
    };
  }

  return (
    <KanbanBoardColumn
      columnId={column.id}
      onDropOverColumn={handleDropOverColumn}
      className="w-[290px]"
    >
      <KanbanBoardColumnHeader>
        {isEditingTitle ? (
          <form
            className="w-full"
            onSubmit={(e) => {
              e.preventDefault();
              const fd = new FormData(e.currentTarget);
              onUpdateColumnTitle(column.id, fd.get('title') as string);
              setIsEditingTitle(false);
            }}
          >
            <Input
              name="title"
              defaultValue={column.title}
              autoFocus
              onBlur={() => setIsEditingTitle(false)}
            />
          </form>
        ) : (
          <>
            <KanbanBoardColumnTitle columnId={column.id}>
              <KanbanColorCircle color={column.color} />
              {column.title}
            </KanbanBoardColumnTitle>
            <div className="flex items-center gap-1">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <KanbanBoardColumnIconButton>
                    <MoreHorizontalIcon />
                  </KanbanBoardColumnIconButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setIsEditingTitle(true)}>
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onDeleteColumn(column.id)}>
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <KanbanBoardColumnIconButton onClick={() => setIsAddingCard(true)}>
                <PlusIcon />
              </KanbanBoardColumnIconButton>
              <KanbanBoardColumnIconButton title="Easyble" onClick={() => onOpenEasyble?.()}>
                <Image
                  src="/images/icon-easyble-24-white.svg"
                  alt="Easyble"
                  width={16}
                  height={16}
                  className="opacity-80"
                  priority
                />
              </KanbanBoardColumnIconButton>
            </div>
          </>
        )}
      </KanbanBoardColumnHeader>

      {isAddingCard && (
        <NewCardForm
          columnId={column.id}
          onAddCard={onAddCard}
          onCancel={() => setIsAddingCard(false)}
        />
      )}

      <div className="flex-1 min-h-0 -mb-2 overflow-hidden">
        <SimpleBar
          style={{ maxHeight: 'calc(100vh - 120px)' }}
          autoHide
        >
          <KanbanBoardColumnList className="space-y-2">
            {column.items.map((card) => (
              <KanbanBoardColumnListItem
                key={card.id}
                cardId={card.id}
                onDropOverListItem={handleDropOverListItem(card.id)}
              >
                <KanbanCard
                  card={card}
                  columnId={column.id}
                  statusOptions={statusOptions}
                  onChangeStatus={(cardId, nextColumnId) => {
                    if (!nextColumnId || nextColumnId === column.id) return;
                    onMoveCardToColumn(nextColumnId, 0, { ...card, id: cardId, columnId: nextColumnId });
                  }}
                  onDeleteCard={onDeleteCard}
                  onUpdateCardTitle={onUpdateCardTitle}
                  onCompleteCard={onCompleteCard}
                />
              </KanbanBoardColumnListItem>
            ))}
          </KanbanBoardColumnList>
        </SimpleBar>
      </div>
    </KanbanBoardColumn>
  );
}
