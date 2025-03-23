CREATE OR REPLACE FUNCTION update_vehicles_order(
    _userid UUID,
    _vehicle_orders jsonb  -- Format: [{"id": 1, "order": 2}, {"id": 2, "order": 1}]
)
RETURNS VOID AS $$
DECLARE
    vehicle_record jsonb;
    vehicle_id INT;
    vehicle_order INT;
BEGIN
    FOR i IN 0..jsonb_array_length(_vehicle_orders) - 1 LOOP
        vehicle_record := jsonb_array_element(_vehicle_orders, i);
        vehicle_id := (vehicle_record->>'id')::INT;
        vehicle_order := (vehicle_record->>'order')::INT;

        UPDATE vehicles
        SET "vehiclesOrder" = vehicle_order
        WHERE id = vehicle_id AND userid = _userid;
    END LOOP;
END;
$$ LANGUAGE plpgsql;
