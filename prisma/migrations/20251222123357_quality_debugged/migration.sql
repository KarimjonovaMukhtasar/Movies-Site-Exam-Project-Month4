/*
  Warnings:

  - The values [240p,360p,480p,720p,1080p,4K] on the enum `Quality` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Quality_new" AS ENUM ('p240', 'p360', 'p720', 'p1080', 'k4');
ALTER TABLE "movie_files" ALTER COLUMN "quality" TYPE "Quality_new" USING ("quality"::text::"Quality_new");
ALTER TYPE "Quality" RENAME TO "Quality_old";
ALTER TYPE "Quality_new" RENAME TO "Quality";
DROP TYPE "public"."Quality_old";
COMMIT;
