/*
  Warnings:

  - The primary key for the `File` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `fileId` on the `File` table. All the data in the column will be lost.
  - You are about to drop the `FileStorage` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `fileAccessTo` to the `File` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ownerId` to the `File` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "FileStorage" DROP CONSTRAINT "FileStorage_userId_fkey";

-- DropForeignKey
ALTER TABLE "UserAccessibleFile" DROP CONSTRAINT "UserAccessibleFile_accessibleFileId_fkey";

-- AlterTable
ALTER TABLE "File" DROP CONSTRAINT "File_pkey",
DROP COLUMN "fileId",
ADD COLUMN     "fileAccessTo" "FileAccessLevels" NOT NULL,
ADD COLUMN     "id" SERIAL NOT NULL,
ADD COLUMN     "ownerId" INTEGER NOT NULL,
ADD CONSTRAINT "File_pkey" PRIMARY KEY ("id");

-- DropTable
DROP TABLE "FileStorage";

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserAccessibleFile" ADD CONSTRAINT "UserAccessibleFile_accessibleFileId_fkey" FOREIGN KEY ("accessibleFileId") REFERENCES "File"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
