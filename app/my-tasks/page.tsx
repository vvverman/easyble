"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState } from "react";
import { format } from "date-fns";

type TaskRow = {
  id: string;
  title: string;
  displayId: string;
  status: string;
  type: string;
  createdAt: string;
  startDate?: string | null;
  deadline?: string | null;
};

export default function MyTasksPage() {
  const [tab, setTab] = useState<"incoming" | "outgoing" | "participate" | "favorites">("incoming");
  const [data, setData] = useState<{ incoming: TaskRow[]; outgoing: TaskRow[] }>({
    incoming: [],
    outgoing: [],
  });

  useEffect(() => {
    let mounted = true;
    fetch("/api/my-tasks")
      .then((r) => r.json())
      .then((json) => {
        if (!mounted) return;
        setData({
          incoming: json.incoming ?? [],
          outgoing: json.outgoing ?? [],
        });
      })
      .catch(() => {
        if (!mounted) return;
        setData({ incoming: [], outgoing: [] });
      });
    return () => {
      mounted = false;
    };
  }, []);

  const renderTable = (rows: TaskRow[] = []) => (
    <div className="w-full overflow-hidden rounded-xl border border-border bg-background/60">
      <Table className="w-full">
        <TableHeader className="border-b border-border">
          <TableRow className="bg-background border-b border-border">
            <TableHead className="w-24">Task</TableHead>
            <TableHead>Title</TableHead>
            <TableHead className="w-32">Статус</TableHead>
            <TableHead className="w-28">Тип</TableHead>
            <TableHead className="w-32">Создана</TableHead>
            <TableHead className="w-32">Старт</TableHead>
            <TableHead className="w-32">Дедлайн</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id} className="border-border">
              <TableCell className="text-sm font-medium">{row.displayId || "–"}</TableCell>
              <TableCell className="text-sm">{row.title}</TableCell>
              <TableCell className="text-sm">{row.status}</TableCell>
              <TableCell className="text-sm">{row.type}</TableCell>
              <TableCell className="text-sm">{row.createdAt}</TableCell>
              <TableCell className="text-sm">{row.startDate ?? "–"}</TableCell>
              <TableCell className="text-sm">{row.deadline ?? "–"}</TableCell>
            </TableRow>
          ))}
          {!rows.length && (
            <TableRow>
              <TableCell colSpan={7} className="py-6 text-center text-sm text-muted-foreground">
                Пока нет задач
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Мои задачи</h1>
      <Tabs value={tab} onValueChange={(v) => setTab(v as any)} className="space-y-4">
        <TabsList className="w-full justify-start gap-2 bg-muted/30">
          <TabsTrigger value="incoming">Входящие</TabsTrigger>
          <TabsTrigger value="outgoing">Исходящие</TabsTrigger>
          <TabsTrigger value="participate">Участвую</TabsTrigger>
          <TabsTrigger value="favorites">Избранное</TabsTrigger>
        </TabsList>
        <TabsContent value="incoming">{renderTable(data?.incoming)}</TabsContent>
        <TabsContent value="outgoing">{renderTable(data?.outgoing)}</TabsContent>
        <TabsContent value="participate">{renderTable([])}</TabsContent>
        <TabsContent value="favorites">{renderTable([])}</TabsContent>
      </Tabs>
    </div>
  );
}
