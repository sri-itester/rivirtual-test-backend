-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Lead" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "salutation" TEXT,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT,
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
INSERT INTO "new_Lead" ("assignedToId", "city", "companyName", "country", "countryCode", "createdAt", "email", "firstName", "id", "lastName", "leadStage", "leadType", "mobile", "preferredLanguage", "salutation", "state", "updatedAt", "whatsapp") SELECT "assignedToId", "city", "companyName", "country", "countryCode", "createdAt", "email", "firstName", "id", "lastName", "leadStage", "leadType", "mobile", "preferredLanguage", "salutation", "state", "updatedAt", "whatsapp" FROM "Lead";
DROP TABLE "Lead";
ALTER TABLE "new_Lead" RENAME TO "Lead";
CREATE INDEX "Lead_assignedToId_idx" ON "Lead"("assignedToId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
