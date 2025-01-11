-- import { z } from "zod";

-- export const VehicleSchema = z.object({
-- 	vehicleName: z.string(),
-- 	year: z.number(),
-- 	make: z.string(),
-- 	model: z.string(),
-- 	gasCostPerGallon: z.number(),
-- 	milesPerGallon: z.number(),
-- 	yearlyMaintenanceCost: z.number(),
-- 	yearlyInsuranceCost: z.number(),
-- 	yearlyRegistrationCost: z.number(),
-- 	yearlyTaxes: z.number(),
-- 	yearlyDepreciation: z.number(),
-- 	monthlyPayments: z.number(),
-- 	monthlyParkingCosts: z.number(),
-- 	monthlyTolls: z.number(),
-- 	monthlyCarWashes: z.number(),
-- 	miscellaneousMonthlyCosts: z.number(),
-- });

-- export type Vehicle = z.infer<typeof VehicleSchema>;


CREATE TABLE vehicles (
    id SERIAL PRIMARY KEY,
    vehicleName VARCHAR(255) NOT NULL,
    year INT NOT NULL,
    make VARCHAR(255) NOT NULL,
    model VARCHAR(255) NOT NULL,
    gasCostPerGallon DECIMAL NOT NULL,
    milesPerGallon DECIMAL NOT NULL,
    yearlyMaintenanceCost DECIMAL NOT NULL,
    yearlyInsuranceCost DECIMAL NOT NULL,
    yearlyRegistrationCost DECIMAL NOT NULL,
    yearlyTaxes DECIMAL NOT NULL,
    yearlyDepreciation DECIMAL NOT NULL,
    monthlyPayments DECIMAL NOT NULL,
    monthlyParkingCosts DECIMAL NOT NULL,
    monthlyTolls DECIMAL NOT NULL,
    monthlyCarWashes DECIMAL NOT NULL,
    miscellaneousMonthlyCosts DECIMAL NOT NULL
);