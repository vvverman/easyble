'use client';

import { useMemo, useState, useTransition } from 'react';
import KanbanBoardWrapper from '~/features/kanban/board';
import { BoardFloatingMenu } from '@/components/board-floating-menu';
import { TaskTableView } from '@/features/kanban/task-table-view';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { saveBoardArchiveSettingsForm } from '@/app/features/boards/actions';
import { EasybleUploadDialog } from '@/components/easyble-upload-dialog';

type BoardViewInternal = 'kanban' | 'gantt' | 'calendar' | 'list';
type BoardViewInternalWithPersonal = BoardViewInternal | 'my-tasks';

type BoardViewClientProps = {
  project: any;
  boardId: string;
  boardTitle: string;
  teamTitle: string | null;
  columns: any[];
  avatars: React.ReactNode[];
  archiveAfterDays?: number | null;
  archiveColumnId?: string | null;
  projectId: string;
};

export function BoardViewClient({
  project,
  boardId,
  boardTitle,
  teamTitle,
  columns,
  avatars,
  archiveAfterDays,
  archiveColumnId,
  projectId,
}: BoardViewClientProps) {
  const columnsList = columns ?? [];
  const [view, setView] = useState<BoardViewInternalWithPersonal>('kanban');
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [easybleOpen, setEasybleOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const kanbanColumns = columnsList.map((c) => ({
    ...c,
    tasks: (c.tasks ?? []).filter((t: any) => !t.archived),
  }));
  const tableColumns = columnsList;

  const defaultArchiveColumn = useMemo(() => {
    return (
      archiveColumnId ||
      columnsList.find((c) => (c.title || '').toLowerCase().includes('done'))?.id ||
      columnsList.at(-1)?.id ||
      ''
    );
  }, [archiveColumnId, columnsList]);
  const defaultDays = archiveAfterDays ?? 30;

  return (
    <>
      <div className="relative flex h-full min-h-0">
        <div className="flex min-h-0 flex-1 flex-col">
          <div className="flex-1 min-h-0 w-full overflow-x-auto overflow-y-hidden pl-4 pt-4 pb-0">
            {view === 'kanban' && (
              <KanbanBoardWrapper
                project={project}
                boardId={boardId}
                boardTitle={boardTitle}
                teamTitle={teamTitle}
                columns={kanbanColumns}
                onOpenEasyble={() => setEasybleOpen(true)}
              />
            )}
            {view === 'list' && (
              <TaskTableView
                columns={tableColumns}
                projectNumber={project.number ?? null}
                boardPath={`${teamTitle ?? project.team?.name ?? project.title ?? 'Team'}/${project.title ?? 'Project'}/${boardTitle ?? 'Board'}`}
                onOpenEasyble={() => setEasybleOpen(true)}
              />
            )}
            {view === 'my-tasks' && <MyTasksEmbed />}
            {view !== 'kanban' && view !== 'list' && view !== 'my-tasks' && <div className="h-full w-full" />}
          </div>
        </div>
        <BoardFloatingMenu
          avatars={avatars}
          boardId={boardId}
          projectId={projectId}
          activeView={view as BoardViewInternal}
          onChangeView={(v) => setView(v as BoardViewInternal)}
          onOpenSettings={() => setSettingsOpen(true)}
          onOpenEasyble={() => setEasybleOpen(true)}
          onOpenMyTasks={() => setView('my-tasks')}
        />
      </div>

      <EasybleUploadDialog open={easybleOpen} onOpenChange={setEasybleOpen} />

      <Sheet open={settingsOpen} onOpenChange={setSettingsOpen}>
        <SheetContent side="right" className="w-full max-w-md space-y-6 px-6 py-6">
          <SheetHeader>
            <SheetTitle>Настройки борда</SheetTitle>
            <SheetDescription>
              Укажите, из какой колонки и через сколько дней задачи будут уходить в архив. Архивные задачи скрываются с канбана и видны только в таблице.
            </SheetDescription>
          </SheetHeader>

          <form
            action={(formData) => {
              startTransition(() => {
                saveBoardArchiveSettingsForm(formData).then(() => setSettingsOpen(false));
              });
            }}
            className="space-y-5"
          >
            <input type="hidden" name="boardId" value={boardId} />
            <input type="hidden" name="projectId" value={projectId} />

            <div className="space-y-2">
              <Label htmlFor="archiveColumnId">Колонка для архивации</Label>
              <select
                id="archiveColumnId"
                name="archiveColumnId"
                defaultValue={defaultArchiveColumn}
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
              >
                {columnsList.map((col) => (
                  <option key={col.id} value={col.id}>
                    {col.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="archiveAfterDays">Отправлять в архив через (дней)</Label>
              <Input
                id="archiveAfterDays"
                name="archiveAfterDays"
                type="number"
                min={1}
                defaultValue={defaultDays}
                className="w-32"
              />
            </div>

            <SheetFooter className="p-0 pt-2">
              <Button type="submit" disabled={isPending} className="w-full">
                Сохранить
              </Button>
            </SheetFooter>
          </form>
        </SheetContent>
      </Sheet>
    </>
  );
}

function MyTasksEmbed() {
  return (
    <iframe
      src="/my-tasks"
      className="h-full w-full border-0 rounded-lg bg-background"
      title="Мои задачи"
    />
  );
}
