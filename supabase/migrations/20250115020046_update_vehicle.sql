-- README
-- This is, obviously, a function to update a vehicle in the DB
-- Triggered from PATCH api/vehicle?id=x
-- Takes in a Partial<Vehicle> (defined at GetVehicleTypes.ts)
-- Only updates tables that are in the data passed-in
-- Should just be able to pass in the Partial<Vehicle> and the function will do the rest
-- This only updates any table if all updates are successful, otherwise it rolls back

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

    EXCEPTION
        WHEN OTHERS THEN
            -- If any part fails, we roll back the transaction
            RAISE EXCEPTION 'Error updating vehicle: %', SQLERRM;
    END;
$$ LANGUAGE plpgsql;
