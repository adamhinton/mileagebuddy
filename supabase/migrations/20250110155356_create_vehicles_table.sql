-- README:
-- This is the migration for creating the vehicles table.
-- I have split up vehicles' data in to different tables for ease of organization.
-- Each table here (except for vehicles) belongs to a vehicle.
-- So an entry in vehicle_data belongs to a vehicle table entry.
-- This is heavily based on VehicleSchema.ts

CREATE TABLE vehicles (
  id SERIAL PRIMARY KEY,
  userId VARCHAR(255) NOT NULL,
  type VARCHAR(255) NOT NULL CHECK (type IN ('gas', 'electric')),
  createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  deletedAt TIMESTAMP
);

CREATE TABLE vehicle_data (
  id SERIAL PRIMARY KEY,
  vehicleId INTEGER NOT NULL REFERENCES vehicles(id),
  vehicleName VARCHAR(255) NOT NULL,
  year INTEGER,
  make VARCHAR(255),
  model VARCHAR(255),
  trim VARCHAR(255),
  highwayMPG DECIMAL(10, 2) NOT NULL CHECK (highwayMPG > 0),
  createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  deletedAt TIMESTAMP
);

CREATE TABLE gas_vehicle_data (
  id SERIAL PRIMARY KEY,
  vehicleId INTEGER NOT NULL REFERENCES vehicles(id),
  gasCostPerGallon DECIMAL(10, 2) NOT NULL CHECK (gasCostPerGallon >= 0),
  milesPerGallonHighway DECIMAL(10, 2) NOT NULL CHECK (milesPerGallonHighway > 0),
  milesPerGallonCity DECIMAL(10, 2) NOT NULL CHECK (milesPerGallonCity > 0),
  createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  deletedAt TIMESTAMP
);

CREATE TABLE electric_vehicle_data (
  id SERIAL PRIMARY KEY,
  vehicleId INTEGER NOT NULL REFERENCES vehicles(id),
  batteryType VARCHAR(255) NOT NULL,
  costPerCharge DECIMAL(10, 2) NOT NULL CHECK (costPerCharge >= 0),
  milesPerCharge DECIMAL(10, 2) NOT NULL CHECK (milesPerCharge >= 0),
  createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  deletedAt TIMESTAMP
);

CREATE TABLE purchase_and_sales (
  id SERIAL PRIMARY KEY,
  vehicleId INTEGER NOT NULL REFERENCES vehicles(id),
  yearPurchased INTEGER,
  purchasePrice DECIMAL(10, 2) NOT NULL,
  downPaymentAmount DECIMAL(10, 2),
  willSellCarAfterYears INTEGER NOT NULL,
  milesBoughtAt DECIMAL(10, 2) NOT NULL CHECK (milesBoughtAt >= 0),
  willSellCarAtMiles DECIMAL(10, 2) NOT NULL CHECK (willSellCarAtMiles >= 0),
  willSellCarAtPrice DECIMAL(10, 2) NOT NULL,
  createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  deletedAt TIMESTAMP
);

CREATE TABLE usage (
  id SERIAL PRIMARY KEY,
  vehicleId INTEGER NOT NULL REFERENCES vehicles(id),
  averageDailyMiles DECIMAL(10, 2) NOT NULL,
  weeksPerYear DECIMAL(10, 2) NOT NULL,
  percentHighway DECIMAL(10, 2) NOT NULL CHECK (percentHighway BETWEEN 0 AND 100),
  extraDistanceMiles DECIMAL(10, 2),
  extraDistancePercentHighway DECIMAL(10, 2) CHECK (extraDistancePercentHighway BETWEEN 0 AND 100),
  createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  deletedAt TIMESTAMP
);