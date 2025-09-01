revoke delete on table "public"."testo" from "anon";

revoke insert on table "public"."testo" from "anon";

revoke references on table "public"."testo" from "anon";

revoke select on table "public"."testo" from "anon";

revoke trigger on table "public"."testo" from "anon";

revoke truncate on table "public"."testo" from "anon";

revoke update on table "public"."testo" from "anon";

revoke delete on table "public"."testo" from "authenticated";

revoke insert on table "public"."testo" from "authenticated";

revoke references on table "public"."testo" from "authenticated";

revoke select on table "public"."testo" from "authenticated";

revoke trigger on table "public"."testo" from "authenticated";

revoke truncate on table "public"."testo" from "authenticated";

revoke update on table "public"."testo" from "authenticated";

revoke delete on table "public"."testo" from "service_role";

revoke insert on table "public"."testo" from "service_role";

revoke references on table "public"."testo" from "service_role";

revoke select on table "public"."testo" from "service_role";

revoke trigger on table "public"."testo" from "service_role";

revoke truncate on table "public"."testo" from "service_role";

revoke update on table "public"."testo" from "service_role";

alter table "public"."testo" drop constraint "testo_pkey";

drop index if exists "public"."testo_pkey";

drop table "public"."testo";

alter table "public"."cafes" add column "slug" text not null;

alter table "public"."cafes" add column "user_id" uuid;

alter table "public"."cafes" enable row level security;

alter table "public"."cafes" add constraint "cafes_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) not valid;

alter table "public"."cafes" validate constraint "cafes_user_id_fkey";

create policy "Enable delete for users based on user_id"
on "public"."cafes"
as permissive
for delete
to public
using ((( SELECT auth.uid() AS uid) = user_id));


create policy "Enable insert for authenticated users only"
on "public"."cafes"
as permissive
for insert
to authenticated
with check (true);


create policy "Enable users to view their own data only"
on "public"."cafes"
as permissive
for select
to authenticated
using ((( SELECT auth.uid() AS uid) = user_id));




