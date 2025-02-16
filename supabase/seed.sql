-- NOTE. IMPORTANT: Some table names and column names are wrapped in double quotes. This is to make them case sensitive, otherwise all keys returned from the backend would be lowercase which would be extremely annoying when trying to convert them to camel case for frontend use.

-- https://gist.github.com/khattaksd/4e8f4c89f4e928a2ecaad56d4a17ecd1

-- Insert a new user and capture its id
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
    uuid_generate_v4(),
    'authenticated',
    'authenticated',
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

-- Insert 3 gas vehicles
INSERT INTO vehicles (userID, type, "vehiclesOrder", "createdAt", "updatedAt")
SELECT id, 'gas', 1, NOW(), NOW() FROM new_user;
INSERT INTO vehicles (userID, type, "vehiclesOrder", "createdAt", "updatedAt")
SELECT id, 'gas', 2, NOW(), NOW() FROM new_user;
INSERT INTO vehicles (userID, type, "vehiclesOrder", "createdAt", "updatedAt")
SELECT id, 'gas', 3, NOW(), NOW() FROM new_user;

-- Insert 3 electric vehicles
INSERT INTO vehicles (userID, type, "vehiclesOrder", "createdAt", "updatedAt")
SELECT id, 'electric', 4, NOW(), NOW() FROM new_user;
INSERT INTO vehicles (userID, type, "vehiclesOrder", "createdAt", "updatedAt")
SELECT id, 'electric', 5, NOW(), NOW() FROM new_user;
INSERT INTO vehicles (userID, type, "vehiclesOrder", "createdAt", "updatedAt")
SELECT id, 'electric', 6, NOW(), NOW() FROM new_user;


INSERT INTO "vehicleData" ("vehicleID", "vehicleName", year, make, model, trim, "highwayMPG", "createdAt", "updatedAt")
VALUES
(1, 'Ford Focus', 2020, 'Ford', 'Focus', 'SE', 35.5, NOW(), NOW()),
(2, 'Chevrolet Malibu', 2021, 'Chevrolet', 'Malibu', 'LT', 30.2, NOW(), NOW()),
(3, 'Toyota Camry', 2019, 'Toyota', 'Camry', 'XLE', 28.4, NOW(), NOW()),
(4, 'Tesla Model 3', 2023, 'Tesla', 'Model 3', 'Long Range', 0, NOW(), NOW()),
(5, 'Nissan Leaf', 2021, 'Nissan', 'Leaf', 'S Plus', 0, NOW(), NOW()),
(6, 'Chevrolet Bolt EV', 2022, 'Chevrolet', 'Bolt EV', 'LT', 0, NOW(), NOW());

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

INSERT INTO "purchaseAndSales" ("vehicleID", "yearPurchased", "purchasePrice", "downPaymentAmount", "willSellCarAfterYears", "milesBoughtAt", "willSellCarAtMiles", "willSellCarAtPrice", "createdAt", "updatedAt")
VALUES
(1, 2020, 22000.00, 2000.00, 5, 10000, 80000, 12000.00, NOW(), NOW()),
(2, 2021, 25000.00, 2500.00, 4, 5000, 60000, 15000.00, NOW(), NOW()),
(3, 2019, 27000.00, 3000.00, 6, 12000, 90000, 13000.00, NOW(), NOW()),
(4, 2023, 39999.00, 5000.00, 4, 8000, 60000, 35000.00, NOW(), NOW()),
(5, 2021, 32000.00, 3000.00, 5, 10000, 50000, 27000.00, NOW(), NOW()),
(6, 2022, 35000.00, 4000.00, 6, 5000, 70000, 33000.00, NOW(), NOW());

INSERT INTO usage ("vehicleID", "averageDailyMiles", "weeksPerYear", "percentHighway", "extraDistanceMiles", "extraDistancePercentHighway", "createdAt", "updatedAt")
VALUES
(1, 25.0, 52, 70.0, 100.0, 60.0, NOW(), NOW()),
(2, 30.0, 50, 65.0, 200.0, 50.0, NOW(), NOW()),
(3, 20.0, 52, 80.0, 150.0, 70.0, NOW(), NOW()),
(4, 35.0, 52, 90.0, 0.0, 0.0, NOW(), NOW()),
(5, 25.0, 50, 75.0, 100.0, 65.0, NOW(), NOW()),
(6, 28.0, 52, 85.0, 50.0, 40.0, NOW(), NOW());

INSERT INTO "fixedCosts" ("vehicleID", "yearlyInsuranceCost", "yearlyRegistrationCost", "yearlyTaxes", "monthlyLoanPayment", "monthlyWarrantyCost", "inspectionCost", "otherYearlyCosts", "createdAt", "updatedAt")
VALUES
(1, 1200.00, 150.00, 200.00, 350.00, 50.00, 100.00, 500.00, NOW(), NOW()),
(2, 1400.00, 175.00, 250.00, 400.00, 60.00, 120.00, 600.00, NOW(), NOW()),
(3, 1300.00, 180.00, 225.00, 375.00, 55.00, 110.00, 550.00, NOW(), NOW()),
(4, 1600.00, 200.00, 300.00, 450.00, 70.00, 150.00, 700.00, NOW(), NOW()),
(5, 1500.00, 190.00, 275.00, 425.00, 65.00, 140.00, 650.00, NOW(), NOW()),
(6, 1550.00, 210.00, 320.00, 475.00, 80.00, 160.00, 750.00, NOW(), NOW());

INSERT INTO "yearlyMaintenanceCosts"("vehicleID", "oilChanges", tires, batteries, brakes, other, "createdAt", "updatedAt")
VALUES
(1, 75.00, 250.00, 50.00, 150.00, 200.00, NOW(), NOW()),
(2, 80.00, 280.00, 60.00, 180.00, 220.00, NOW(), NOW()),
(3, 85.00, 300.00, 70.00, 200.00, 240.00, NOW(), NOW()),
(4, 90.00, 320.00, 80.00, 220.00, 260.00, NOW(), NOW()),
(5, 95.00, 340.00, 90.00, 240.00, 280.00, NOW(), NOW()),
(6, 80.00, 360.00, 100.00, 260.00, 300.00, NOW(), NOW());

INSERT INTO "variableCosts"("vehicleID", "monthlyParkingCosts", "monthlyTolls", "monthlyCarWashCost", "monthlyMiscellaneousCosts", "monthlyCostDeductions", "createdAt", "updatedAt")
VALUES
(1, 100.00, 50.00, 20.00, 50.00, 20.00, NOW(), NOW()),
(2, 120.00, 60.00, 25.00, 60.00, 25.00, NOW(), NOW()),
(3, 140.00, 70.00, 30.00, 70.00, 30.00, NOW(), NOW()),
(4, 160.00, 80.00, 35.00, 80.00, 35.00, NOW(), NOW()),
(5, 180.00, 90.00, 40.00, 90.00, 40.00, NOW(), NOW()),
(6, 200.00, 100.00, 45.00, 100.00, 45.00, NOW(), NOW());