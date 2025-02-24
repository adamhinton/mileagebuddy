// README:
// This is the sub-objects that go under a Vehicle
// Each of these represents a table in the db
// Also exports a TS type for each of these, inferred from its zod schema
// All inferred types are currently Readonly because there's no reason to edit them; will change that if needed
// NOTE: The .describe() will be the input's `label`, so make it something your user will understand

import z from "zod";

/** This is a SUB OBJECT of BaseVehicleSchema
 * This is NOT a vehicle, it just has some basic data
 */
export const VehicleDataSchema = z
	.object({
		vehicleID: z.number().readonly(),
		vehicleName: z.string().min(1).max(30).describe("Vehicle Nickname"),
		year: z.number().min(1875).max(2100).describe("Year of Vehicle"),
		make: z.string().min(1).max(30).describe("Vehicle Make"),
		model: z.string().min(1).max(30).describe("Vehicle Model"),
		trim: z.string().min(1).max(30).describe("Vehicle Trim"),
		// TODO: Delete highwayMPG, this is redundant with a field used elsewhere.
		highwayMPG: z.number().max(5000).nonnegative().nullable().optional(),
	})
	.describe("test blah");

export type VehicleData = Readonly<z.infer<typeof VehicleDataSchema>>;

/** This is a SUB OBJECT of BaseVehicleSchema
 * This is NOT a vehicle, it just has some basic data
 */
export const GasVehicleDataSchema = z.object({
	vehicleID: z.number().readonly(),
	gasCostPerGallon: z
		.number()
		.max(1000)
		.nonnegative()
		.describe("Gas Cost $/gal"),
	milesPerGallonHighway: z
		.number()
		.max(1000)
		.nonnegative()
		.describe("MPG Highway"),
	milesPerGallonCity: z.number().max(1000).nonnegative().describe("MPG City"),
});

export type GasVehicleData = Readonly<z.infer<typeof GasVehicleDataSchema>>;

/** This is a SUB OBJECT of BaseVehicleSchema
 * This is NOT a vehicle, it just has some basic data
 */
export const ElectricVehicleDataSchema = z.object({
	vehicleID: z.number().readonly(),
	costPerCharge: z
		.number()
		.nonnegative()
		.max(1000)
		.describe("Cost Per Charge $"),
	milesPerCharge: z.number().max(10_000).describe("Miles Per Charge"),
});

export type ElectricVehicleData = Readonly<
	z.infer<typeof ElectricVehicleDataSchema>
>;

/** This is a SUB OBJECT of BaseVehicleSchema
 * This is NOT a vehicle, it just has some basic data
 */
export const PurchaseAndSalesSchema = z
	.object({
		vehicleID: z.number().readonly(),
		yearPurchased: z
			.number()
			.int()
			.positive()
			.max(2100)
			.describe("Year purchased"),
		purchasePrice: z
			.number()
			.int()
			.max(50_000_000)
			.positive()
			.describe("Purchase price $"),
		downPaymentAmount: z
			.number()
			.int()
			.max(50_000_000)
			.nonnegative()
			.describe("Down payment $"),
		willSellCarAfterYears: z
			.number()
			.max(1000)
			.positive()
			.describe("How many years you'll have the car"),
		milesBoughtAt: z
			.number()
			.int()
			.max(2_000_000)
			.positive()
			.describe("Odometer miles at purchase"),
		willSellCarAtMiles: z
			.number()
			.int()
			.max(2_000_000)
			.positive()
			.describe("How many miles will it have when you sell it?"),
		willSellCarAtPrice: z
			.number()
			.int()
			.max(50_000_000)
			.positive()
			.describe("Price you'll sell it for $"),
	})
	.refine((data) => {
		return data.milesBoughtAt <= data.willSellCarAtMiles;
	})
	.describe("Miles bought at must be less than miles you'll sell at");

export type PurchaseAndSales = Readonly<z.infer<typeof PurchaseAndSalesSchema>>;

/**
 * This is a SUB OBJECT of BaseVehicleSchema
 * This is NOT a vehicle, it just has some basic data
 */
