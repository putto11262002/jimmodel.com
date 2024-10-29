ALTER TABLE "jobs_models" DROP CONSTRAINT "jobs_models_job_id_jobs_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "jobs_models" ADD CONSTRAINT "jobs_models_job_id_jobs_id_fk" FOREIGN KEY ("job_id") REFERENCES "public"."jobs"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
