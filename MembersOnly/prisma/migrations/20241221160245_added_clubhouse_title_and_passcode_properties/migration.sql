/*
  Warnings:

  - Added the required column `passcode` to the `Clubhouse` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Clubhouse" ADD COLUMN     "passcode" TEXT NOT NULL,
ADD COLUMN     "title" TEXT;
