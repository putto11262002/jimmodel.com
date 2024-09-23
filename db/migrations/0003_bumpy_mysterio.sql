ALTER TABLE "jobs" DROP CONSTRAINT "jobs_created_by_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "bookings" DROP CONSTRAINT "bookings_job_id_jobs_id_fk";
--> statement-breakpoint
ALTER TABLE "jobs_models" DROP CONSTRAINT "jobs_models_model_id_models_id_fk";
--> statement-breakpoint
ALTER TABLE "jobs" ADD COLUMN "owner_name" text NOT NULL;--> statement-breakpoint
ALTER TABLE "jobs" ADD COLUMN "owner_image_id" uuid;--> statement-breakpoint
ALTER TABLE "jobs_models" ADD COLUMN "model_image_id" uuid;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "jobs" ADD CONSTRAINT "jobs_owner_image_id_file_metadatas_id_fk" FOREIGN KEY ("owner_image_id") REFERENCES "public"."file_metadatas"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "jobs" ADD CONSTRAINT "jobs_created_by_id_users_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "bookings" ADD CONSTRAINT "bookings_job_id_jobs_id_fk" FOREIGN KEY ("job_id") REFERENCES "public"."jobs"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "jobs_models" ADD CONSTRAINT "jobs_models_model_image_id_file_metadatas_id_fk" FOREIGN KEY ("model_image_id") REFERENCES "public"."file_metadatas"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "jobs_models" ADD CONSTRAINT "jobs_models_model_id_models_id_fk" FOREIGN KEY ("model_id") REFERENCES "public"."models"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
