-- README
-- This is, obviously, a function to update a vehicle in the DB
-- Triggered from PATCH api/vehicles?id=x
-- Takes in a Partial<Vehicle> (defined at GetVehicleTypes.ts)
-- Only updates tables that are in the data passed-in
-- Should just be able to pass in the Partial<Vehicle> and the function will do the rest
-- This only updates any table if all updates are successful, otherwise it rolls back
-- Security: Checks are done in middleware to verify that the vehicle being updated belongs to the logged in user.

CREATE OR REPLACE FUNCTION update_vehicle(
    _vehicleID bigint,
    _partialData jsonb
)
RETURNS void AS $$ 
BEGIN
    -- Update vehicles table if type or vehiclesOrder is present in _partialData
    IF _partialData ? 'type' OR _partialData ? 'vehiclesOrder' THEN
        UPDATE vehicles
        SET 
            "type" = _partialData->>'type',
            "vehiclesOrder" = (_partialData->>'vehiclesOrder')::INT
        WHERE 
            id = _vehicleID;
    END IF;

    -- Update vehicleData table if vehicleData is present in _partialData
    IF _partialData ? 'vehicleData' THEN
        UPDATE "vehicleData"
        SET 
            "vehicleName" = _partialData->'vehicleData'->>'vehicleName',
            "year" = (_partialData->'vehicleData'->>'year')::INT,
            "make" = _partialData->'vehicleData'->>'make',
            "model" = _partialData->'vehicleData'->>'model',
            "trim" = _partialData->'vehicleData'->>'trim',
            "highwayMPG" = (_partialData->'vehicleData'->>'highwayMPG')::DECIMAL
        WHERE 
            "vehicleID" = _vehicleID;
    END IF;

        -- Update gasVehicleData if present and vehicle type is 'gas'
    IF _partialData ? 'gasVehicleData' AND (_partialData->>'type' = 'gas' OR NOT (_partialData ? 'type')) THEN
        UPDATE "gasVehicleData"
        SET 
            "gasCostPerGallon" = (_partialData->'gasVehicleData'->>'gasCostPerGallon')::DECIMAL,
            "milesPerGallonHighway" = (_partialData->'gasVehicleData'->>'milesPerGallonHighway')::DECIMAL,
            "milesPerGallonCity" = (_partialData->'gasVehicleData'->>'milesPerGallonCity')::DECIMAL
        WHERE 
            "vehicleID" = _vehicleID;
    END IF;

    -- Update electricVehicleData if present and vehicle type is 'electric'
    IF _partialData ? 'electricVehicleData' AND (_partialData->>'type' = 'electric' OR NOT (_partialData ? 'type')) THEN
        UPDATE "electricVehicleData"
        SET 
            "costPerCharge" = (_partialData->'electricVehicleData'->>'costPerCharge')::DECIMAL,
            "milesPerCharge" = (_partialData->'electricVehicleData'->>'milesPerCharge')::DECIMAL,
            "electricRangeMiles" = (_partialData->'electricVehicleData'->>'electricRangeMiles')::DECIMAL
        WHERE 
            "vehicleID" = _vehicleID;
    END IF;

    -- Update purchaseAndSales table if present
    IF _partialData ? 'purchaseAndSales' THEN
        UPDATE "purchaseAndSales"
        SET 
            "yearPurchased" = (_partialData->'purchaseAndSales'->>'yearPurchased')::INT,
            "purchasePrice" = (_partialData->'purchaseAndSales'->>'purchasePrice')::DECIMAL,
            "downPaymentAmount" = (_partialData->'purchaseAndSales'->>'downPaymentAmount')::DECIMAL,
            "willSellCarAfterYears" = (_partialData->'purchaseAndSales'->>'willSellCarAfterYears')::INT,
            "milesBoughtAt" = (_partialData->'purchaseAndSales'->>'milesBoughtAt')::DECIMAL,
            "willSellCarAtMiles" = (_partialData->'purchaseAndSales'->>'willSellCarAtMiles')::DECIMAL,
            "willSellCarAtPrice" = (_partialData->'purchaseAndSales'->>'willSellCarAtPrice')::DECIMAL
        WHERE 
            "vehicleID" = _vehicleID;
    END IF;

    -- Update usage table if present
    IF _partialData ? 'usage' THEN
        UPDATE "usage"
        SET 
            "averageDailyMiles" = (_partialData->'usage'->>'averageDailyMiles')::DECIMAL,
            "weeksPerYear" = (_partialData->'usage'->>'weeksPerYear')::INT,
            "percentHighway" = (_partialData->'usage'->>'percentHighway')::DECIMAL,
            "extraDistanceMiles" = (_partialData->'usage'->>'extraDistanceMiles')::DECIMAL,
            "extraDistancePercentHighway" = (_partialData->'usage'->>'extraDistancePercentHighway')::DECIMAL
        WHERE 
            "vehicleID" = _vehicleID;
    END IF;

    -- Update fixedCosts table if present
    IF _partialData ? 'fixedCosts' THEN
        UPDATE "fixedCosts"
        SET 
            "yearlyInsuranceCost" = (_partialData->'fixedCosts'->>'yearlyInsuranceCost')::DECIMAL,
            "yearlyRegistrationCost" = (_partialData->'fixedCosts'->>'yearlyRegistrationCost')::DECIMAL,
            "yearlyTaxes" = (_partialData->'fixedCosts'->>'yearlyTaxes')::INT,
            "monthlyLoanPayment" = (_partialData->'fixedCosts'->>'monthlyLoanPayment')::INT,
            "monthlyWarrantyCost" = (_partialData->'fixedCosts'->>'monthlyWarrantyCost')::INT,
            "inspectionCost" = (_partialData->'fixedCosts'->>'inspectionCost')::INT,
            "otherYearlyCosts" = (_partialData->'fixedCosts'->>'otherYearlyCosts')::INT
        WHERE 
            "vehicleID" = _vehicleID;
    END IF;

    -- Update yearlyMaintenanceCosts table if present
    IF _partialData ? 'yearlyMaintenanceCosts' THEN
        UPDATE "yearlyMaintenanceCosts"
        SET 
            "oilChanges" = (_partialData->'yearlyMaintenanceCosts'->>'oilChanges')::DECIMAL,
            "tires" = (_partialData->'yearlyMaintenanceCosts'->>'tires')::DECIMAL,
            "batteries" = (_partialData->'yearlyMaintenanceCosts'->>'batteries')::DECIMAL,
            "brakes" = (_partialData->'yearlyMaintenanceCosts'->>'brakes')::DECIMAL,
            "other" = (_partialData->'yearlyMaintenanceCosts'->>'other')::DECIMAL
        WHERE 
            "vehicleID" = _vehicleID;
    END IF;

    -- Update variableCosts table if present
    IF _partialData ? 'variableCosts' THEN
        UPDATE "variableCosts"
        SET 
            "monthlyParkingCosts" = (_partialData->'variableCosts'->>'monthlyParkingCosts')::DECIMAL,
            "monthlyTolls" = (_partialData->'variableCosts'->>'monthlyTolls')::DECIMAL,
            "monthlyCarWashCost" = (_partialData->'variableCosts'->>'monthlyCarWashCost')::DECIMAL,
            "monthlyMiscellaneousCosts" = (_partialData->'variableCosts'->>'monthlyMiscellaneousCosts')::DECIMAL,
            "monthlyCostDeductions" = (_partialData->'variableCosts'->>'monthlyCostDeductions')::DECIMAL
        WHERE 
            "vehicleID" = _vehicleID;
    END IF;

    EXCEPTION
        WHEN OTHERS THEN
            -- If any part fails, we roll back the transaction
            RAISE EXCEPTION 'Error updating vehicle: %', SQLERRM;
    END;
$$ LANGUAGE plpgsql;
