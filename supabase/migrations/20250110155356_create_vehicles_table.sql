-- README
-- Structure:
-- - vehicles: The main table, holds the user vehicle data.
-- - vehicleData, gasVehicleData, electricVehicleData, purchaseAndSales, usage, fixedCosts, yearlyMaintenanceCosts, and variableCosts: Sub-tables representing different aspects of the vehicle data.
-- - Each of these sub-tables references the `vehicles` table via `vehicleID`.
-- - Cascade delete: When a user is deleted, all related vehicles will also be deleted.

CREATE TABLE vehicles (
    id VARCHAR(255) PRIMARY KEY,
    userID bigint NOT NULL,
    type ENUM('gas', 'electric') NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deletedAt TIMESTAMP DEFAULT NULL,
    CONSTRAINT fk_user FOREIGN KEY (userID) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE vehicleData (
    id INT AUTO_INCREMENT PRIMARY KEY,
    vehicleID VARCHAR(255) NOT NULL,
    vehicleName VARCHAR(255) NOT NULL,
    year INT NULL,
    make VARCHAR(255) NULL,
    model VARCHAR(255) NULL,
    trim VARCHAR(255) NULL,
    highwayMPG DECIMAL(5, 2) NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deletedAt TIMESTAMP DEFAULT NULL,
    CONSTRAINT fk_vehicle FOREIGN KEY (vehicleID) REFERENCES vehicles(id) ON DELETE CASCADE
);

CREATE TABLE gasVehicleData (
    id INT AUTO_INCREMENT PRIMARY KEY,
    vehicleID VARCHAR(255) NOT NULL,
    gasCostPerGallon DECIMAL(10, 2) NOT NULL,
    milesPerGallonHighway DECIMAL(5, 2) NOT NULL,
    milesPerGallonCity DECIMAL(5, 2) NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deletedAt TIMESTAMP DEFAULT NULL,
    CONSTRAINT fk_vehicle FOREIGN KEY (vehicleID) REFERENCES vehicles(id) ON DELETE CASCADE
);

CREATE TABLE electricVehicleData (
    id INT AUTO_INCREMENT PRIMARY KEY,
    vehicleID VARCHAR(255) NOT NULL,
    costPerCharge DECIMAL(10, 2) NOT NULL,
    milesPerCharge DECIMAL(5, 2) NOT NULL,
    electricRangeMiles DECIMAL(5, 2) NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deletedAt TIMESTAMP DEFAULT NULL,
    CONSTRAINT fk_vehicle FOREIGN KEY (vehicleID) REFERENCES vehicles(id) ON DELETE CASCADE
);

CREATE TABLE purchaseAndSales (
    id INT AUTO_INCREMENT PRIMARY KEY,
    vehicleID VARCHAR(255) NOT NULL,
    yearPurchased INT NULL,
    purchasePrice DECIMAL(10, 2) NOT NULL,
    downPaymentAmount DECIMAL(10, 2) NULL,
    willSellCarAfterYears INT NOT NULL,
    milesBoughtAt DECIMAL(10, 2) NOT NULL,
    willSellCarAtMiles DECIMAL(10, 2) NOT NULL,
    willSellCarAtPrice DECIMAL(10, 2) NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deletedAt TIMESTAMP DEFAULT NULL,
    CONSTRAINT fk_vehicle FOREIGN KEY (vehicleID) REFERENCES vehicles(id) ON DELETE CASCADE
);

CREATE TABLE usage (
    id INT AUTO_INCREMENT PRIMARY KEY,
    vehicleID VARCHAR(255) NOT NULL,
    averageDailyMiles DECIMAL(10, 2) NOT NULL,
    weeksPerYear INT NOT NULL,
    percentHighway DECIMAL(5, 2) NOT NULL,
    extraDistanceMiles DECIMAL(10, 2) NULL,
    extraDistancePercentHighway DECIMAL(5, 2) NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deletedAt TIMESTAMP DEFAULT NULL,
    CONSTRAINT fk_vehicle FOREIGN KEY (vehicleID) REFERENCES vehicles(id) ON DELETE CASCADE
);

CREATE TABLE fixedCosts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    vehicleID VARCHAR(255) NOT NULL,
    yearlyInsuranceCost DECIMAL(10, 2) NOT NULL,
    yearlyRegistrationCost DECIMAL(10, 2) NOT NULL,
    yearlyTaxes DECIMAL(10, 2) NOT NULL,
    monthlyPayments DECIMAL(10, 2) NOT NULL,
    monthlyWarrantyCost DECIMAL(10, 2) NOT NULL,
    inspectionCost DECIMAL(10, 2) NOT NULL,
    otherYearlyCosts DECIMAL(10, 2) NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deletedAt TIMESTAMP DEFAULT NULL,
    CONSTRAINT fk_vehicle FOREIGN KEY (vehicleID) REFERENCES vehicles(id) ON DELETE CASCADE
);

CREATE TABLE yearlyMaintenanceCosts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    vehicleID VARCHAR(255) NOT NULL,
    oilChanges DECIMAL(10, 2) NOT NULL,
    tires DECIMAL(10, 2) NOT NULL,
    batteries DECIMAL(10, 2) NOT NULL,
    brakes DECIMAL(10, 2) NOT NULL,
    other DECIMAL(10, 2) NOT NULL,
    depreciation DECIMAL(10, 2) NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deletedAt TIMESTAMP DEFAULT NULL,
    CONSTRAINT fk_vehicle FOREIGN KEY (vehicleID) REFERENCES vehicles(id) ON DELETE CASCADE
);

CREATE TABLE variableCosts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    vehicleID VARCHAR(255) NOT NULL,
    monthlyParkingCosts DECIMAL(10, 2) NOT NULL,
    monthlyTolls DECIMAL(10, 2) NOT NULL,
    monthlyCarWashCost DECIMAL(10, 2) NOT NULL,
    monthlyMiscellaneousCosts DECIMAL(10, 2) NOT NULL,
    monthlyCostDeductions DECIMAL(10, 2) NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deletedAt TIMESTAMP DEFAULT NULL,
    CONSTRAINT fk_vehicle FOREIGN KEY (vehicleID) REFERENCES vehicles(id) ON DELETE CASCADE
);
