/*
  Warnings:

  - You are about to drop the `FileProperties` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "UserAccessibleFile" DROP CONSTRAINT "UserAccessibleFile_accessibleFileId_fkey";

-- DropTable
DROP TABLE "FileProperties";

-- CreateTable
CREATE TABLE "File" (
    "fileId" SERIAL NOT NULL,
    "fileName" TEXT NOT NULL,
    "folderLocation" TEXT NOT NULL,
    "mimeType" "MimeType" NOT NULL,
    "byteSize" BIGINT NOT NULL,

    CONSTRAINT "File_pkey" PRIMARY KEY ("fileId")
);

-- AddForeignKey
ALTER TABLE "UserAccessibleFile" ADD CONSTRAINT "UserAccessibleFile_accessibleFileId_fkey" FOREIGN KEY ("accessibleFileId") REFERENCES "File"("fileId") ON DELETE RESTRICT ON UPDATE CASCADE;
