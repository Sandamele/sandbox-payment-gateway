/*
  Warnings:

  - The primary key for the `cache` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "cache" DROP CONSTRAINT "cache_pkey";
