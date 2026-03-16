alter table "public"."electricVehicleData" enable row level security;

alter table "public"."fixedCosts" enable row level security;

alter table "public"."gasVehicleData" enable row level security;

alter table "public"."hybridVehicleData" enable row level security;

alter table "public"."purchaseAndSales" enable row level security;

alter table "public"."trip_options" enable row level security;

alter table "public"."trips" enable row level security;

alter table "public"."usage" enable row level security;

alter table "public"."variableCosts" enable row level security;

alter table "public"."vehicleData" enable row level security;

alter table "public"."vehicles" enable row level security;

alter table "public"."yearlyMaintenanceCosts" enable row level security;

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.rls_auto_enable()
 RETURNS event_trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'pg_catalog'
AS $function$
DECLARE
  cmd record;
BEGIN
  FOR cmd IN
    SELECT *
    FROM pg_event_trigger_ddl_commands()
    WHERE command_tag IN ('CREATE TABLE', 'CREATE TABLE AS', 'SELECT INTO')
      AND object_type IN ('table','partitioned table')
  LOOP
     IF cmd.schema_name IS NOT NULL AND cmd.schema_name IN ('public') AND cmd.schema_name NOT IN ('pg_catalog','information_schema') AND cmd.schema_name NOT LIKE 'pg_toast%' AND cmd.schema_name NOT LIKE 'pg_temp%' THEN
      BEGIN
        EXECUTE format('alter table if exists %s enable row level security', cmd.object_identity);
        RAISE LOG 'rls_auto_enable: enabled RLS on %', cmd.object_identity;
      EXCEPTION
        WHEN OTHERS THEN
          RAISE LOG 'rls_auto_enable: failed to enable RLS on %', cmd.object_identity;
      END;
     ELSE
        RAISE LOG 'rls_auto_enable: skip % (either system schema or not in enforced list: %.)', cmd.object_identity, cmd.schema_name;
     END IF;
  END LOOP;
END;
$function$
;


