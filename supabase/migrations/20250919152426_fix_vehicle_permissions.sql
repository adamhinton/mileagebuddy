-- _________________________
-- I created this file after moving from an old supabase project to a new one.
-- I hacked and slashed the remote schema migration to get rid of some errors, but managed to screw some stuff up in the process.
-- This is another hack and slash solution to fix the first hack and slash problem.
-- Good luck.
-- _________________________

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
CREATE POLICY "Allow authenticated users to manage their own vehicles"
ON public."vehicles"
FOR ALL
TO authenticated
USING (auth.uid() = userid)
WITH CHECK (auth.uid() = userid);

-- Create RLS policies for related tables, assuming they link back to 'vehicles'
-- NOTE: This assumes your foreign key column is named "vehicleID" and is also case-sensitive.
-- If it's named something else (e.g., "vehicle_id"), you will need to adjust it below.
CREATE POLICY "Allow users to manage related gas data"
ON public."gasVehicleData"
FOR ALL
TO authenticated
USING ((SELECT v.userid FROM public.vehicles v WHERE v.id = "vehicleID") = auth.uid())
WITH CHECK ((SELECT v.userid FROM public.vehicles v WHERE v.id = "vehicleID") = auth.uid());

CREATE POLICY "Allow users to manage related electric data"
ON public."electricVehicleData"
FOR ALL
TO authenticated
USING ((SELECT v.userid FROM public.vehicles v WHERE v.id = "vehicleID") = auth.uid())
WITH CHECK ((SELECT v.userid FROM public.vehicles v WHERE v.id = "vehicleID") = auth.uid());

CREATE POLICY "Allow users to manage related hybrid data"
ON public."hybridVehicleData"
FOR ALL
TO authenticated
USING ((SELECT v.userid FROM public.vehicles v WHERE v.id = "vehicleID") = auth.uid())
WITH CHECK ((SELECT v.userid FROM public.vehicles v WHERE v.id = "vehicleID") = auth.uid());

CREATE POLICY "Allow users to manage related purchase/sales data"
ON public."purchaseAndSales"
FOR ALL
TO authenticated
USING ((SELECT v.userid FROM public.vehicles v WHERE v.id = "vehicleID") = auth.uid())
WITH CHECK ((SELECT v.userid FROM public.vehicles v WHERE v.id = "vehicleID") = auth.uid());

CREATE POLICY "Allow users to manage related usage data"
ON public."usage"
FOR ALL
TO authenticated
USING ((SELECT v.userid FROM public.vehicles v WHERE v.id = "vehicleID") = auth.uid())
WITH CHECK ((SELECT v.userid FROM public.vehicles v WHERE v.id = "vehicleID") = auth.uid());

CREATE POLICY "Allow users to manage related fixed costs"
ON public."fixedCosts"
FOR ALL
TO authenticated
USING ((SELECT v.userid FROM public.vehicles v WHERE v.id = "vehicleID") = auth.uid())
WITH CHECK ((SELECT v.userid FROM public.vehicles v WHERE v.id = "vehicleID") = auth.uid());

CREATE POLICY "Allow users to manage related maintenance costs"
ON public."yearlyMaintenanceCosts"
FOR ALL
TO authenticated
USING ((SELECT v.userid FROM public.vehicles v WHERE v.id = "vehicleID") = auth.uid())
WITH CHECK ((SELECT v.userid FROM public.vehicles v WHERE v.id = "vehicleID") = auth.uid());

CREATE POLICY "Allow users to manage related variable costs"
ON public."variableCosts"
FOR ALL
TO authenticated
USING ((SELECT v.userid FROM public.vehicles v WHERE v.id = "vehicleID") = auth.uid())
WITH CHECK ((SELECT v.userid FROM public.vehicles v WHERE v.id = "vehicleID") = auth.uid());