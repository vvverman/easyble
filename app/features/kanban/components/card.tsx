'use client';

import { Trash2Icon } from 'lucide-react';
import { useEffect, useState } from 'react';
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

  useEffect(() => {
    setDraftTitle(card.title);
  }, [card.title]);

  function handleSave() {
    const next = draftTitle.trim();
    if (next && next !== card.title) {
      onUpdateCardTitle(card.id, next);
    }
    setIsDialogOpen(false);
  }

  return (
    <>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit task</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <Input
              value={draftTitle}
              autoFocus
              onChange={(e) => setDraftTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSave();
                }
              }}
            />
          </div>
          <DialogFooter className="mt-4">
            <Button
              variant="outline"
              type="button"
              onClick={() => {
                setDraftTitle(card.title);
                setIsDialogOpen(false);
              }}
            >
              Cancel
            </Button>
            <Button type="button" onClick={handleSave}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <KanbanBoardCard
        data={card}
        onClick={() => {
          setDraftTitle(card.title);
          setIsDialogOpen(true);
        }}
      >
        <KanbanBoardCardDescription className="break-words">
          {card.title}
        </KanbanBoardCardDescription>
        <KanbanBoardCardButtonGroup>
          <KanbanBoardCardButton
            className="text-destructive"
            onClick={(e) => {
              e.stopPropagation();
              onDeleteCard(card.id);
            }}
          >
            <Trash2Icon size={16} />
          </KanbanBoardCardButton>
        </KanbanBoardCardButtonGroup>
      </KanbanBoardCard>
    </>
  );
}
