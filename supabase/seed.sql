-- README
-- Vehicles in this project are complicated objects. So there's a main `vehicles` table, then seven sub-tables
-- This file seeds a single user (in auth.users), and six vehicles
-- This can be expanded to more users and more vehicles, there just hasn't been a need yet

-- NOTE. IMPORTANT: Some table names and column names are wrapped in double quotes. This is to make them case sensitive, otherwise all keys returned from the backend would be lowercase which would be extremely annoying when trying to convert them to camel case for frontend use.

-- NOTE. IMPORTANT: User ids: I coded my test user id that's used when creating Vehicles. It's a stupid and hacky solution. The issue is that vehicles were being created with a randomly generated UUID, whereas my authenticated userid was staying the same.

-- I used the file from https://gist.github.com/khattaksd/4e8f4c89f4e928a2ecaad56d4a17ecd1 as a template here, and tweaked to meet my needs
-- This seeds a single user in to auth.users
-- Seeding in to Supabase's auth table is complex, hence all this gibberish
-- This seeds the user, while catching the new user's id to insert vehicles for him - that's what `with new_user AS` is doing
-- This can be expanded to more users
WITH new_user AS (
  INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    recovery_sent_at,
    last_sign_in_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    email_change,
    email_change_token_new,
    recovery_token
  )
  VALUES (
    '00000000-0000-0000-0000-000000000000',
    -- Note that this could be flaky, may need to change this if your google testing accounts change
    '0488323f-5e5c-4bb2-b188-75bdaf6eb527',
    'authenticated',
    'authenticated',
    -- If you seed multiple users, need non-duplicate emails
    -- Can write a function for randomized email strings
    'adam.d.hinton@gmail.com',
    crypt('password123', gen_salt('bf')),
    current_timestamp,
    current_timestamp,
    current_timestamp,
    '{"provider":"email","providers":["email"]}',
    '{}',
    current_timestamp,
    current_timestamp,
    '',
    '',
    '',
    ''
  )
  RETURNING id
)

-- Use the captured user id from above to insert nine vehicles:
-- 3 gas vehicles (vehiclesOrder 1-3), 3 electric vehicles (vehiclesOrder 4-6), and 3 hybrid vehicles (vehiclesOrder 7-9)
INSERT INTO vehicles (userID, type, "vehiclesOrder", "createdAt", "updatedAt")
SELECT id, type, order_val, NOW(), NOW()
FROM new_user
CROSS JOIN (
    -- This makes three gas vehicles
    -- If you want more vehicles, just increase the second parameter of generate_series
    -- for instance, to make five gas vehicles, generate_series(1,5)
  SELECT gs AS order_val, 'gas' AS type FROM generate_series(1,3) gs
  UNION ALL
    --   This makes three electric vehicles
    -- See notes just above if you want to change this number
  SELECT gs + 3 AS order_val, 'electric' AS type FROM generate_series(1,3) gs
  UNION ALL
    --   This makes three hybrid vehicles of type PLUGIN; standard hybrids are handled in the gas table
    -- See notes just above if you want to change this number

  SELECT gs + 6 AS order_val, 'hybrid' AS type FROM generate_series(1,3) gs
) t;

-- Note: highwayMPG is deprecated since it's handled elsewhere; I just have to insert something there
INSERT INTO "vehicleData" ("vehicleID", "vehicleName", year, make, model, trim, "highwayMPG", "createdAt", "updatedAt")
VALUES
-- Gas Vehicles
(1, 'Ford Focus', 2020, 'Ford', 'Focus', 'SE', 35.5, NOW(), NOW()),
(2, 'Chevrolet Malibu', 2021, 'Chevrolet', 'Malibu', 'LT', 30.2, NOW(), NOW()),
(3, 'Toyota Camry', 2019, 'Toyota', 'Camry', 'XLE', 28.4, NOW(), NOW()),
-- Electric Vehicles
(4, 'Tesla Model 3', 2023, 'Tesla', 'Model 3', 'Long Range', 0, NOW(), NOW()), -- MPGe handled elsewhere
(5, 'Nissan Leaf', 2021, 'Nissan', 'Leaf', 'S Plus', 0, NOW(), NOW()), -- MPGe handled elsewhere
(6, 'Chevrolet Bolt EV', 2022, 'Chevrolet', 'Bolt EV', 'LT', 0, NOW(), NOW()), -- MPGe handled elsewhere
-- Plugin hybrids
(7, 'Toyota Prius Prime', 2022, 'Toyota', 'Prius Prime', 'XLE', 54, NOW(), NOW()), -- Combined MPG, electric handled in hybrid table
(8, 'Hyundai Ioniq Plug-in', 2021, 'Hyundai', 'Ioniq Plug-in', 'Limited', 52, NOW(), NOW()), -- Combined MPG
(9, 'Ford Escape PHEV', 2023, 'Ford', 'Escape PHEV', 'SE', 40, NOW(), NOW()); -- Combined MPG

