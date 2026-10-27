CREATE TABLE "TryoutClass" (
    "tryoutId" TEXT NOT NULL,
    "classId" TEXT NOT NULL,

    CONSTRAINT "TryoutClass_pkey" PRIMARY KEY ("tryoutId", "classId")
);

INSERT INTO "TryoutClass" ("tryoutId", "classId")
SELECT "id", "classId"
FROM "Tryout";

CREATE INDEX "TryoutClass_classId_idx" ON "TryoutClass"("classId");

ALTER TABLE "TryoutClass"
ADD CONSTRAINT "TryoutClass_tryoutId_fkey"
FOREIGN KEY ("tryoutId") REFERENCES "Tryout"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "TryoutClass"
ADD CONSTRAINT "TryoutClass_classId_fkey"
FOREIGN KEY ("classId") REFERENCES "Class"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Tryout" DROP CONSTRAINT "Tryout_classId_fkey";
DROP INDEX "Tryout_classId_startAt_idx";
ALTER TABLE "Tryout" DROP COLUMN "classId";
