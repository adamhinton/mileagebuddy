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
		vehicleName: z.string().min(1).max(30).trim().describe("Vehicle Nickname"),
		year: z.number().min(1875).max(2100).describe("Year of Vehicle"),
		make: z.string().min(1).max(30).trim().describe("Vehicle Make"),
		model: z.string().min(1).max(30).trim().describe("Vehicle Model"),
		trim: z.string().min(1).max(30).trim().describe("Vehicle Trim"),
		// TODO Stretch: Delete highwayMPG, this is redundant with a field used elsewhere.
		highwayMPG: z.number().max(5000).nonnegative().nullable().optional(),
	})
	.describe("Gas Vehicle Data");

export type VehicleData = Readonly<z.infer<typeof VehicleDataSchema>>;

/** This is a SUB OBJECT of BaseVehicleSchema
 * This is NOT a vehicle, it just has some basic data
 *
 * Standard hybrids will also be treated as gas vehicles. For our calculation purposes, they're just gas vehicles with better mpg
 */
export const GasVehicleDataSchema = z
	.object({
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
	})
	.describe("Vehicle Data");

export type GasVehicleData = Readonly<z.infer<typeof GasVehicleDataSchema>>;

/** This is a SUB OBJECT of BaseVehicleSchema
 * This is NOT a vehicle, it just has some basic data
 *
 * TODO stretch: These fields are different from the fields for hybridVehicle. Standardize the fields.
 */
export const ElectricVehicleDataSchema = z
	.object({
		vehicleID: z.number().readonly(),
		costPerCharge: z
			.number()
			.nonnegative()
			.max(1000)
			.describe("Cost Per Charge $"),
		milesPerCharge: z.number().max(10_000).describe("Miles Per Charge"),
	})
	.describe("Electric Vehicle Data");

export type ElectricVehicleData = Readonly<
	z.infer<typeof ElectricVehicleDataSchema>
>;

/** This is a SUB OBJECT of BaseVehicleSchema
 * This is NOT a vehicle, it just has some basic data
 *
 * This property will only appear on Hybrid vehicles that are of type "plugin"
 * Standard hybrids will not have this property, and will be treated as a gas vehicle
 */
export const HybridVehicleDataSchema = z
	.object({
		vehicleID: z.number().readonly(),
		// Gas components
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

		// Electric components
		electricityCostPerKWh: z
			.number()
			.nonnegative()
			.max(100)
			.describe("Electricity cost per kWh $"),
		milesPerKWhHighway: z
			.number()
			.positive()
			.max(100)
			.describe("Miles per kWh highway"),
		milesPerKWhCity: z
			.number()
			.positive()
			.max(100)
			.describe("Miles per kWh city"),

		// Usage pattern
		// percentGasDriving will be derived from this so we don't need a separate field for it
		percentElectricDriving: z
			.number()
			.nonnegative()
			.max(100)
			.describe("% Driving on Electric"),
	})
	.describe("Hybrid Vehicle Data");

export type HybridVehicleData = Readonly<
	z.infer<typeof HybridVehicleDataSchema>
>;

// This error string is also used in the PurchaseAndSalesSubForm.tsx file so I'm defining it here for consistency
export const boughtAtLessThanSoldAtError =
	"Miles bought at must be less than miles you'll sell at";

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
	.describe("Purchase and Sales")
	.refine(
		(data) => {
			return data.milesBoughtAt <= data.willSellCarAtMiles;
		},
		{ message: boughtAtLessThanSoldAtError, path: ["milesBoughtAt"] }
	)
	.describe(boughtAtLessThanSoldAtError);

export type PurchaseAndSales = Readonly<z.infer<typeof PurchaseAndSalesSchema>>;

/**
 * This is a SUB OBJECT of BaseVehicleSchema
 * This is NOT a vehicle, it just has some basic data
 */
export const UsageSchema = z
	.object({
		vehicleID: z.number().readonly(),
		// TODO Stretch: This is including non-commute days. It's in a SEVEN DAY WEEK, enforce that and make sure user understands it
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
		// extraDistanceMiles isn't actually used in the calcs. TODO Stretch: delete this?
		extraDistanceMiles: z
			.number()
			.nonnegative()
			.max(500_000)
			.nullable()
			.optional()
			// TODO Stretch: Describe this better, or delete this field because we're not actually using it
			.describe("How many extra miles per year should we add on?"),
		// TODO Stretch: Delete this as well as extraDistanceMiles?
		extraDistancePercentHighway: z
			.number()
			.nonnegative()
			.max(100)
			.nullable()
			.optional()
			.describe("Extra distance percent highway"),
	})
	.describe("Usage");

export type Usage = Readonly<z.infer<typeof UsageSchema>>;

/** This is a SUB OBJECT of BaseVehicleSchema
 * This is NOT a vehicle, it just has some basic data
 */
export const FixedCostsSchema = z
	.object({
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
	})
	.describe("Fixed Costs");

export type FixedCosts = Readonly<z.infer<typeof FixedCostsSchema>>;

/** This is a SUB OBJECT of BaseVehicleSchema
 * This is NOT a vehicle, it just has some basic data
 */
export const YearlyMaintenanceCostsSchema = z
	.object({
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
		brakes: z
			.number()
			.nonnegative()
			.max(50_000)
			.describe("Yearly brakes cost $"),
		other: z
			.number()
			.nonnegative()
			.max(500_000)
			.describe("Other maintenance costs $"),
	})
	.describe("Yearly Maintenance Costs");

export type YearlyMaintenanceCosts = Readonly<
	z.infer<typeof YearlyMaintenanceCostsSchema>
>;

/** This is a SUB OBJECT of BaseVehicleSchema
 * This is NOT a vehicle, it just has some basic data
 */
export const VariableCostsSchema = z
	.object({
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
			.describe("Monthly cost savings $: Rebates, tax deductions etc"),
	})
	.describe("Variable Costs");

export type VariableCosts = Readonly<z.infer<typeof VariableCostsSchema>>;
