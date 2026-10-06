-- Public reference data is readable by visitors; browser clients must not edit it.
-- Apply only after checking the EVcar production project's policies and grants.
-- Does not add role grants or affect server/service-role catalog administration.
BEGIN;
ALTER TABLE public.charger_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.installation_costs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.state_incentives ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.utility_rebates ENABLE ROW LEVEL SECURITY;
DO $$
DECLARE table_name text;
BEGIN
  FOREACH table_name IN ARRAY ARRAY['charger_products','installation_costs','state_incentives','utility_rebates'] LOOP
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = table_name AND policyname = table_name || '_public_read') THEN
      EXECUTE format('CREATE POLICY %I ON public.%I FOR SELECT TO anon, authenticated USING (true)', table_name || '_public_read', table_name);
    END IF;
  END LOOP;
END $$;
COMMIT;
