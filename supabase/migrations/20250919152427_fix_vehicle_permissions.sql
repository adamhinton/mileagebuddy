-- Enable Row Level Security for all vehicle-related tables
ALTER TABLE public."vehicles" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."gasVehicleData" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."electricVehicleData" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."hybridVehicleData" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."purchaseAndSales" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."usage" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."fixedCosts" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."yearlyMaintenanceCosts" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."variableCosts" ENABLE ROW LEVEL SECURITY;

-- Grant permissions to the 'authenticated' role
GRANT SELECT, INSERT, UPDATE, DELETE ON public."vehicles" TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public."gasVehicleData" TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public."electricVehicleData" TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public."hybridVehicleData" TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public."purchaseAndSales" TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public."usage" TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public."fixedCosts" TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public."yearlyMaintenanceCosts" TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public."variableCosts" TO authenticated;

-- Create RLS policies for the 'vehicles' table
-- ** NEW/CHANGED SECTION **
-- Drop the old policy if it exists, to prevent errors on re-run
DROP POLICY IF EXISTS "Allow authenticated users to manage their own vehicles" ON public."vehicles";

-- Create a specific policy for SELECT (reading)
CREATE POLICY "Allow authenticated users to read their own vehicles"
ON public."vehicles"
FOR SELECT
TO authenticated
USING (auth.uid() = userid);

-- Create a policy for INSERT, UPDATE, DELETE (writing)
CREATE POLICY "Allow authenticated users to modify their own vehicles"
ON public."vehicles"
FOR ALL -- This now applies to INSERT, UPDATE, DELETE
TO authenticated
USING (auth.uid() = userid)
WITH CHECK (auth.uid() = userid);
-- ** END OF NEW/CHANGED SECTION **

-- Create RLS policies for related tables, assuming they link back to 'vehicles'
DROP POLICY IF EXISTS "Allow users to manage related gas data" ON public."gasVehicleData";
CREATE POLICY "Allow users to manage related gas data"
ON public."gasVehicleData"
FOR ALL
TO authenticated
USING ((SELECT v.userid FROM public.vehicles v WHERE v.id = "vehicleID") = auth.uid())
WITH CHECK ((SELECT v.userid FROM public.vehicles v WHERE v.id = "vehicleID") = auth.uid());

DROP POLICY IF EXISTS "Allow users to manage related electric data" ON public."electricVehicleData";
CREATE POLICY "Allow users to manage related electric data"
ON public."electricVehicleData"
FOR ALL
TO authenticated
USING ((SELECT v.userid FROM public.vehicles v WHERE v.id = "vehicleID") = auth.uid())
WITH CHECK ((SELECT v.userid FROM public.vehicles v WHERE v.id = "vehicleID") = auth.uid());

DROP POLICY IF EXISTS "Allow users to manage related hybrid data" ON public."hybridVehicleData";
CREATE POLICY "Allow users to manage related hybrid data"
ON public."hybridVehicleData"
FOR ALL
TO authenticated
USING ((SELECT v.userid FROM public.vehicles v WHERE v.id = "vehicleID") = auth.uid())
WITH CHECK ((SELECT v.userid FROM public.vehicles v WHERE v.id = "vehicleID") = auth.uid());

DROP POLICY IF EXISTS "Allow users to manage related purchase/sales data" ON public."purchaseAndSales";
CREATE POLICY "Allow users to manage related purchase/sales data"
ON public."purchaseAndSales"
FOR ALL
TO authenticated
USING ((SELECT v.userid FROM public.vehicles v WHERE v.id = "vehicleID") = auth.uid())
WITH CHECK ((SELECT v.userid FROM public.vehicles v WHERE v.id = "vehicleID") = auth.uid());

DROP POLICY IF EXISTS "Allow users to manage related usage data" ON public."usage";
CREATE POLICY "Allow users to manage related usage data"
ON public."usage"
FOR ALL
TO authenticated
USING ((SELECT v.userid FROM public.vehicles v WHERE v.id = "vehicleID") = auth.uid())
WITH CHECK ((SELECT v.userid FROM public.vehicles v WHERE v.id = "vehicleID") = auth.uid());

DROP POLICY IF EXISTS "Allow users to manage related fixed costs" ON public."fixedCosts";
CREATE POLICY "Allow users to manage related fixed costs"
ON public."fixedCosts"
FOR ALL
TO authenticated
USING ((SELECT v.userid FROM public.vehicles v WHERE v.id = "vehicleID") = auth.uid())
WITH CHECK ((SELECT v.userid FROM public.vehicles v WHERE v.id = "vehicleID") = auth.uid());

DROP POLICY IF EXISTS "Allow users to manage related maintenance costs" ON public."yearlyMaintenanceCosts";
CREATE POLICY "Allow users to manage related maintenance costs"
ON public."yearlyMaintenanceCosts"
FOR ALL
TO authenticated
USING ((SELECT v.userid FROM public.vehicles v WHERE v.id = "vehicleID") = auth.uid())
WITH CHECK ((SELECT v.userid FROM public.vehicles v WHERE v.id = "vehicleID") = auth.uid());

DROP POLICY IF EXISTS "Allow users to manage related variable costs" ON public."variableCosts";
CREATE POLICY "Allow users to manage related variable costs"
ON public."variableCosts"
FOR ALL
TO authenticated
USING ((SELECT v.userid FROM public.vehicles v WHERE v.id = "vehicleID") = auth.uid())
WITH CHECK ((SELECT v.userid FROM public.vehicles v WHERE v.id = "vehicleID") = auth.uid());