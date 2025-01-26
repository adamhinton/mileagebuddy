// README:
// This is the sub-objects that go under a Vehicle
// Each of these represents a table in the db

import z from "zod";

/** This is a SUB OBJECT of BaseVehicleSchema
 * This is NOT a vehicle, it just has some basic data
 */
export const VehicleDataSchema = z
	.object({
		vehicleID: z.number().readonly(),
		vehicleName: z.string().min(1).max(30),
		year: z.number().min(1875).max(2100).nullable(),
		make: z.string().min(1).max(30).nullable(),
		model: z.string().min(1).max(30).nullable(),
		trim: z.string().min(1).max(30).nullable(),
		highwayMPG: z.number().max(5000).nonnegative().nullable(),
	})
	.describe("test blah");

/** This is a SUB OBJECT of BaseVehicleSchema
 * This is NOT a vehicle, it just has some basic data
 */
export const GasVehicleDataSchema = z.object({
	vehicleID: z.number().readonly(),
	gasCostPerGallon: z.number().max(1000).nonnegative().nullable(),
	milesPerGallonHighway: z.number().max(1000).nonnegative().nullable(),
	milesPerGallonCity: z.number().max(1000).nonnegative().nullable(),
});

/** This is a SUB OBJECT of BaseVehicleSchema
 * This is NOT a vehicle, it just has some basic data
 */
export const ElectricVehicleDataSchema = z.object({
	vehicleID: z.number().readonly(),
	costPerCharge: z.number().nonnegative().max(1000).nullable(),
	milesPerCharge: z.number().max(10_000).nullable(),
	electricRangeMiles: z.number().max(10_000).nonnegative().nullable(),
});

/** This is a SUB OBJECT of BaseVehicleSchema
 * This is NOT a vehicle, it just has some basic data
 */
export const PurchaseAndSalesSchema = z
	.object({
		vehicleID: z.number().readonly(),
		yearPurchased: z.number().positive().max(2100).nullable(),
		purchasePrice: z.number().max(50_000_000).positive(),
		downPaymentAmount: z.number().max(50_000_000).nonnegative().nullable(),
		willSellCarAfterYears: z.number().max(1000).positive(),
		milesBoughtAt: z.number().max(2_000_000).positive(),
		willSellCarAtMiles: z.number().max(2_000_000).positive(),
		willSellCarAtPrice: z.number().max(50_000_000).positive(),
	})
	.refine((data) => {
		return data.milesBoughtAt <= data.willSellCarAtMiles;
	})
	.describe("milesBoughtAt must be less than or equal to willSellCarAtMiles");

/**
 * This is a SUB OBJECT of BaseVehicleSchema
 * This is NOT a vehicle, it just has some basic data
 */
export const UsageSchema = z.object({
	vehicleID: z.number().readonly(),
	averageDailyMiles: z.number().max(5_000).nonnegative(),
	weeksPerYear: z.number().nonnegative().max(52),
	percentHighway: z.number().nonnegative().max(100),
	extraDistanceMiles: z.number().nonnegative().max(500_000).nullable(),
	extraDistancePercentHighway: z.number().nonnegative().max(100).nullable(),
});

/** This is a SUB OBJECT of BaseVehicleSchema
 * This is NOT a vehicle, it just has some basic data
 */
export const FixedCostsSchema = z.object({
	vehicleID: z.number().readonly(),
	yearlyInsuranceCost: z.number().nonnegative().max(500_000).nullable(),
	yearlyRegistrationCost: z.number().nonnegative().max(50_000).nullable(),
	yearlyTaxes: z.number().nonnegative().max(50_000_000).nullable(),
	yearlyParkingCost: z.number().nonnegative().max(50_000).nullable(),
	monthlyLoanPayment: z.number().max(50_000).nonnegative().nullable(),
	monthlyWarrantyCost: z.number().max(50_000).nonnegative().nullable(),
	inspectionCost: z.number().max(5_000).nonnegative().nullable(),
	otherYearlyCosts: z.number().max(500_000).nonnegative().nullable(),
});

/** This is a SUB OBJECT of BaseVehicleSchema
 * This is NOT a vehicle, it just has some basic data
 */
export const YearlyMaintenanceCostsSchema = z.object({
	vehicleID: z.number().readonly(),
	oilChanges: z.number().nonnegative().max(1_000).nullable(),
	tires: z.number().nonnegative().max(50_000).nullable(),
	batteries: z.number().nonnegative().max(50_000).nullable(),
	brakes: z.number().nonnegative().max(50_000).nullable(),
	other: z.number().nonnegative().max(500_000).nullable(),
	depreciation: z.number().nonnegative().max(500_000).nullable(),
});

/** This is a SUB OBJECT of BaseVehicleSchema
 * This is NOT a vehicle, it just has some basic data
 */
export const VariableCostsSchema = z.object({
	vehicleID: z.number().readonly(),
	monthlyParkingCosts: z.number().max(5_000).nonnegative().nullable(),
	monthlyTolls: z.number().max(5_000).nonnegative().nullable(),
	monthlyCarWashCost: z.number().max(5_000).nonnegative().nullable(),
	monthlyMiscellaneousCosts: z.number().max(500_000).nonnegative().nullable(),
	monthlyCostDeductions: z.number().max(500_000).nonnegative().nullable(),
});
