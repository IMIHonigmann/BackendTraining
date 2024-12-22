-- CreateTable
CREATE TABLE "ClubhouseUser" (
    "userId" INTEGER NOT NULL,
    "clubhouseId" INTEGER NOT NULL,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ClubhouseUser_pkey" PRIMARY KEY ("userId","clubhouseId")
);

-- AddForeignKey
ALTER TABLE "ClubhouseUser" ADD CONSTRAINT "ClubhouseUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClubhouseUser" ADD CONSTRAINT "ClubhouseUser_clubhouseId_fkey" FOREIGN KEY ("clubhouseId") REFERENCES "Clubhouse"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
