/*
  Warnings:

  - The primary key for the `Activity` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `createdById` on the `Activity` table. All the data in the column will be lost.
  - You are about to drop the column `durationSec` on the `Activity` table. All the data in the column will be lost.
  - You are about to drop the column `feedback` on the `Activity` table. All the data in the column will be lost.
  - You are about to drop the column `text` on the `Activity` table. All the data in the column will be lost.
  - You are about to alter the column `id` on the `Activity` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - You are about to alter the column `leadId` on the `Activity` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - The primary key for the `Lead` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `ownerId` on the `Lead` table. All the data in the column will be lost.
  - You are about to drop the column `source` on the `Lead` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Lead` table. All the data in the column will be lost.
  - You are about to drop the column `whatsappNumber` on the `Lead` table. All the data in the column will be lost.
  - You are about to alter the column `id` on the `Lead` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `passwordHash` on the `User` table. All the data in the column will be lost.
  - You are about to alter the column `id` on the `User` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - The primary key for the `WebhookEvent` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `direction` on the `WebhookEvent` table. All the data in the column will be lost.
  - You are about to drop the column `event` on the `WebhookEvent` table. All the data in the column will be lost.
  - You are about to drop the column `matchedLeadId` on the `WebhookEvent` table. All the data in the column will be lost.
  - You are about to drop the column `message` on the `WebhookEvent` table. All the data in the column will be lost.
  - You are about to drop the column `messageType` on the `WebhookEvent` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `WebhookEvent` table. All the data in the column will be lost.
  - You are about to drop the column `raw` on the `WebhookEvent` table. All the data in the column will be lost.
  - You are about to drop the column `timestamp` on the `WebhookEvent` table. All the data in the column will be lost.
  - You are about to alter the column `id` on the `WebhookEvent` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - Added the required column `content` to the `Activity` table without a default value. This is not possible if the table is not empty.
  - Added the required column `city` to the `Lead` table without a default value. This is not possible if the table is not empty.
  - Added the required column `country` to the `Lead` table without a default value. This is not possible if the table is not empty.
  - Added the required column `leadStage` to the `Lead` table without a default value. This is not possible if the table is not empty.
  - Added the required column `state` to the `Lead` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Lead` table without a default value. This is not possible if the table is not empty.
  - Made the column `email` on table `Lead` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `role` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `payload` to the `WebhookEvent` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `WebhookEvent` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Activity" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "leadId" INTEGER,
    "type" TEXT NOT NULL,
    "content" JSONB NOT NULL,
    "performedById" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Activity_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Activity_performedById_fkey" FOREIGN KEY ("performedById") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Activity" ("createdAt", "id", "leadId", "type") SELECT "createdAt", "id", "leadId", "type" FROM "Activity";
DROP TABLE "Activity";
ALTER TABLE "new_Activity" RENAME TO "Activity";
CREATE INDEX "Activity_leadId_idx" ON "Activity"("leadId");
CREATE INDEX "Activity_performedById_idx" ON "Activity"("performedById");
CREATE TABLE "new_Lead" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "salutation" TEXT,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "countryCode" TEXT,
    "mobile" TEXT NOT NULL,
    "whatsapp" TEXT,
    "leadType" TEXT,
    "preferredLanguage" TEXT,
    "companyName" TEXT,
    "country" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "leadStage" TEXT NOT NULL,
    "assignedToId" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Lead_assignedToId_fkey" FOREIGN KEY ("assignedToId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Lead" ("createdAt", "email", "firstName", "id", "lastName", "mobile") SELECT "createdAt", "email", "firstName", "id", "lastName", "mobile" FROM "Lead";
DROP TABLE "Lead";
ALTER TABLE "new_Lead" RENAME TO "Lead";
CREATE INDEX "Lead_assignedToId_idx" ON "Lead"("assignedToId");
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "role" TEXT NOT NULL,
    "managerId" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "User_managerId_fkey" FOREIGN KEY ("managerId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_User" ("createdAt", "email", "id", "name") SELECT "createdAt", "email", "id", "name" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE TABLE "new_WebhookEvent" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "type" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_WebhookEvent" ("createdAt", "id") SELECT "createdAt", "id" FROM "WebhookEvent";
DROP TABLE "WebhookEvent";
ALTER TABLE "new_WebhookEvent" RENAME TO "WebhookEvent";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