INSERT INTO "gasVehicleData" ("vehicleID", "gasCostPerGallon", "milesPerGallonHighway", "milesPerGallonCity", "createdAt", "updatedAt")
VALUES
(1, 3.49, 40.0, 30.0, NOW(), NOW()),
(2, 3.39, 38.0, 28.0, NOW(), NOW()),
(3, 3.59, 35.0, 25.0, NOW(), NOW());

INSERT INTO "electricVehicleData" ("vehicleID", "costPerCharge", "milesPerCharge", "electricRangeMiles", "createdAt", "updatedAt")
VALUES
(4, 15.25, 350, 350, NOW(), NOW()),
(5, 8.50, 200, 215, NOW(), NOW()),
(6, 12.00, 260, 259, NOW(), NOW());

-- Data specific to plug-in hybrid vehicles
INSERT INTO "hybridVehicleData" ("vehicleID", "gasCostPerGallon", "milesPerGallonHighway", "milesPerGallonCity", "electricityCostPerKWh", "milesPerKWhHighway", "milesPerKWhCity", "percentElectricDriving", "createdAt", "updatedAt")
VALUES
(7, 3.60, 55.0, 53.0, 0.15, 4.0, 4.5, 60.0, NOW(), NOW()),
(8, 3.55, 53.0, 51.0, 0.14, 3.8, 4.2, 55.0, NOW(), NOW()),
(9, 3.70, 41.0, 39.0, 0.16, 3.5, 3.9, 45.0, NOW(), NOW());

INSERT INTO "purchaseAndSales" ("vehicleID", "yearPurchased", "purchasePrice", "downPaymentAmount", "willSellCarAfterYears", "milesBoughtAt", "willSellCarAtMiles", "willSellCarAtPrice", "createdAt", "updatedAt")
VALUES
-- Gas vehicles
(1, 2020, 22000.00, 2000.00, 5, 10000, 80000, 12000.00, NOW(), NOW()),
(2, 2021, 25000.00, 2500.00, 4, 5000, 60000, 15000.00, NOW(), NOW()),
(3, 2019, 27000.00, 3000.00, 6, 12000, 90000, 13000.00, NOW(), NOW()),
-- Electric vehicles
(4, 2023, 39999.00, 5000.00, 4, 8000, 60000, 35000.00, NOW(), NOW()),
(5, 2021, 32000.00, 3000.00, 5, 10000, 50000, 27000.00, NOW(), NOW()),
(6, 2022, 35000.00, 4000.00, 6, 5000, 70000, 33000.00, NOW(), NOW()),
-- Hybrid vehicles
(7, 2022, 28500.00, 3000.00, 5, 7000, 75000, 18000.00, NOW(), NOW()), 
(8, 2021, 30000.00, 3500.00, 5, 9000, 80000, 17000.00, NOW(), NOW()), 
(9, 2023, 38000.00, 4000.00, 6, 6000, 85000, 22000.00, NOW(), NOW());

INSERT INTO usage ("vehicleID", "averageDailyMiles", "weeksPerYear", "percentHighway", "extraDistanceMiles", "extraDistancePercentHighway", "createdAt", "updatedAt")
VALUES
-- Gas vehicles
(1, 25.0, 52, 70.0, 100.0, 60.0, NOW(), NOW()),
(2, 30.0, 50, 65.0, 200.0, 50.0, NOW(), NOW()),
(3, 20.0, 52, 80.0, 150.0, 70.0, NOW(), NOW()),
-- Electric vehicles
(4, 35.0, 52, 90.0, 0.0, 0.0, NOW(), NOW()),
(5, 25.0, 50, 75.0, 100.0, 65.0, NOW(), NOW()),
(6, 28.0, 52, 85.0, 50.0, 40.0, NOW(), NOW()),
-- Hybrid vehicles
(7, 32.0, 51, 60.0, 120.0, 55.0, NOW(), NOW()), 
(8, 27.0, 52, 55.0, 80.0, 50.0, NOW(), NOW()), 
(9, 40.0, 48, 70.0, 200.0, 60.0, NOW(), NOW());



-- Seed Trips (ensure userID matches an existing user from the WITH new_user block)
-- For simplicity, we'll assume the user created earlier has id = (SELECT id FROM new_user LIMIT 1)
-- If in the future we have a specific UUID for the user, we'll replace (SELECT id FROM new_user LIMIT 1) with that UUID.

-- Trip 1: Weekend Getaway to Napa
INSERT INTO trips ("userID", "tripsOrder", name, destination, origin, notes, "tripType", "roundTripDrivingDistanceMiles", "createdAt", "updatedAt")
SELECT id, 1, 'Weekend Getaway to Napa', 'Napa Valley, CA', 'San Francisco, CA', 'Wine tasting trip with friends.', 'SHORT_DISTANCE', 100, NOW(), NOW()
FROM new_user LIMIT 1;

