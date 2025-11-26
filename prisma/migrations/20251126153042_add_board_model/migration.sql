/*
  Warnings:

  - You are about to drop the column `projectId` on the `Column` table. All the data in the column will be lost.
  - Added the required column `boardId` to the `Column` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Column" DROP CONSTRAINT "Column_projectId_fkey";

-- DropIndex
DROP INDEX "Column_projectId_idx";

-- AlterTable
ALTER TABLE "Column" DROP COLUMN "projectId",
ADD COLUMN     "boardId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Board" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Board_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Board_projectId_idx" ON "Board"("projectId");

-- CreateIndex
CREATE INDEX "Column_boardId_idx" ON "Column"("boardId");

-- AddForeignKey
ALTER TABLE "Board" ADD CONSTRAINT "Board_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Column" ADD CONSTRAINT "Column_boardId_fkey" FOREIGN KEY ("boardId") REFERENCES "Board"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
