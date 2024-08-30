DO $$ BEGIN
 CREATE TYPE "public"."application_image_type" AS ENUM('full', 'half', 'closeup', 'other');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."application_status" AS ENUM('pending', 'approved', 'rejected');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."country" AS ENUM('Andorra', 'United Arab Emirates', 'Afghanistan', 'Antigua and Barbuda', 'Anguilla', 'Albania', 'Armenia', 'Angola', 'Antarctica', 'Argentina', 'American Samoa', 'Austria', 'Australia', 'Aruba', 'Aland', 'Azerbaijan', 'Bosnia and Herzegovina', 'Barbados', 'Bangladesh', 'Belgium', 'Burkina Faso', 'Bulgaria', 'Bahrain', 'Burundi', 'Benin', 'Saint Barthelemy', 'Bermuda', 'Brunei', 'Bolivia', 'Bonaire', 'Brazil', 'Bahamas', 'Bhutan', 'Bouvet Island', 'Botswana', 'Belarus', 'Belize', 'Canada', 'Cocos (Keeling) Islands', 'Democratic Republic of the Congo', 'Central African Republic', 'Republic of the Congo', 'Switzerland', 'Ivory Coast', 'Cook Islands', 'Chile', 'Cameroon', 'China', 'Colombia', 'Costa Rica', 'Cuba', 'Cape Verde', 'Curacao', 'Christmas Island', 'Cyprus', 'Czech Republic', 'Germany', 'Djibouti', 'Denmark', 'Dominica', 'Dominican Republic', 'Algeria', 'Ecuador', 'Estonia', 'Egypt', 'Western Sahara', 'Eritrea', 'Spain', 'Ethiopia', 'Finland', 'Fiji', 'Falkland Islands', 'Micronesia', 'Faroe Islands', 'France', 'Gabon', 'United Kingdom', 'Grenada', 'Georgia', 'French Guiana', 'Guernsey', 'Ghana', 'Gibraltar', 'Greenland', 'Gambia', 'Guinea', 'Guadeloupe', 'Equatorial Guinea', 'Greece', 'South Georgia and the South Sandwich Islands', 'Guatemala', 'Guam', 'Guinea-Bissau', 'Guyana', 'Hong Kong', 'Heard Island and McDonald Islands', 'Honduras', 'Croatia', 'Haiti', 'Hungary', 'Indonesia', 'Ireland', 'Israel', 'Isle of Man', 'India', 'British Indian Ocean Territory', 'Iraq', 'Iran', 'Iceland', 'Italy', 'Jersey', 'Jamaica', 'Jordan', 'Japan', 'Kenya', 'Kyrgyzstan', 'Cambodia', 'Kiribati', 'Comoros', 'Saint Kitts and Nevis', 'North Korea', 'South Korea', 'Kuwait', 'Cayman Islands', 'Kazakhstan', 'Laos', 'Lebanon', 'Saint Lucia', 'Liechtenstein', 'Sri Lanka', 'Liberia', 'Lesotho', 'Lithuania', 'Luxembourg', 'Latvia', 'Libya', 'Morocco', 'Monaco', 'Moldova', 'Montenegro', 'Saint Martin', 'Madagascar', 'Marshall Islands', 'North Macedonia', 'Mali', 'Myanmar (Burma)', 'Mongolia', 'Macao', 'Northern Mariana Islands', 'Martinique', 'Mauritania', 'Montserrat', 'Malta', 'Mauritius', 'Maldives', 'Malawi', 'Mexico', 'Malaysia', 'Mozambique', 'Namibia', 'New Caledonia', 'Niger', 'Norfolk Island', 'Nigeria', 'Nicaragua', 'Netherlands', 'Norway', 'Nepal', 'Nauru', 'Niue', 'New Zealand', 'Oman', 'Panama', 'Peru', 'French Polynesia', 'Papua New Guinea', 'Philippines', 'Pakistan', 'Poland', 'Saint Pierre and Miquelon', 'Pitcairn Islands', 'Puerto Rico', 'Palestine', 'Portugal', 'Palau', 'Paraguay', 'Qatar', 'Reunion', 'Romania', 'Serbia', 'Russia', 'Rwanda', 'Saudi Arabia', 'Solomon Islands', 'Seychelles', 'Sudan', 'Sweden', 'Singapore', 'Saint Helena', 'Slovenia', 'Svalbard and Jan Mayen', 'Slovakia', 'Sierra Leone', 'San Marino', 'Senegal', 'Somalia', 'Suriname', 'South Sudan', 'Sao Tome and Principe', 'El Salvador', 'Sint Maarten', 'Syria', 'Eswatini', 'Turks and Caicos Islands', 'Chad', 'French Southern Territories', 'Togo', 'Thailand', 'Tajikistan', 'Tokelau', 'East Timor', 'Turkmenistan', 'Tunisia', 'Tonga', 'Turkey', 'Trinidad and Tobago', 'Tuvalu', 'Taiwan', 'Tanzania', 'Ukraine', 'Uganda', 'U.S. Minor Outlying Islands', 'United States', 'Uruguay', 'Uzbekistan', 'Vatican City', 'Saint Vincent and the Grenadines', 'Venezuela', 'British Virgin Islands', 'U.S. Virgin Islands', 'Vietnam', 'Vanuatu', 'Wallis and Futuna', 'Samoa', 'Kosovo', 'Yemen', 'Mayotte', 'South Africa', 'Zambia', 'Zimbabwe');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."ethnicity" AS ENUM('African', 'African American', 'Asian', 'Central Asian', 'East Asian', 'European', 'Hispanic', 'Indigenous American', 'Latinx', 'Middle Eastern', 'Near Eastern', 'North African', 'Oceanian', 'South Asian', 'Southeast Asian', 'West Asian');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."eye_color" AS ENUM('brown', 'blue', 'green', 'hazel', 'gray', 'black', 'amber', 'violet', 'red');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."gender" AS ENUM('male', 'female', 'non-binary');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."hair_color" AS ENUM('blonde', 'brunette', 'black', 'red', 'brown', 'gray', 'silver', 'auburn', 'other');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."user_role" AS ENUM('admin', 'staff', 'IT');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."booking_type" AS ENUM('fitting', 'shoot', 'meeting', 'other');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."job_status" AS ENUM('pending', 'confirmed', 'cancelled', 'archived');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."model_category" AS ENUM('male', 'female', 'non-binary', 'kids');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."model_image_type" AS ENUM('book', 'polaroid', 'composite', 'application', 'other');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."web_asset_tags" AS ENUM('hero');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."web_asset_types" AS ENUM('image');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "application_experiences" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"application_id" uuid,
	"year" integer NOT NULL,
	"media" varchar NOT NULL,
	"country" "country" NOT NULL,
	"product" varchar NOT NULL,
	"details" varchar
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "application_images" (
	"file_id" uuid NOT NULL,
	"type" "application_image_type" NOT NULL,
	"application_id" uuid,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "applications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar NOT NULL,
	"phone_number" varchar,
	"email" varchar NOT NULL,
	"line_id" varchar,
	"wechat" varchar,
	"facebook" varchar,
	"instagram" varchar,
	"whatsapp" varchar,
	"date_of_birth" varchar,
	"gender" "gender" NOT NULL,
	"nationality" "country",
	"ethnicity" "ethnicity",
	"address" varchar,
	"city" varchar,
	"region" varchar,
	"zip_code" varchar,
	"country" "country",
	"talents" varchar[],
	"about_me" varchar,
	"height" real,
	"weight" real,
	"bust" real,
	"chest" real,
	"hips" real,
	"suit_dress_size" varchar,
	"shoe_size" real,
	"eye_color" "eye_color",
	"hair_color" "hair_color",
	"status" "application_status" DEFAULT 'pending' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "contact_messages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"first_name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text,
	"message" text NOT NULL,
	"read" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "files" (
	"id" uuid PRIMARY KEY NOT NULL,
	"path" varchar NOT NULL,
	"mime_type" varchar NOT NULL,
	"size" integer,
	"orginal" uuid,
	"height" integer,
	"width" integer,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"username" varchar(8) NOT NULL,
	"name" varchar NOT NULL,
	"password" varchar NOT NULL,
	"email" varchar NOT NULL,
	"roles" user_role[],
	"image_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone NOT NULL,
	CONSTRAINT "users_username_unique" UNIQUE("username"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "bookings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"job_id" uuid NOT NULL,
	"start" timestamp with time zone NOT NULL,
	"end" timestamp with time zone NOT NULL,
	"type" "booking_type" NOT NULL,
	"notes" varchar,
	"status" "job_status" NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "jobs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar NOT NULL,
	"client" varchar,
	"product" varchar,
	"client_address" varchar,
	"person_in_charge" varchar,
	"media_released" varchar,
	"period_released" varchar,
	"territories_released" varchar,
	"working_hour" varchar,
	"venue_of_shoot" varchar,
	"fee_as_agreed" varchar,
	"overtime_per_hour" varchar,
	"terms_of_payment" varchar,
	"cancellation_fee" varchar,
	"contract_details" varchar,
	"status" "job_status" NOT NULL,
	"created_by_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "jobs_models" (
	"job_id" uuid NOT NULL,
	"model_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "model_blocks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"model_id" uuid NOT NULL,
	"start" timestamp with time zone NOT NULL,
	"end" timestamp with time zone NOT NULL,
	"reason" varchar NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "model_experiences" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"application_id" uuid,
	"year" integer NOT NULL,
	"media" varchar NOT NULL,
	"country" "country" NOT NULL,
	"product" varchar NOT NULL,
	"details" varchar
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "models" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar NOT NULL,
	"nickname" varchar,
	"date_of_birth" timestamp with time zone,
	"gender" "gender" NOT NULL,
	"phone_number" varchar,
	"email" varchar,
	"lineId" varchar,
	"whatsapp" varchar,
	"wechat" varchar,
	"instagram" varchar,
	"facebook" varchar,
	"nationality" "country",
	"ethnicity" "ethnicity",
	"country_of_residence" "country",
	"occupation" varchar,
	"highest_level_of_education" varchar,
	"medical_info" varchar,
	"spoken_languages" varchar[],
	"passport_number" varchar,
	"id_card_number" varchar,
	"tax_id" varchar,
	"mother_agency" varchar,
	"address" varchar,
	"city" varchar,
	"region" varchar,
	"zipCode" varchar,
	"country" "country",
	"emergency_contact_name" varchar,
	"emergency_contact_phone_number" varchar,
	"emergency_contact_relationship" varchar,
	"talents" varchar[],
	"about_me" varchar,
	"underware_shooting" boolean,
	"height" real,
	"weight" real,
	"collar" real,
	"chest" real,
	"bust" real,
	"chest_height" real,
	"chest_width" real,
	"waist" real,
	"hips" real,
	"shoulder" real,
	"bra_size" varchar,
	"tattoos" boolean,
	"scars" boolean,
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
	"shoe_size" real,
	"hair_color" "hair_color",
	"eye_color" "eye_color",
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	"local" boolean DEFAULT false,
	"intown" boolean DEFAULT false,
	"direct_booking" boolean DEFAULT false,
	"public" boolean DEFAULT false,
	"inactive" boolean DEFAULT true,
	"category" "model_category" NOT NULL,
	"tags" varchar[],
	"profile_image_id" uuid
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "model_images" (
	"original_file_id" uuid NOT NULL,
	"model_id" uuid NOT NULL,
	"image_type" "model_image_type",
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "model_images_original_file_id_model_id_pk" PRIMARY KEY("original_file_id","model_id")
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
CREATE TABLE IF NOT EXISTS "showcases" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"cover_image" uuid,
	"description" text,
	"published" boolean DEFAULT false NOT NULL,
	"video_links" text[],
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "showcase_to_model" (
	"showcase_id" uuid NOT NULL,
	"model_id" uuid NOT NULL,
	CONSTRAINT "showcase_to_model_showcase_id_model_id_pk" PRIMARY KEY("showcase_id","model_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "web_assets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"file_id" uuid NOT NULL,
	"content_type" text NOT NULL,
	"width" integer,
	"height" integer,
	"type" "web_asset_types" NOT NULL,
	"alt" text,
	"tag" "web_asset_tags" NOT NULL,
	"published" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "application_images" ADD CONSTRAINT "application_images_file_id_files_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."files"("id") ON DELETE no action ON UPDATE no action;
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
 ALTER TABLE "files" ADD CONSTRAINT "files_orginal_files_id_fk" FOREIGN KEY ("orginal") REFERENCES "public"."files"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "users" ADD CONSTRAINT "users_image_id_files_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."files"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "bookings" ADD CONSTRAINT "bookings_job_id_jobs_id_fk" FOREIGN KEY ("job_id") REFERENCES "public"."jobs"("id") ON DELETE no action ON UPDATE no action;
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
 ALTER TABLE "jobs_models" ADD CONSTRAINT "jobs_models_model_id_models_id_fk" FOREIGN KEY ("model_id") REFERENCES "public"."models"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "model_blocks" ADD CONSTRAINT "model_blocks_model_id_models_id_fk" FOREIGN KEY ("model_id") REFERENCES "public"."models"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "models" ADD CONSTRAINT "models_profile_image_id_files_id_fk" FOREIGN KEY ("profile_image_id") REFERENCES "public"."files"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "model_images" ADD CONSTRAINT "model_images_original_file_id_files_id_fk" FOREIGN KEY ("original_file_id") REFERENCES "public"."files"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "model_images" ADD CONSTRAINT "model_images_model_id_models_id_fk" FOREIGN KEY ("model_id") REFERENCES "public"."models"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "showcase_images" ADD CONSTRAINT "showcase_images_file_id_files_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."files"("id") ON DELETE no action ON UPDATE no action;
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
 ALTER TABLE "showcases" ADD CONSTRAINT "showcases_cover_image_files_id_fk" FOREIGN KEY ("cover_image") REFERENCES "public"."files"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "showcase_to_model" ADD CONSTRAINT "showcase_to_model_showcase_id_showcases_id_fk" FOREIGN KEY ("showcase_id") REFERENCES "public"."showcases"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "showcase_to_model" ADD CONSTRAINT "showcase_to_model_model_id_models_id_fk" FOREIGN KEY ("model_id") REFERENCES "public"."models"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "web_assets" ADD CONSTRAINT "web_assets_file_id_files_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."files"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
