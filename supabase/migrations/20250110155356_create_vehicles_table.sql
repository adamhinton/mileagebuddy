-- README
-- Vehicles in this project are complicated objects. So there's a main `vehicles` table, then seven sub-tables
-- See GetVehicleTypes.ts for more info
-- Structure:
-- - vehicles: The main table, holds the user vehicle data.
-- - "vehicleData", gasVehicleData, electricVehicleData, purchaseAndSales, usage, "fixedCosts", yearlyMaintenanceCosts, and variableCosts: Sub-tables representing different aspects of the vehicle data.
-- - Each of these sub-tables references the `vehicles` table via `vehicleID`.
-- - Cascade delete: When a user is deleted, all related vehicles will also be deleted.

-- NOTE. IMPORTANT: Some table names and column names are wrapped in double quotes. This is to make them case sensitive, otherwise all keys returned from the backend would be lowercase which would be extremely annoying when trying to convert them to camel case for frontend use.

-- As of 1.14.2025, deleting a vehicle will also delete its sub tables.
-- Deleting a user also deletes all vehicles and all sub tables.

CREATE TABLE vehicles (
    id SERIAL PRIMARY KEY,
    userID uuid NOT NULL,
    type VARCHAR(10) NOT NULL CHECK(type IN ('gas', 'electric', 'hybrid')),
    -- The order a user's vehicles are listed in, for drag and drop purposes etc
    "vehiclesOrder" INT NOT NULL,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP DEFAULT NULL,
    CONSTRAINT fk_user FOREIGN KEY (userID) REFERENCES auth.users(id) ON DELETE CASCADE
);

CREATE TABLE "vehicleData" (
    id SERIAL PRIMARY KEY,
    "vehicleID" INTEGER NOT NULL UNIQUE,
    "vehicleName" VARCHAR(255) NOT NULL,
    year INT NULL,
    make VARCHAR(255) NULL,
    model VARCHAR(255) NULL,
    trim VARCHAR(255) NULL,
    "highwayMPG" DECIMAL(5, 2) NOT NULL,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP DEFAULT NULL,
    CONSTRAINT fk_vehicle FOREIGN KEY ("vehicleID") REFERENCES vehicles(id) ON DELETE CASCADE
);

-- Only exists on gas vehicles and STANDARD hybrid vehicles - ones that don't plug in
CREATE TABLE "gasVehicleData" (
    id SERIAL PRIMARY KEY,
    "vehicleID" INTEGER NOT NULL UNIQUE,
    "gasCostPerGallon" DECIMAL(10, 2) NOT NULL,
    "milesPerGallonHighway" DECIMAL(5, 2) NOT NULL,
    "milesPerGallonCity" DECIMAL(5, 2) NOT NULL,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP DEFAULT NULL,
    CONSTRAINT fk_vehicle FOREIGN KEY ("vehicleID") REFERENCES vehicles(id) ON DELETE CASCADE
);

-- Only exists on electric vehicles (obviously)
CREATE TABLE "electricVehicleData" (
    id SERIAL PRIMARY KEY,
    "vehicleID" INTEGER NOT NULL UNIQUE,
    "costPerCharge" DECIMAL(10, 2) NOT NULL,
    "milesPerCharge" DECIMAL(5, 2) NOT NULL,
    "electricRangeMiles" DECIMAL(5, 2) NOT NULL,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP DEFAULT NULL,
    CONSTRAINT fk_vehicle FOREIGN KEY ("vehicleID") REFERENCES vehicles(id) ON DELETE CASCADE
);

