-- Advisor remediation: fixed trigger search path, role-scoped policies and
-- statement-level auth checks. Storage policy changes are deferred: the SQL
-- execution role does not own storage.objects. Public vehicle images remain served.
BEGIN;
ALTER FUNCTION public.update_updated_at_column() SET search_path = '';

ALTER POLICY garage_owner_select ON public.user_garage TO authenticated USING ((select auth.uid()) = user_id);
ALTER POLICY garage_owner_insert ON public.user_garage TO authenticated WITH CHECK ((select auth.uid()) = user_id);
ALTER POLICY garage_owner_update ON public.user_garage TO authenticated USING ((select auth.uid()) = user_id) WITH CHECK ((select auth.uid()) = user_id);
ALTER POLICY garage_owner_delete ON public.user_garage TO authenticated USING ((select auth.uid()) = user_id);
ALTER POLICY routes_owner_select ON public.saved_routes TO authenticated USING ((select auth.uid()) = user_id);
ALTER POLICY routes_owner_insert ON public.saved_routes TO authenticated WITH CHECK ((select auth.uid()) = user_id);
ALTER POLICY routes_owner_update ON public.saved_routes TO authenticated USING ((select auth.uid()) = user_id) WITH CHECK ((select auth.uid()) = user_id);
ALTER POLICY routes_owner_delete ON public.saved_routes TO authenticated USING ((select auth.uid()) = user_id);
ALTER POLICY reports_auth_insert ON public.range_reports TO authenticated WITH CHECK ((select auth.uid()) = user_id);

ALTER POLICY "Service role can manage affiliate products" ON public.affiliate_products TO service_role USING ((select auth.role()) = 'service_role') WITH CHECK ((select auth.role()) = 'service_role');
ALTER POLICY "Service role can manage image cache" ON public.image_cache TO service_role USING ((select auth.role()) = 'service_role') WITH CHECK ((select auth.role()) = 'service_role');
ALTER POLICY "Service role manages solar cache" ON public.solar_cache TO service_role USING ((select auth.role()) = 'service_role') WITH CHECK ((select auth.role()) = 'service_role');
ALTER POLICY "Service role manages subscribers" ON public.newsletter_subscribers TO service_role USING ((select auth.role()) = 'service_role') WITH CHECK ((select auth.role()) = 'service_role');
COMMIT;
