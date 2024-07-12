BEGIN;
alter table if exists model_images drop constraint if exists profile_image_fk;
drop table if exists model_images;
drop table if exists jobs_models;
drop table if exists bookings;
drop table if exists file_metadata;
drop table if exists jobs;
drop table if exists models;

COMMIT; 
