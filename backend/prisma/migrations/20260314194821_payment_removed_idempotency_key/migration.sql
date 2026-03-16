/*
  Warnings:

  - You are about to drop the column `idempotencyKey` on the `Payment` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Payment_idempotencyKey_key";

-- AlterTable
ALTER TABLE "Payment" DROP COLUMN "idempotencyKey";