export const UsageSchema = z.object({
	vehicleID: z.number().readonly(),
	// TODO: This is including non-commute days. It's in a SEVEN DAY WEEK, enforce that and make sure user understands it
	averageDailyMiles: z
		.number()
		.max(5_000)
		.nonnegative()
		.describe("Average daily miles (7 day week)"),
	weeksPerYear: z
		.number()
		.int()
		.nonnegative()
		.max(52)
		.describe("Weeks driven per year"),
	percentHighway: z
		.number()
		.nonnegative()
		.max(100)
		.describe("% highway driving"),
	extraDistanceMiles: z
		.number()
		.nonnegative()
		.max(500_000)
		.nullable()
		// TODO Describe this better
		.describe("How many extra miles per year should we add on?"),
	extraDistancePercentHighway: z
		.number()
		.nonnegative()
		.max(100)
		.nullable()
		.describe("Extra distance percent highway"),
});

export type Usage = Readonly<z.infer<typeof UsageSchema>>;

/** This is a SUB OBJECT of BaseVehicleSchema
 * This is NOT a vehicle, it just has some basic data
 */
export const FixedCostsSchema = z.object({
	vehicleID: z.number().readonly(),
	yearlyInsuranceCost: z
		.number()
		.nonnegative()
		.max(500_000)
		.describe("Yearly insurance cost $"),
	yearlyRegistrationCost: z
		.number()
		.nonnegative()
		.max(50_000)
		.describe("Yearly registration cost $"),
	yearlyTaxes: z
		.number()
		.nonnegative()
		.max(50_000_000)
		.describe("Yearly taxes $"),
	monthlyLoanPayment: z
		.number()
		.max(50_000)
		.nonnegative()
		.describe("Monthly loan payment $"),
	monthlyWarrantyCost: z
		.number()
		.max(50_000)
		.nonnegative()
		.describe("Monthly warranty cost $"),
	inspectionCost: z
		.number()
		.max(5_000)
		.nonnegative()
		.describe("Yearly inspection cost $"),
	otherYearlyCosts: z
		.number()
		.max(500_000)
		.nonnegative()
		.describe("Other yearly costs $"),
});

export type FixedCosts = Readonly<z.infer<typeof FixedCostsSchema>>;

/** This is a SUB OBJECT of BaseVehicleSchema
 * This is NOT a vehicle, it just has some basic data
 */
export const YearlyMaintenanceCostsSchema = z.object({
	vehicleID: z.number().readonly(),
	oilChanges: z
		.number()
		.nonnegative()
		.max(1_000)
		.describe("Yearly oil changes cost $"),
	tires: z.number().nonnegative().max(50_000).describe("Yearly tires cost $"),
	batteries: z
		.number()
		.nonnegative()
		.max(50_000)
		.describe("Yearly batteries cost $"),
	brakes: z.number().nonnegative().max(50_000).describe("Yearly brakes cost $"),
	other: z
		.number()
		.nonnegative()
		.max(500_000)
		.describe("Other maintenance costs $"),
});

export type YearlyMaintenanceCosts = Readonly<
	z.infer<typeof YearlyMaintenanceCostsSchema>
>;

/** This is a SUB OBJECT of BaseVehicleSchema
 * This is NOT a vehicle, it just has some basic data
 */
export const VariableCostsSchema = z.object({
	vehicleID: z.number().readonly(),
	monthlyParkingCosts: z
		.number()
		.max(20_000)
		.nonnegative()
		.describe("Monthly parking costs $"),
	monthlyTolls: z
		.number()
		.max(20_000)
		.nonnegative()
		.describe("Monthly tolls $"),
	monthlyCarWashCost: z
		.number()
		.max(10_000)
		.nonnegative()
		.describe("Monthly car wash cost $"),
	monthlyMiscellaneousCosts: z
		.number()
		.max(500_000)
		.nonnegative()
		.describe("Monthly miscellaneous costs $"),
	monthlyCostDeductions: z
		.number()
		.max(500_000)
		.nonnegative()
		.describe("Monthly cost savings: Rebates, tax deductions etc"),
});

export type VariableCosts = Readonly<z.infer<typeof VariableCostsSchema>>;
