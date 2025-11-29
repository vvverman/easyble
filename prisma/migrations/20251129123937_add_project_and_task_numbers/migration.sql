/*
  Warnings:

  - You are about to drop the column `number` on the `Task` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[number]` on the table `Project` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
CREATE SEQUENCE project_number_seq;
ALTER TABLE "Project" ALTER COLUMN "number" SET DEFAULT nextval('project_number_seq');
ALTER SEQUENCE project_number_seq OWNED BY "Project"."number";

-- AlterTable
ALTER TABLE "Task" DROP COLUMN "number",
ADD COLUMN     "projectTaskNumber" INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE UNIQUE INDEX "Project_number_key" ON "Project"("number");
