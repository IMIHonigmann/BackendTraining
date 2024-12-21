/*
  Warnings:

  - Added the required column `clubhouseId` to the `Post` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "clubhouseId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Clubhouse" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Clubhouse_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_clubhouseId_fkey" FOREIGN KEY ("clubhouseId") REFERENCES "Clubhouse"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
