ALTER TYPE "model_category" ADD VALUE 'seniors';--> statement-breakpoint
ALTER TABLE "web_assets" ALTER COLUMN "width" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "web_assets" ALTER COLUMN "height" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "web_assets" ALTER COLUMN "alt" SET NOT NULL;