'use client';

import { format } from 'date-fns';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableCaption } from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Circle, MoreHorizontal, Plus, SlidersHorizontal, ArrowUpDown, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Checkbox } from '@/components/ui/checkbox';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { useMemo, useState } from 'react';
import Image from 'next/image';

type TaskTableViewProps = {
  columns: any[];
  projectNumber?: string | number | null;
  boardPath?: string | null;
  onOpenEasyble?: () => void;
};

type Row = {
  id: string;
  title: string;
  displayId?: string;
  status: string;
  columnTitle?: string | null;
  columnId?: string | null;
  archived?: boolean;
  priority: string;
  tag?: string | null;
  createdAt?: string | Date | null;
  startAt?: string | Date | null;
  dueDate?: string | Date | null;
  path?: string | null;
  owner?: { name?: string | null; email?: string | null; image?: string | null } | null;
  assignees?: any[];
  description?: string | null;
  type?: string | null;
};

const fmtDate = (value?: string | Date | null) => {
  if (!value) return null;
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) return null;
  return format(d, 'dd.MM.yyyy');
};

const Badge = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <span className={cn('inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground', className)}>
    {children}
  </span>
);

export function TaskTableView({ columns, projectNumber, boardPath, onOpenEasyble }: TaskTableViewProps) {
  const statusOptions = Array.from(
    new Set((columns ?? []).map((c: any) => c.title).filter(Boolean)),
  ) as string[];
  statusOptions.push("Архив");

  const baseRows: Row[] =
    columns?.flatMap((col: any) =>
      (col.tasks ?? []).map((task: any) => ({
        id: task.id,
        title: task.title ?? 'Без названия',
        displayId: (() => {
          const raw = (() => {
            if (task.displayId) return task.displayId;

            const num = task.projectTaskNumber ?? task.taskNumber ?? null;
            if (num != null) {
              const prefix = projectNumber ? `${projectNumber}-` : '';
              return `${prefix}${num}`;
            }
            return null;
          })();
          if (!raw) return null;
          return raw.startsWith('#') ? raw : `#${raw}`;
        })(),
        columnTitle: col?.title ?? '—',
        columnId: col?.id ?? null,
        archived: !!task.archived,
        status: task.status ?? col?.title ?? '—',
        priority: (task.priority ?? 'medium').toLowerCase(),
        tag: task.type ?? null,
        createdAt: task.createdAt ?? null,
        startAt: task.startAt ?? task.createdAt ?? null,
        dueDate: task.dueDate ?? null,
        path: task.path ?? boardPath ?? null,
        owner: {
          name: task.ownerName ?? null,
          email: task.ownerEmail ?? null,
          image: task.ownerImage ?? null,
        },
        assignees: task.assignees ?? [],
        description: task.description ?? null,
        type: task.type ?? null,
      })),
    ) ?? [];

  const [sortField, setSortField] = useState<string>('displayId');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  const sortedRows = useMemo(() => {
    const rows = [...baseRows];
    const dir = sortDir === 'asc' ? 1 : -1;
    rows.sort((a, b) => {
      const av = (a as any)[sortField];
      const bv = (b as any)[sortField];
      if (av == null && bv == null) return 0;
      if (av == null) return -dir;
      if (bv == null) return dir;
      if (typeof av === 'string' && typeof bv === 'string') {
        return av.localeCompare(bv) * dir;
      }
      const an = new Date(av).getTime();
      const bn = new Date(bv).getTime();
      if (!isNaN(an) && !isNaN(bn)) return (an - bn) * dir;
      return av > bv ? dir : av < bv ? -dir : 0;
    });
    return rows;
  }, [baseRows, sortField, sortDir]);

  const toggleSort = (field: string) => {
    setSortField((prev) => {
      if (prev === field) {
        setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
        return prev;
      }
      setSortDir('asc');
      return field;
    });
  };

  return (
    <div className="h-full w-full overflow-auto text-foreground">
      <div className="w-full space-y-4 pr-4">
        <div className="flex flex-wrap items-center gap-2 pl-4 pr-0 pt-4">
          <div className="flex-1 min-w-[240px]">
            <Input placeholder="Filter tasks..." className="bg-muted/40" />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <SlidersHorizontal className="h-4 w-4" />
                Статус
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuLabel>Статусы</DropdownMenuLabel>
              {statusOptions.map((title) => (
                <DropdownMenuItem key={title} className="gap-2 capitalize">
                  <Circle className="h-4 w-4" />
                  {title}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="ml-auto flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={() => onOpenEasyble?.()}>
              <Plus className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={() => onOpenEasyble?.()}>
              <Image
                src="/images/icon-easyble-24-white.svg"
                alt="Easyble"
                width={18}
                height={18}
                className="opacity-80"
              />
            </Button>
          </div>
        </div>

        <div className="w-full overflow-hidden rounded-xl border border-border bg-background/60">
          <Table className="w-full">
            <TableHeader className="border-b border-border">
              <TableRow className="bg-background border-b border-border">
                <TableHead className="w-10">
                  <Checkbox aria-label="Select all" />
                </TableHead>
                <TableHead className="w-20">
                  <button
                    type="button"
                    className="flex items-center gap-2 hover:text-foreground"
                    onClick={() => toggleSort('displayId')}
                  >
                    Task <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground" />
                  </button>
                </TableHead>
                <TableHead>
                  <button
                    type="button"
                    className="flex items-center gap-2 hover:text-foreground"
                    onClick={() => toggleSort('title')}
                  >
                    Title <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground" />
                  </button>
                </TableHead>
                <TableHead className="w-32">
                  <button
                    type="button"
                    className="flex items-center gap-2 hover:text-foreground"
                    onClick={() => toggleSort('status')}
                  >
                    Status <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground" />
                  </button>
                </TableHead>
                <TableHead className="w-24">Тип</TableHead>
                <TableHead className="w-32">
                  <button
                    type="button"
                    className="flex items-center gap-2 hover:text-foreground"
                    onClick={() => toggleSort('createdAt')}
                  >
                    Создана <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground" />
                  </button>
                </TableHead>
                <TableHead className="w-32">
                  <button
                    type="button"
                    className="flex items-center gap-2 hover:text-foreground"
                    onClick={() => toggleSort('startAt')}
                  >
                    Старт <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground" />
                  </button>
                </TableHead>
                <TableHead className="w-32">Дедлайн</TableHead>
                <TableHead className="w-32">Создатель</TableHead>
                <TableHead className="w-24">Участники</TableHead>
                <TableHead className="w-14"></TableHead>
              </TableRow>
            </TableHeader>
          <TableBody className="[&>*:nth-child(even)]:bg-transparent">
            {sortedRows.length === 0 && (
              <TableRow>
                <TableCell colSpan={10} className="text-center text-muted-foreground">
                  Нет задач для отображения
                </TableCell>
              </TableRow>
            )}
            {sortedRows.map((row) => {
              const isArchived = row.archived || (row.status ?? "").toLowerCase() === "archived";
              const statusLabel = isArchived ? "Архив" : row.columnTitle ?? row.status ?? "—";
              return (
                <TableRow key={row.id} className="align-middle">
                  <TableCell>
                    <Checkbox aria-label={`Select ${row.id}`} />
                  </TableCell>
                  <TableCell className="text-muted-foreground">{row.displayId ?? '—'}</TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        {row.tag && <Badge>{row.tag}</Badge>}
                        <span className="font-medium">{row.title}</span>
                      </div>
                      {row.description && (
                        <div className="text-xs text-muted-foreground line-clamp-2">{row.description}</div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-sm">
                      {isArchived ? (
                        <XCircle className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Circle className="h-4 w-4" />
                      )}
                      <span className="capitalize">{statusLabel}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm capitalize text-muted-foreground">{row.type ?? '—'}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">{fmtDate(row.createdAt) ?? '—'}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">{fmtDate(row.startAt) ?? '—'}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">{fmtDate(row.dueDate) ?? '—'}</span>
                  </TableCell>
                  <TableCell>
                    {row.owner && (row.owner.name || row.owner.email || row.owner.image) ? (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Avatar className="h-8 w-8">
                              {row.owner.image && <AvatarImage src={row.owner.image} alt={row.owner.name ?? row.owner.email ?? ''} />}
                              <AvatarFallback>
                                {(row.owner.name ?? row.owner.email ?? '?')
                                  .split(' ')
                                  .map((p) => p[0])
                                  .join('')
                                  .slice(0, 2)
                                  .toUpperCase() || '?'}
                              </AvatarFallback>
                            </Avatar>
                          </TooltipTrigger>
                          <TooltipContent>{row.owner.name ?? row.owner.email ?? ''}</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ) : (
                      <span className="text-sm text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">{row.assignees?.length ?? 0}</span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
          <TableCaption></TableCaption>
        </Table>
        </div>
      </div>
    </div>
  );
}
