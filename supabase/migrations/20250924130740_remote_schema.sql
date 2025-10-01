drop policy "Enable delete for users based on user_id" on "public"."cafes";

drop policy "Enable insert for authenticated users only" on "public"."cafes";

drop policy "Enable update for users based on user_id" on "public"."cafes";

drop policy "Enable users to view their own data only" on "public"."cafes";

drop policy "Enable update for users based on user_id" on "public"."categories";

drop policy "Enable update for users based on user_id" on "public"."products";

CREATE INDEX IF NOT EXISTS cafes_user_id_idx ON public.cafes USING btree (user_id);

CREATE INDEX IF NOT EXISTS idx_categories_cafe_id ON public.categories USING btree (cafe_id);

  create policy "Delete own cafes"
  on "public"."cafes"
  as permissive
  for delete
  to authenticated
using ((( SELECT auth.uid() AS uid) = user_id));



  create policy "Select own cafes"
  on "public"."cafes"
  as permissive
  for select
  to authenticated
using ((( SELECT auth.uid() AS uid) = user_id));



  create policy "Enable insert for authenticated users only"
  on "public"."cafes"
  as permissive
  for insert
  to authenticated
with check ((( SELECT auth.uid() AS uid) = user_id));



  create policy "Enable update for users based on user_id"
  on "public"."cafes"
  as permissive
  for update
  to authenticated
using ((( SELECT auth.uid() AS uid) = user_id))
with check ((( SELECT auth.uid() AS uid) = user_id));



  create policy "Enable users to view their own data only"
  on "public"."cafes"
  as permissive
  for select
  to authenticated
using ((( SELECT auth.uid() AS uid) = user_id));



  create policy "Enable update for users based on user_id"
  on "public"."categories"
  as permissive
  for update
  to authenticated
using ((( SELECT auth.uid() AS uid) = user_id))
with check ((( SELECT auth.uid() AS uid) = user_id));



  create policy "Enable update for users based on user_id"
  on "public"."products"
  as permissive
  for update
  to authenticated
using ((( SELECT auth.uid() AS uid) = user_id))
with check ((( SELECT auth.uid() AS uid) = user_id));



