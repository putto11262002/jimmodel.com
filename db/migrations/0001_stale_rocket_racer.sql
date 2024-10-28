CREATE INDEX IF NOT EXISTS "bookings_job_id_index" ON "bookings" USING btree ("job_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "bookings_start_index" ON "bookings" USING btree ("start");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "bookings_end_index" ON "bookings" USING btree ("end");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "bookings_start_end_index" ON "bookings" USING btree ("start","end");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "jobs_models_job_id_index" ON "jobs_models" USING btree ("job_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "jobs_models_model_id_index" ON "jobs_models" USING btree ("model_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "model_images_model_id_index" ON "model_images" USING btree ("model_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "model_blocks_model_id_index" ON "model_blocks" USING btree ("model_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "model_blocks_start_index" ON "model_blocks" USING btree ("start");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "model_blocks_end_index" ON "model_blocks" USING btree ("end");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "model_blocks_start_end_index" ON "model_blocks" USING btree ("start","end");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "showcase_models_showcase_id_index" ON "showcase_models" USING btree ("showcase_id");