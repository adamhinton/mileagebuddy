drop extension if exists "pg_net";

alter table "public"."electricVehicleData" disable row level security;

alter table "public"."fixedCosts" disable row level security;

alter table "public"."gasVehicleData" disable row level security;

alter table "public"."hybridVehicleData" disable row level security;

alter table "public"."purchaseAndSales" disable row level security;

alter table "public"."trip_options" disable row level security;

alter table "public"."trips" disable row level security;

alter table "public"."usage" disable row level security;

alter table "public"."variableCosts" disable row level security;

alter table "public"."vehicleData" disable row level security;

alter table "public"."vehicles" disable row level security;

alter table "public"."yearlyMaintenanceCosts" disable row level security;


