-- CreateEnum
CREATE TYPE "Tier" AS ENUM ('gooner', 'npc', 'sigma', 'based');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "membership" "Tier" NOT NULL DEFAULT 'gooner';
