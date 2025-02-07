-- README
-- This is, obviously, a function to insert a vehicle in the DB
-- Triggered from POST api/vehicles
-- Takes in a Vehicle (defined at GetVehicleTypes.ts)
-- Should just be able to pass in the Vehicle and the function will do the rest
-- This only updates any table if all updates are successful, otherwise it rolls back
-- Note that vehicles are complicated objects, so there are eight different tables containing vehicle data
-- This function only returns the new vehicle's id, then the POST fetches that vehicle and returns the full vehicle data
-- That isn't totally efficient, but it does separate concerns. If this project gets a lot of traffic, it'll be easy to streamline later.


CREATE OR REPLACE FUNCTION insert_vehicle(
    _userID bigint,
    _type VARCHAR(10),
    _vehiclesOrder INT,
    _vehicleData jsonb,
    _gasVehicleData jsonb,  -- Optional, depending on the vehicle type
    _electricVehicleData jsonb, -- Optional, depending on the vehicle type
    _purchaseAndSales jsonb,
    _usage jsonb,
    _fixedCosts jsonb,
    _yearlyMaintenanceCosts jsonb,
    _variableCosts jsonb
)
RETURNS INTEGER AS $$  -- Return vehicleID
DECLARE
    new_vehicle_id INTEGER;
BEGIN
    BEGIN
        INSERT INTO vehicles("userid", "type", "vehiclesOrder")
        VALUES (_userID, _type, _vehiclesOrder)
        RETURNING id INTO new_vehicle_id;

        INSERT INTO "vehicleData" ("vehicleID", "vehicleName", "year", "make", "model", "trim", "highwayMPG")
        VALUES (new_vehicle_id, _vehicleData->>'vehicleName', (_vehicleData->>'year')::INT, _vehicleData->>'make', 
                _vehicleData->>'model', _vehicleData->>'trim', (_vehicleData->>'highwayMPG')::DECIMAL);

        -- Insert into gasVehicleData only for 'gas' type vehicles
        IF _type = 'gas' THEN
            INSERT INTO "gasVehicleData" ("vehicleID", "gasCostPerGallon", "milesPerGallonHighway", "milesPerGallonCity")
            VALUES (new_vehicle_id, (_gasVehicleData->>'gasCostPerGallon')::DECIMAL, 
                    (_gasVehicleData->>'milesPerGallonHighway')::DECIMAL,
                    (_gasVehicleData->>'milesPerGallonCity')::DECIMAL);
        END IF;

        -- Insert into electricVehicleData only for 'electric' type vehicles
        IF _type = 'electric' THEN
            INSERT INTO "electricVehicleData" ("vehicleID", "costPerCharge", "milesPerCharge", "electricRangeMiles")
            VALUES (new_vehicle_id, (_electricVehicleData->>'costPerCharge')::DECIMAL, 
                    (_electricVehicleData->>'milesPerCharge')::DECIMAL,
                    (_electricVehicleData->>'electricRangeMiles')::DECIMAL);
        END IF;

        INSERT INTO "purchaseAndSales" ("vehicleID", "yearPurchased", "purchasePrice", "downPaymentAmount", 
                                        "willSellCarAfterYears", "milesBoughtAt", "willSellCarAtMiles", 
                                        "willSellCarAtPrice")
        VALUES (new_vehicle_id, (_purchaseAndSales->>'yearPurchased')::INT, (_purchaseAndSales->>'purchasePrice')::DECIMAL,
                (_purchaseAndSales->>'downPaymentAmount')::DECIMAL, (_purchaseAndSales->>'willSellCarAfterYears')::INT,
                (_purchaseAndSales->>'milesBoughtAt')::DECIMAL, (_purchaseAndSales->>'willSellCarAtMiles')::DECIMAL,
                (_purchaseAndSales->>'willSellCarAtPrice')::DECIMAL);

        INSERT INTO usage ("vehicleID", "averageDailyMiles", "weeksPerYear", "percentHighway", 
                           "extraDistanceMiles", "extraDistancePercentHighway")
        VALUES (new_vehicle_id, (_usage->>'averageDailyMiles')::DECIMAL, (_usage->>'weeksPerYear')::INT,
                (_usage->>'percentHighway')::DECIMAL, (_usage->>'extraDistanceMiles')::DECIMAL,
                (_usage->>'extraDistancePercentHighway')::DECIMAL);

        INSERT INTO "fixedCosts" ("vehicleID", "yearlyInsuranceCost", "yearlyRegistrationCost", "yearlyTaxes", 
                                "monthlyLoanPayment", "monthlyWarrantyCost", 
                                  "inspectionCost", "otherYearlyCosts")
        VALUES (new_vehicle_id, (_fixedCosts->>'yearlyInsuranceCost')::DECIMAL, (_fixedCosts->>'yearlyRegistrationCost')::DECIMAL, 
                (_fixedCosts->>'yearlyTaxes')::INT, 
                (_fixedCosts->>'monthlyLoanPayment')::INT, (_fixedCosts->>'monthlyWarrantyCost')::INT,
                (_fixedCosts->>'inspectionCost')::INT, (_fixedCosts->>'otherYearlyCosts')::INT);

        INSERT INTO "yearlyMaintenanceCosts" ("vehicleID", "oilChanges", "tires", "batteries", "brakes", "other", "depreciation")
        VALUES (new_vehicle_id, (_yearlyMaintenanceCosts->>'oilChanges')::DECIMAL, (_yearlyMaintenanceCosts->>'tires')::DECIMAL,
                (_yearlyMaintenanceCosts->>'batteries')::DECIMAL, (_yearlyMaintenanceCosts->>'brakes')::DECIMAL,
                (_yearlyMaintenanceCosts->>'other')::DECIMAL, (_yearlyMaintenanceCosts->>'depreciation')::DECIMAL);

        INSERT INTO "variableCosts" ("vehicleID", "monthlyParkingCosts", "monthlyTolls", "monthlyCarWashCost", 
                                     "monthlyMiscellaneousCosts", "monthlyCostDeductions")
        VALUES (new_vehicle_id, (_variableCosts->>'monthlyParkingCosts')::DECIMAL, (_variableCosts->>'monthlyTolls')::DECIMAL,
                (_variableCosts->>'monthlyCarWashCost')::DECIMAL, (_variableCosts->>'monthlyMiscellaneousCosts')::DECIMAL,
                (_variableCosts->>'monthlyCostDeductions')::DECIMAL);

        -- Commit the transaction (this is implicit since we're using a transaction block)
        RETURN new_vehicle_id;  -- Return the new vehicle ID
    EXCEPTION
        WHEN OTHERS THEN
            -- If any part fails, we roll back the transaction
            RAISE EXCEPTION 'Error inserting vehicle and its data: %', SQLERRM;
    END;
END;
$$ LANGUAGE plpgsql;
