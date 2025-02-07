/*
  Warnings:

  - Added the required column `displayName` to the `Friend` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Friend" ADD COLUMN     "displayName" TEXT NOT NULL;
