-- CreateEnum
CREATE TYPE "TaskKind" AS ENUM ('TASK', 'MEETING', 'CALL');

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "number" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "kind" "TaskKind" NOT NULL DEFAULT 'TASK',
ADD COLUMN     "number" INTEGER NOT NULL DEFAULT 0;
