ALTER TABLE "application_images" DROP CONSTRAINT "application_images_application_id_applications_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "application_images" ADD CONSTRAINT "application_images_application_id_applications_id_fk" FOREIGN KEY ("application_id") REFERENCES "public"."applications"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
