/*
  Warnings:

  - Added the required column `displayName` to the `Invitation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Invitation" ADD COLUMN     "displayName" TEXT NOT NULL;
