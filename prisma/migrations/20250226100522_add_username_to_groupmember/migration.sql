/*
  Warnings:

  - Added the required column `username` to the `GroupMember` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "GroupMember" ADD COLUMN     "username" TEXT NOT NULL;
