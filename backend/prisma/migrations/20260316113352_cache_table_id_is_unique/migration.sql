/*
  Warnings:

  - A unique constraint covering the columns `[key]` on the table `cache` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "cache_key_key" ON "cache"("key");
