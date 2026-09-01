/*
  Warnings:

  - A unique constraint covering the columns `[userId,tmdbId]` on the table `WatchlistItem` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "WatchlistItem_userId_tmdbId_key" ON "WatchlistItem"("userId", "tmdbId");
