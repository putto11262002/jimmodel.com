CREATE TABLE IF NOT EXISTS "applications" (
	"name" varchar,
	"date_of_birth" varchar,
	"gender" text,
	"nationality" text,
	"ethnicity" text,
	"about_me" varchar,
	"phone_number" varchar,
	"email" varchar,
	"line_id" varchar,
	"wechat" varchar,
	"facebook" varchar,
	"instagram" varchar,
	"whatsapp" varchar,
	"address" varchar,
	"city" varchar,
	"region" varchar,
	"zip_code" varchar,
	"country" text,
	"talents" varchar[],
	"height" real,
	"weight" real,
	"bust" real,
	"chest" real,
	"hips" real,
	"suit_dress_size" varchar,
	"shoe_size" real,
	"eye_color" text,
	"hair_color" text,
	"submitted_at" timestamp with time zone,
	"expired_at" timestamp with time zone NOT NULL,
	"model_id" uuid,
	"status" text DEFAULT 'in_progress' NOT NULL,
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "application_experiences" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"application_id" uuid NOT NULL,
	"year" integer NOT NULL,
	"media" text NOT NULL,
	"country" text NOT NULL,
	"product" text NOT NULL,
	"details" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "application_images" (
	"file_id" uuid NOT NULL,
	"type" text NOT NULL,
	"application_id" uuid NOT NULL,
	"width" integer NOT NULL,
	"height" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "contact_messages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text,
	"message" text NOT NULL,
	"read" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "file_metadatas" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"key" text NOT NULL,
	"mime_type" text NOT NULL,
	"size" integer NOT NULL,
	"metadata" json,
	"storage_id" text NOT NULL,
	"checksum" text,
	"deleted" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"username" text NOT NULL,
	"name" text NOT NULL,
	"password" text NOT NULL,
	"email" text NOT NULL,
	"roles" text[] NOT NULL,
	"image_id" uuid,
	CONSTRAINT "users_username_unique" UNIQUE("username"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "jobs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"name" text NOT NULL,
	"product" text,
	"client" text,
	"client_address" text,
	"person_in_charge" text,
	"media_released" text,
	"period_released" text,
	"territories_released" text,
	"working_hour" text,
	"venue_of_shoot" text,
	"fee_as_agreed" text,
	"overtime_per_hour" text,
	"terms_of_payment" text,
	"cancellation_fee" text,
	"contract_details" text,
	"status" text DEFAULT 'pending' NOT NULL,
	"created_by_id" uuid NOT NULL,
	"private" boolean DEFAULT false NOT NULL,
	"owner_name" text NOT NULL,
	"owner_image_id" uuid
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "bookings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"job_id" uuid NOT NULL,
	"start" timestamp with time zone NOT NULL,
	"end" timestamp with time zone NOT NULL,
	"type" text NOT NULL,
	"notes" varchar,
	"status" text NOT NULL,
	"job_name" text NOT NULL,
	"owner_id" uuid
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "jobs_models" (
	"job_id" uuid NOT NULL,
	"model_id" uuid,
	"model_name" text NOT NULL,
	"model_image_id" uuid
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "model_images" (
	"file_id" uuid NOT NULL,
	"model_id" uuid NOT NULL,
	"width" integer NOT NULL,
	"height" integer NOT NULL,
	"type" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "model_images_file_id_model_id_pk" PRIMARY KEY("file_id","model_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "models" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"name" text NOT NULL,
	"nickname" text,
	"date_of_birth" timestamp with time zone,
	"gender" text NOT NULL,
	"phone_number" text,
	"email" text,
	"lineId" text,
	"whatsapp" text,
	"wechat" text,
	"instagram" text,
	"facebook" text,
	"nationality" text,
	"ethnicity" text,
	"country_of_residence" text,
	"occupation" text,
	"highest_level_of_education" text,
	"medical_info" text,
	"spoken_languages" text[],
	"passport_number" text,
	"id_card_number" text,
	"tax_id" text,
	"address" text,
	"city" text,
	"region" text,
	"zipCode" text,
	"country" text,
	"emergency_contact_name" text,
	"emergency_contact_phone_number" text,
	"emergency_contact_relationship" text,
	"talents" text[],
	"about_me" text,
	"underware_shooting" boolean,
	"mother_agency" text,
	"height" real,
	"weight" real,
	"chest" real,
	"bust" real,
	"waist" real,
	"hips" real,
	"shoe_size" real,
	"bra_size" text,
	"hair_color" text,
	"eye_color" text,
	"collar" real,
	"chest_height" real,
	"chest_width" real,
	"shoulder" real,
	"around_armpit" real,
	"front_shoulder" real,
	"front_length" real,
	"back_shoulder" real,
	"back_length" real,
	"around_upper_arm" real,
	"around_elbow" real,
	"around_wrist" real,
	"shoulder_to_wrist" real,
	"shoulder_to_elbow" real,
	"around_thigh" real,
	"around_knee" real,
	"around_ankle" real,
	"in_seam" real,
	"out_seam" real,
	"crotch" real,
	"tattoos" boolean,
	"scars" boolean,
	"booking_status" text NOT NULL,
	"public" boolean DEFAULT false NOT NULL,
	"category" text NOT NULL,
	"profile_image_id" uuid
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "model_blocks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"model_id" uuid NOT NULL,
	"start" timestamp with time zone NOT NULL,
	"end" timestamp with time zone NOT NULL,
	"reason" text NOT NULL,
	"model_name" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "model_experiences" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"application_id" uuid NOT NULL,
	"year" integer NOT NULL,
	"media" text NOT NULL,
	"country" text NOT NULL,
	"product" text NOT NULL,
	"details" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "showcases" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"cover_image" uuid,
	"description" text,
	"published" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "showcase_images" (
	"file_id" uuid NOT NULL,
	"showcase_id" uuid NOT NULL,
	"width" integer NOT NULL,
	"height" integer NOT NULL,
	CONSTRAINT "showcase_images_file_id_showcase_id_pk" PRIMARY KEY("file_id","showcase_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "showcase_models" (
	"showcase_id" uuid NOT NULL,
	"model_id" uuid,
	"model_name" text NOT NULL,
	"model_profile_image" uuid
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "showcase_links" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"showcase_id" uuid NOT NULL,
	"url" text NOT NULL,
	"platform" text NOT NULL,
	"video_id" text,
	"iframe_src" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "web_assets" (
	"id" uuid PRIMARY KEY NOT NULL,
	"width" integer NOT NULL,
	"height" integer NOT NULL,
	"alt" text NOT NULL,
	"tag" text[] NOT NULL,
	"published" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "applications" ADD CONSTRAINT "applications_model_id_models_id_fk" FOREIGN KEY ("model_id") REFERENCES "public"."models"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "application_experiences" ADD CONSTRAINT "application_experiences_application_id_applications_id_fk" FOREIGN KEY ("application_id") REFERENCES "public"."applications"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "application_images" ADD CONSTRAINT "application_images_file_id_file_metadatas_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."file_metadatas"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "application_images" ADD CONSTRAINT "application_images_application_id_applications_id_fk" FOREIGN KEY ("application_id") REFERENCES "public"."applications"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "users" ADD CONSTRAINT "users_image_id_file_metadatas_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."file_metadatas"("id") ON DELETE no action ON UPDATE no action;
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
 ALTER TABLE "jobs" ADD CONSTRAINT "jobs_owner_image_id_file_metadatas_id_fk" FOREIGN KEY ("owner_image_id") REFERENCES "public"."file_metadatas"("id") ON DELETE set null ON UPDATE no action;
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
 ALTER TABLE "bookings" ADD CONSTRAINT "bookings_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "jobs_models" ADD CONSTRAINT "jobs_models_job_id_jobs_id_fk" FOREIGN KEY ("job_id") REFERENCES "public"."jobs"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "jobs_models" ADD CONSTRAINT "jobs_models_model_id_models_id_fk" FOREIGN KEY ("model_id") REFERENCES "public"."models"("id") ON DELETE set null ON UPDATE no action;
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
 ALTER TABLE "model_images" ADD CONSTRAINT "model_images_file_id_file_metadatas_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."file_metadatas"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "model_images" ADD CONSTRAINT "model_images_model_id_models_id_fk" FOREIGN KEY ("model_id") REFERENCES "public"."models"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "models" ADD CONSTRAINT "models_profile_image_id_file_metadatas_id_fk" FOREIGN KEY ("profile_image_id") REFERENCES "public"."file_metadatas"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "model_blocks" ADD CONSTRAINT "model_blocks_model_id_models_id_fk" FOREIGN KEY ("model_id") REFERENCES "public"."models"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "model_experiences" ADD CONSTRAINT "model_experiences_application_id_models_id_fk" FOREIGN KEY ("application_id") REFERENCES "public"."models"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "showcases" ADD CONSTRAINT "showcases_cover_image_file_metadatas_id_fk" FOREIGN KEY ("cover_image") REFERENCES "public"."file_metadatas"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "showcase_images" ADD CONSTRAINT "showcase_images_file_id_file_metadatas_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."file_metadatas"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "showcase_images" ADD CONSTRAINT "showcase_images_showcase_id_showcases_id_fk" FOREIGN KEY ("showcase_id") REFERENCES "public"."showcases"("id") ON DELETE no action ON UPDATE no action;
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
DO $$ BEGIN
 ALTER TABLE "showcase_links" ADD CONSTRAINT "showcase_links_showcase_id_showcases_id_fk" FOREIGN KEY ("showcase_id") REFERENCES "public"."showcases"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "web_assets" ADD CONSTRAINT "web_assets_id_file_metadatas_id_fk" FOREIGN KEY ("id") REFERENCES "public"."file_metadatas"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "deleted_index" ON "file_metadatas" USING btree ("deleted");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "showcase_index" ON "showcase_links" USING btree ("showcase_id");