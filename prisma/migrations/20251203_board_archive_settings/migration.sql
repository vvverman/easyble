-- Добавляем настройки архивации на борд
ALTER TABLE "Board"
ADD COLUMN IF NOT EXISTS "archiveColumnId" TEXT,
ADD COLUMN IF NOT EXISTS "archiveAfterDays" INTEGER;

-- Добавляем статус ARCHIVED для задач
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type t JOIN pg_enum e ON t.oid = e.enumtypid WHERE t.typname = 'TaskStatus' AND e.enumlabel = 'ARCHIVED') THEN
    ALTER TYPE "TaskStatus" ADD VALUE 'ARCHIVED';
  END IF;
END$$;
