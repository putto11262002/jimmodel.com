ALTER TABLE "models" RENAME COLUMN "profile_file_id" TO "image_id";--> statement-breakpoint
ALTER TABLE "models" DROP CONSTRAINT "profile_image_fk";
--> statement-breakpoint
ALTER TABLE "bookings" ADD COLUMN "status" "job_status" NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "models" ADD CONSTRAINT "image_fk" FOREIGN KEY ("id","image_id") REFERENCES "public"."model_images"("model_id","file_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
