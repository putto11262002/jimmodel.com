ALTER TABLE "models" ALTER COLUMN "date_of_birth" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "models" ADD COLUMN "mother_agency" varchar;