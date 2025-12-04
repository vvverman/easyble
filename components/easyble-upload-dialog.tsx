"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mic, Video, Plus } from "lucide-react";
import Image from "next/image";
import {
  FileUpload,
  FileUploadDropzone,
  FileUploadTrigger,
  FileUploadList,
  FileUploadItem,
  FileUploadItemPreview,
  FileUploadItemMetadata,
  FileUploadItemDelete,
  FileUploadClear,
  useFileUpload,
} from "@/components/ui/file-upload";

type EasybleUploadDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function EasybleUploadDialog({ open, onOpenChange }: EasybleUploadDialogProps) {
  const [tab, setTab] = useState<"voice" | "video" | "pro">("pro");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = window.localStorage.getItem("easyble-tab") as "voice" | "video" | "pro" | null;
    if (saved) setTab(saved);
  }, []);

  const handleTabChange = (value: string) => {
    const next = (value as "voice" | "video" | "pro") ?? "pro";
    setTab(next);
    if (typeof window !== "undefined") {
      window.localStorage.setItem("easyble-tab", next);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Изибл</DialogTitle>
        </DialogHeader>

        <Tabs value={tab} onValueChange={handleTabChange} className="space-y-4">
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="voice">Голосовое</TabsTrigger>
            <TabsTrigger value="video">Видео</TabsTrigger>
            <TabsTrigger value="pro">PRO</TabsTrigger>
          </TabsList>

          <TabsContent value="voice" className="space-y-3">
            <Button variant="outline" size="sm" className="gap-2">
              <Mic className="h-4 w-4" />
              Записать аудио
            </Button>
            <p className="text-sm text-muted-foreground">Скоро добавим больше настроек для голосовых заметок.</p>
          </TabsContent>

          <TabsContent value="video" className="space-y-3">
            <Button variant="outline" size="sm" className="gap-2">
              <Video className="h-4 w-4" />
              Записать видео
            </Button>
            <p className="text-sm text-muted-foreground">Скоро добавим больше опций для видео.</p>
          </TabsContent>

          <TabsContent value="pro" className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" className="gap-2">
                <Mic className="h-4 w-4" />
                Записать аудио
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <Video className="h-4 w-4" />
                Записать видео
              </Button>
            </div>

            <textarea
              rows={3}
              placeholder="Текст..."
              className="min-h-[96px] w-full resize-y rounded-md border border-input bg-background px-3 py-2 text-sm"
            />

            <FileUpload className="w-full">
              <FileUploadDropzone className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-muted/40 px-4 py-6 text-sm">
                <p className="text-foreground font-medium">Перетащите файлы сюда</p>
                <p className="text-muted-foreground text-xs">или выберите вручную</p>
                <FileUploadTrigger className="rounded-md border border-border bg-background px-3 py-2 text-xs font-medium hover:bg-muted">
                  Выбрать файлы
                </FileUploadTrigger>
              </FileUploadDropzone>

              <FileUploadList className="mt-3 space-y-2">
                <FileUploadItems />
              </FileUploadList>

              <div className="flex justify-end pt-2">
                <FileUploadClear className="text-xs text-muted-foreground underline underline-offset-4">
                  Очистить
                </FileUploadClear>
              </div>
            </FileUpload>

            <Button
              className="flex w-full items-center justify-center gap-2 bg-[linear-gradient(135deg,#E83344,#F55A01)] text-white shadow-lg hover:scale-[1.01] hover:brightness-105"
            >
              <Image src="/images/icon-easyble-24-white.svg" alt="Easyble" width={20} height={20} className="drop-shadow" />
              Изиблнуть
            </Button>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

function FileUploadItems() {
  const files = useFileUpload((state) => Array.from(state.files.keys()));

  if (!files.length) return null;

  return (
    <>
      {files.map((file) => (
        <FileUploadItem
          key={`${file.name}-${file.lastModified}`}
          value={file}
          className="flex items-center gap-3 rounded-md border border-border bg-background/80 px-3 py-2"
        >
          <FileUploadItemPreview className="h-10 w-10 rounded-md border border-border object-cover" />
          <FileUploadItemMetadata className="flex-1 text-sm leading-tight" />
          <FileUploadItemDelete className="text-muted-foreground hover:text-foreground" />
        </FileUploadItem>
      ))}
    </>
  );
}