INSERT INTO trip_options ("tripID", "vehicleID", name, notes, "transportMode", "parkingCosts", "tollCosts", "additionalCosts")
VALUES
((SELECT id FROM trips WHERE name = 'Weekend Getaway to Napa'), 1, 'Drive Ford Focus', 'Comfortable but less fuel efficient.', 'OWN_VEHICLE', 20, 10, 0),
((SELECT id FROM trips WHERE name = 'Weekend Getaway to Napa'), 7, 'Drive Toyota Prius Prime', 'More fuel efficient option.', 'OWN_VEHICLE', 20, 10, 0);
INSERT INTO trip_options ("tripID", name, notes, "transportMode", "transportationType", "transportationCostToDestination", "transportationCostAtDestination", "parkingCosts", "tollCosts", "additionalCosts")
VALUES
((SELECT id FROM trips WHERE name = 'Weekend Getaway to Napa'), 'Ride Share', 'Convenient but potentially costly.', 'OTHER', 'Other', 120, 50, 0, 0, 0);


-- Trip 2: Road Trip to National Park
INSERT INTO trips ("userID", "tripsOrder", name, destination, origin, notes, "tripType", "roundTripDrivingDistanceMiles", "departureDate", "returnDate", "localDrivingDistanceMiles", "createdAt", "updatedAt")
SELECT id, 2, 'Road Trip to National Park', 'Yellowstone National Park', 'Denver, CO', 'Annual family vacation.', 'LONG_DISTANCE', 1000, '2024-07-15', '2024-07-22', 200, NOW(), NOW()
FROM new_user LIMIT 1;

INSERT INTO trip_options ("tripID", "vehicleID", name, notes, "transportMode", "parkingCosts", "tollCosts", "additionalCosts")
VALUES
((SELECT id FROM trips WHERE name = 'Road Trip to National Park'), 3, 'Drive Toyota Camry', 'Scenic route, more luggage space.', 'OWN_VEHICLE', 50, 5, 0),
((SELECT id FROM trips WHERE name = 'Road Trip to National Park'), 4, 'Drive Tesla Model 3', 'Long range EV option.', 'OWN_VEHICLE', 50, 5, 0);
INSERT INTO trip_options ("tripID", name, notes, "transportMode", "transportationType", "transportationCostToDestination", "transportationCostAtDestination", "parkingCosts", "tollCosts", "additionalCosts")
VALUES
((SELECT id FROM trips WHERE name = 'Road Trip to National Park'), 'Fly and Rent Car', 'Faster, but involves rental logistics.', 'OTHER', 'Flight', 400, 300, 20, 0, 50);


-- Trip 3: Commute to Work
INSERT INTO trips ("userID", "tripsOrder", name, destination, origin, notes, "tripType", "roundTripDrivingDistanceMiles", "createdAt", "updatedAt")
SELECT id, 3, 'Commute to Work', 'Downtown Office', 'Suburban Home', 'Daily commute.', 'SHORT_DISTANCE', 30, NOW(), NOW()
FROM new_user LIMIT 1;

INSERT INTO trip_options ("tripID", "vehicleID", name, notes, "transportMode", "parkingCosts", "tollCosts", "additionalCosts")
VALUES
((SELECT id FROM trips WHERE name = 'Commute to Work'), 4, 'Drive Tesla Model 3', 'Zero emissions commute.', 'OWN_VEHICLE', 15, 2, 0),
((SELECT id FROM trips WHERE name = 'Commute to Work'), 5, 'Drive Nissan Leaf', 'Good for city driving.', 'OWN_VEHICLE', 15, 2, 0);
INSERT INTO trip_options ("tripID", name, notes, "transportMode", "transportationType", "transportationCostToDestination", "transportationCostAtDestination", "parkingCosts", "tollCosts", "additionalCosts")
VALUES
((SELECT id FROM trips WHERE name = 'Commute to Work'), 'Public Bus', 'Economical but slower.', 'OTHER', 'Bus', 5, 0, 0, 0, 0);


-- Trip 4: Visit Family Cross-Country
INSERT INTO trips ("userID", "tripsOrder", name, destination, origin, notes, "tripType", "roundTripDrivingDistanceMiles", "departureDate", "returnDate", "localDrivingDistanceMiles", "createdAt", "updatedAt")
SELECT id, 4, 'Visit Family Cross-Country', 'Chicago, IL', 'New York, NY', 'Thanksgiving holiday.', 'LONG_DISTANCE', 1600, '2024-11-20', '2024-11-28', 50, NOW(), NOW()
FROM new_user LIMIT 1;

INSERT INTO trip_options ("tripID", "vehicleID", name, notes, "transportMode", "parkingCosts", "tollCosts", "additionalCosts")
VALUES
((SELECT id FROM trips WHERE name = 'Visit Family Cross-Country'), 5, 'Drive Nissan Leaf (with stops)', 'Economical but time-consuming due to charging.', 'OWN_VEHICLE', 30, 50, 0);
INSERT INTO trip_options ("tripID", name, notes, "transportMode", "transportationType", "transportationCostToDestination", "transportationCostAtDestination", "parkingCosts", "tollCosts", "additionalCosts")
VALUES
((SELECT id FROM trips WHERE name = 'Visit Family Cross-Country'), 'Fly Direct', NULL, 'OTHER', 'Flight', 350, 70, 0, 0, 0),
((SELECT id FROM trips WHERE name = 'Visit Family Cross-Country'), 'Amtrak Train', 'Scenic, but slower than flying.', 'OTHER', 'Train', 250, 50, 0, 0, 0);