-- Only exists on PLUGIN hybrid vehicles --- standard hybrids are counted as gas vehicles for our purposes; see gasVehicleData
CREATE TABLE "hybridVehicleData" (
    id SERIAL PRIMARY KEY,
    "vehicleID" INTEGER NOT NULL UNIQUE,
    "gasCostPerGallon" DECIMAL(10, 2) NOT NULL,
    "milesPerGallonHighway" DECIMAL(5, 2) NOT NULL,
    "milesPerGallonCity" DECIMAL(5, 2) NOT NULL,
    "electricityCostPerKWh" DECIMAL(10, 2) NOT NULL,
    "milesPerKWhHighway" DECIMAL(5, 2) NOT NULL,
    "milesPerKWhCity" DECIMAL(5, 2) NOT NULL,
    "percentElectricDriving" DECIMAL(5, 2) NOT NULL,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP DEFAULT NULL,
    CONSTRAINT fk_vehicle FOREIGN KEY ("vehicleID") REFERENCES vehicles(id) ON DELETE CASCADE
);

CREATE TABLE "purchaseAndSales" (
    id SERIAL PRIMARY KEY,
    "vehicleID" INTEGER NOT NULL UNIQUE,
    "yearPurchased" INT NULL,
    "purchasePrice" DECIMAL(10, 2) NOT NULL,
    "downPaymentAmount" DECIMAL(10, 2) NULL,
    "willSellCarAfterYears" INT NOT NULL,
    "milesBoughtAt" DECIMAL(10, 2) NOT NULL,
    "willSellCarAtMiles" DECIMAL(10, 2) NOT NULL,
    "willSellCarAtPrice" DECIMAL(10, 2) NOT NULL,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP DEFAULT NULL,
    CONSTRAINT fk_vehicle FOREIGN KEY ("vehicleID") REFERENCES vehicles(id) ON DELETE CASCADE
);

CREATE TABLE usage (
    id SERIAL PRIMARY KEY,
    "vehicleID" INTEGER NOT NULL UNIQUE,
    "averageDailyMiles" DECIMAL(10, 2) NOT NULL,
    "weeksPerYear" INT NOT NULL,
    "percentHighway" DECIMAL(5, 2) NOT NULL,
    "extraDistanceMiles" DECIMAL(10, 2) NULL,
    "extraDistancePercentHighway" DECIMAL(5, 2) NULL,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP DEFAULT NULL,
    CONSTRAINT fk_vehicle FOREIGN KEY ("vehicleID") REFERENCES vehicles(id) ON DELETE CASCADE
);

CREATE TABLE "fixedCosts" (
    id SERIAL PRIMARY KEY,
    "vehicleID" INTEGER NOT NULL UNIQUE,
    "yearlyInsuranceCost" DECIMAL(10, 2),
    "yearlyRegistrationCost" DECIMAL(10, 2),
    "yearlyTaxes" INTEGER,
    "monthlyLoanPayment" INTEGER,
    "monthlyWarrantyCost" INTEGER,
    "inspectionCost" INTEGER,
    "otherYearlyCosts" INTEGER,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP DEFAULT NULL,
    CONSTRAINT fk_vehicle FOREIGN KEY ("vehicleID") REFERENCES vehicles(id) ON DELETE CASCADE
);

CREATE TABLE "yearlyMaintenanceCosts" (
    id SERIAL PRIMARY KEY,
    "vehicleID" INTEGER NOT NULL UNIQUE,
    "oilChanges" DECIMAL(10, 2),
    tires DECIMAL(10, 2),
    batteries DECIMAL(10, 2),
    brakes DECIMAL(10, 2),
    other DECIMAL(10, 2),
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP DEFAULT NULL,
    CONSTRAINT fk_vehicle FOREIGN KEY ("vehicleID") REFERENCES vehicles(id) ON DELETE CASCADE
);

CREATE TABLE "variableCosts" (
    id SERIAL PRIMARY KEY,
    "vehicleID" INTEGER NOT NULL UNIQUE,
    "monthlyParkingCosts" DECIMAL(10, 2),
    "monthlyTolls" DECIMAL(10, 2),
    "monthlyCarWashCost" DECIMAL(10, 2),
    "monthlyMiscellaneousCosts" DECIMAL(10, 2),
    "monthlyCostDeductions" DECIMAL(10, 2),
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP DEFAULT NULL,
    CONSTRAINT fk_vehicle FOREIGN KEY ("vehicleID") REFERENCES vehicles(id) ON DELETE CASCADE
);