/*
  Warnings:

  - You are about to drop the column `name` on the `User` table. All the data in the column will be lost.
  - Added the required column `username` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "FileAccessLevels" AS ENUM ('PRIVATE', 'INVITATION', 'PUBLIC');

-- CreateEnum
CREATE TYPE "MimeType" AS ENUM ('IMAGE_JPEG', 'IMAGE_PNG', 'IMAGE_GIF', 'IMAGE_BMP', 'APPLICATION_PDF', 'APPLICATION_JSON', 'TEXT_HTML', 'TEXT_PLAIN', 'VIDEO_MP4', 'AUDIO_MPEG');

-- AlterTable
ALTER TABLE "User" DROP COLUMN "name",
ADD COLUMN     "username" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "FileStorage" (
    "userId" SERIAL NOT NULL,
    "fileId" INTEGER NOT NULL,
    "fileAccessTo" "FileAccessLevels" NOT NULL,

    CONSTRAINT "FileStorage_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "FileProperties" (
    "fileId" SERIAL NOT NULL,
    "fileName" TEXT NOT NULL,
    "folderLocation" TEXT NOT NULL,
    "mimeType" "MimeType" NOT NULL,
    "byteSize" BIGINT NOT NULL,

    CONSTRAINT "FileProperties_pkey" PRIMARY KEY ("fileId")
);

-- CreateTable
CREATE TABLE "UserAccessibleFile" (
    "userId" INTEGER NOT NULL,
    "accessibleFileId" INTEGER NOT NULL,

    CONSTRAINT "UserAccessibleFile_pkey" PRIMARY KEY ("userId","accessibleFileId")
);

-- AddForeignKey
ALTER TABLE "FileStorage" ADD CONSTRAINT "FileStorage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserAccessibleFile" ADD CONSTRAINT "UserAccessibleFile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserAccessibleFile" ADD CONSTRAINT "UserAccessibleFile_accessibleFileId_fkey" FOREIGN KEY ("accessibleFileId") REFERENCES "FileProperties"("fileId") ON DELETE RESTRICT ON UPDATE CASCADE;
