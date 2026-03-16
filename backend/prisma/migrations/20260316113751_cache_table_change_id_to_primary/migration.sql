-- AlterTable
ALTER TABLE "cache" ADD CONSTRAINT "cache_pkey" PRIMARY KEY ("key");

-- DropIndex
DROP INDEX "cache_key_key";
