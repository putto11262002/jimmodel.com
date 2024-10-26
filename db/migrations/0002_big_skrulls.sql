CREATE TABLE IF NOT EXISTS "showcase_links" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"showcase_id" uuid NOT NULL,
	"url" text NOT NULL,
	"platform" text NOT NULL,
	"video_id" text,
	"iframe_src" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "showcase_models" DROP CONSTRAINT "showcase_models_showcase_id_showcases_id_fk";
--> statement-breakpoint
ALTER TABLE "showcase_models" DROP CONSTRAINT "showcase_models_model_id_models_id_fk";
--> statement-breakpoint
ALTER TABLE "showcases" ALTER COLUMN "created_at" SET DATA TYPE timestamp;--> statement-breakpoint
ALTER TABLE "showcases" ALTER COLUMN "updated_at" SET DATA TYPE timestamp;--> statement-breakpoint
ALTER TABLE "applications" ADD COLUMN "submitted_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "applications" ADD COLUMN "model_id" uuid;--> statement-breakpoint
ALTER TABLE "file_metadatas" ADD COLUMN "deleted" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "showcase_models" ADD COLUMN "model_name" text NOT NULL;--> statement-breakpoint
ALTER TABLE "showcase_models" ADD COLUMN "model_profile_image" uuid;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "showcase_links" ADD CONSTRAINT "showcase_links_showcase_id_showcases_id_fk" FOREIGN KEY ("showcase_id") REFERENCES "public"."showcases"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "showcase_index" ON "showcase_links" USING btree ("showcase_id");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "applications" ADD CONSTRAINT "applications_model_id_models_id_fk" FOREIGN KEY ("model_id") REFERENCES "public"."models"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "showcase_models" ADD CONSTRAINT "showcase_models_showcase_id_showcases_id_fk" FOREIGN KEY ("showcase_id") REFERENCES "public"."showcases"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "showcase_models" ADD CONSTRAINT "showcase_models_model_id_models_id_fk" FOREIGN KEY ("model_id") REFERENCES "public"."models"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "deleted_index" ON "file_metadatas" USING btree ("deleted");--> statement-breakpoint
ALTER TABLE "showcases" DROP COLUMN IF EXISTS "video_links";