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

INSERT INTO "fixedCosts" ("vehicleID", "yearlyInsuranceCost", "yearlyRegistrationCost", "yearlyTaxes", "monthlyLoanPayment", "monthlyWarrantyCost", "inspectionCost", "otherYearlyCosts", "createdAt", "updatedAt")
VALUES
-- Gas vehicles
(1, 1200.00, 150.00, 200.00, 350.00, 50.00, 100.00, 500.00, NOW(), NOW()),
(2, 1400.00, 175.00, 250.00, 400.00, 60.00, 120.00, 600.00, NOW(), NOW()),
(3, 1300.00, 180.00, 225.00, 375.00, 55.00, 110.00, 550.00, NOW(), NOW()),
-- Electric vehicles
(4, 1600.00, 200.00, 300.00, 450.00, 70.00, 150.00, 700.00, NOW(), NOW()),
(5, 1500.00, 190.00, 275.00, 425.00, 65.00, 140.00, 650.00, NOW(), NOW()),
(6, 1550.00, 210.00, 320.00, 475.00, 80.00, 160.00, 750.00, NOW(), NOW()),
-- Hybrid vehicles
(7, 1350.00, 160.00, 210.00, 380.00, 50.00, 90.00, 520.00, NOW(), NOW()), 
(8, 1450.00, 170.00, 240.00, 410.00, 55.00, 100.00, 580.00, NOW(), NOW()), 
(9, 1500.00, 190.00, 260.00, 430.00, 60.00, 110.00, 620.00, NOW(), NOW());

INSERT INTO "yearlyMaintenanceCosts"("vehicleID", "oilChanges", tires, batteries, brakes, other, "createdAt", "updatedAt")
VALUES
-- Gas vehicles
(1, 75.00, 250.00, 50.00, 150.00, 200.00, NOW(), NOW()),
(2, 80.00, 280.00, 60.00, 180.00, 220.00, NOW(), NOW()),
(3, 85.00, 300.00, 70.00, 200.00, 240.00, NOW(), NOW()),
-- Electric vehicles
(4, 90.00, 320.00, 80.00, 220.00, 260.00, NOW(), NOW()),
(5, 95.00, 340.00, 90.00, 240.00, 280.00, NOW(), NOW()),
(6, 80.00, 360.00, 100.00, 260.00, 300.00, NOW(), NOW()),
-- Hybrid vehicles
(7, 40.00, 280.00, 80.00, 190.00, 210.00, NOW(), NOW()), 
(8, 45.00, 290.00, 85.00, 200.00, 230.00, NOW(), NOW()), 
(9, 50.00, 310.00, 90.00, 210.00, 250.00, NOW(), NOW());

INSERT INTO "variableCosts"("vehicleID", "monthlyParkingCosts", "monthlyTolls", "monthlyCarWashCost", "monthlyMiscellaneousCosts", "monthlyCostDeductions", "createdAt", "updatedAt")
VALUES
-- Gas vehicles
(1, 100.00, 50.00, 20.00, 50.00, 20.00, NOW(), NOW()),
(2, 120.00, 60.00, 25.00, 60.00, 25.00, NOW(), NOW()),
(3, 140.00, 70.00, 30.00, 70.00, 30.00, NOW(), NOW()),
-- Electric vehicles
(4, 160.00, 80.00, 35.00, 80.00, 35.00, NOW(), NOW()),
(5, 180.00, 90.00, 40.00, 90.00, 40.00, NOW(), NOW()),
(6, 200.00, 100.00, 45.00, 100.00, 45.00, NOW(), NOW()),
-- Hybrid vehicles
(7, 110.00, 55.00, 22.00, 55.00, 22.00, NOW(), NOW()), 
(8, 130.00, 65.00, 28.00, 65.00, 28.00, NOW(), NOW()), 
(9, 150.00, 75.00, 32.00, 75.00, 32.00, NOW(), NOW());