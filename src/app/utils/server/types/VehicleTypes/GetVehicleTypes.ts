/* eslint-disable @typescript-eslint/no-unused-vars */

// TODO: Clean up this file

// NOTE: To get the type of sub-objects within Vehicles, do this:
// const fixedCosts: Vehicle["fixedCosts"] = ...

// README:
// Here we define types for Vehicle (obviously)
// IMPORTANT: VehicleSchema is the daddy type that all these other types are based on. VehicleSchema is MANUALLLY WRITTEN by me, which means that any time you change your db schema, you have to update this type manually.
// A number of sub types are defined:
// GasVehicle and ElectricVehicle:
// --> These are, respectively, vehicles where "type" = "gas" and electricVehicleData is null, and where "type" = "electric" and gasVehicleData is null
// --> They form a union called Vehicle
// VehicleSchema: The schema for a Vehicle, with all fields included
// Vehicles type: An array of Vehicle
// VehicleFromDB: A single Vehicle in the structure it is returned from the DB
// VehicleToBePostedSchema: A Vehicle with all ids removed, for posting to the DB. Because it won't have ids before you post it.
// --> Vehicle_For_db_POST: The inferred type of VehicleToBePostedSchema

// GUIDE:
// As outlined above:
// Here are the types to use in different situations
// Vehicle you're GETTING from the DB: Vehicle
// Vehicle you're POSTING to the DB: Vehicle_For_db_POST
// Vehicle you're PATCHING to the DB: TODO, will write this soon

import z from "zod";
import {
	ElectricVehicleDataSchema,
	FixedCostsSchema,
	GasVehicleDataSchema,
	PurchaseAndSalesSchema,
	UsageSchema,
	VariableCostsSchema,
	VehicleDataSchema,
	YearlyMaintenanceCostsSchema,
} from "./VehicleSubSchemas";

/**This will be either an ElectricVehicle type or GasVehicle type
 * depending on the "type" field ("type": "gas" or "type":  "electric").
 * This matches what you will receive from a GET request to the db.
 * There are other types for vehicles you haven't POSTed yet, or PATCH vehicles.
 */
export type Vehicle = z.infer<typeof VehicleSchema>;

/**This is what you get back from the db
 * It has all the ids and stuff
 */
export type Vehicles = Vehicle[];

/**IMPORTANT:
 *
 * This doesn't match what you expect?
 *
 * You have to manually update the zod Schema with any new changes to your db schema.
 *
 * This schema is manually generated. This is the grandfather prototype of all Vehicles. Further types will be inferred from this.
 *
 * INFO:
 *
 * This is the grandaddy schema that Vehicles are inferred from.
 *
 * This is broken down further in to GasVehicleSchema and ElectricVehicleSchema, which are then combined in to VehicleSchema.
 *
 * Then, the Vehicle type is a union of those two types.
 *
 * IMPORTANT: Don't use this type for anything outside this file; VehicleSchema (and the type Vehicle which is inferred from it) is best.
 *
 * Note: I left maxes on these to avoid ridiculously high number spam
 *
 * IMPORTANT: Extending this schema? Make sure to slap .refine(data =>{ return refineZodVehicleValidation(data)}) on the end of your new schema
 * This is because Zod can't handle unions or sub-types like .extend, .omit etc. with .refine
 *
 */
export const BaseVehicleSchema = z.object({
	id: z.number().readonly(),
	userid: z.number().readonly(),
	vehiclesOrder: z.number().positive(),
	type: z.enum(["gas", "electric"]),

	vehicleData: VehicleDataSchema.describe("test blah 2"),

	gasVehicleData: GasVehicleDataSchema,

	electricVehicleData: ElectricVehicleDataSchema,

	purchaseAndSales: PurchaseAndSalesSchema,

	usage: UsageSchema,

	fixedCosts: FixedCostsSchema,

	yearlyMaintenanceCosts: YearlyMaintenanceCostsSchema,

	variableCosts: VariableCostsSchema,
});

export const GasVehicleSchema = BaseVehicleSchema.extend({
	type: z.literal("gas"),
	electricVehicleData: z
		.null()
		.describe("electricVehicleData must be null because this is a gas vehicle"),
});

export const ElectricVehicleSchema = BaseVehicleSchema.extend({
	type: z.literal("electric"),
	gasVehicleData: z
		.null()
		.describe(
			"gasVehicleData must be null because this is an electric vehicle"
		),
});

/**
 * The type Vehicle is inferred from this
 *
 * IMPORTANT: Extending this schema? Make sure to slap .refine(data =>{ return refineZodVehicleValidation(data)}) on the end of your new schema
 * This is because Zod can't handle unions or sub-types like .extend, .omit etc. with .refine
 * And .refine is important for more complex validations that can't be done with built in Zod functions like .max() or .nonnegative()
 */
export const VehicleSchema = z.union([GasVehicleSchema, ElectricVehicleSchema]);

/**
 * This performs refinements on Vehicle that can't be just done by built in zod functions like .max() or .nonnegative() etc
 *
 * Zod objects have a .refine() method but that method doesn't work with unions, or with sub-types like .extend, .omit and so on.
 *
 * So we slap this refinement on the end of each schema.
 *
 * It's hacky and dumb but it's what we have to do, Zod is aware of this issue and says it's a limitation.
 *
 * Right now (1.22.25) we have a limited number of refinements needed. If we need more we may need to revisit this.
 *
 * For more info on this issue with a response from the Zod developers, see: https://github.com/colinhacks/zod/issues/454
 *
 * @param vehicleData a Vehicle
 * @returns boolean
 */
// @ts-expect-error vehicleData is untyped because the type Vehicle hasn't been created yet
export const refineZodVehicleValidation = (vehicleData) => {
	let isVehicleValid = true;
	let error = "";

	const milesBoughtAt = vehicleData.purchaseAndSales.milesBoughtAt;
	const willSellCarAtMiles = vehicleData.purchaseAndSales.willSellCarAtMiles;

	// Right now this is the only refinement we need.
	if (milesBoughtAt > willSellCarAtMiles) {
		isVehicleValid = false;

		error = "milesBoughtAt must be less than or equal to willSellCarAtMiles";
	}

	return { isVehicleValid, error };
};

/**Always has "type": "gas" and electricVehicleData: null */
type GasVehicle = z.infer<typeof GasVehicleSchema>;
/**Always has "type": "electric" and gasVehicleData: null */
type ElectricVehicle = z.infer<typeof ElectricVehicleSchema>;

// For testing, delete later
const bob: Vehicle = {
	type: "gas",
	electricVehicleData: null,
	gasVehicleData: {
		vehicleID: 1,
		gasCostPerGallon: 3.5,
		milesPerGallonHighway: 35,
		milesPerGallonCity: 25,
	},
	id: 1,
	userid: 1,
	vehiclesOrder: 1,
	vehicleData: {
		vehicleID: 1,
		vehicleName: "Test Vehicle",
		year: null,
		make: null,
		model: null,
		trim: null,
		highwayMPG: null,
	},
	purchaseAndSales: {
		vehicleID: 1,
		yearPurchased: null,
		purchasePrice: 10000,
		downPaymentAmount: null,
		willSellCarAfterYears: 5,
		milesBoughtAt: 10000,
		willSellCarAtMiles: 50000,
		willSellCarAtPrice: 5000,
	},
	usage: {
		vehicleID: 1,
		averageDailyMiles: 30,
		weeksPerYear: 52,
		percentHighway: 50,
		extraDistanceMiles: null,
		extraDistancePercentHighway: null,
	},
	fixedCosts: {
		vehicleID: 1,
		yearlyInsuranceCost: null,
		yearlyRegistrationCost: null,
		yearlyTaxes: null,
		// Deprecated, there's a TODO to delete this
		yearlyParkingCost: undefined,
		monthlyLoanPayment: null,
		monthlyWarrantyCost: null,
		inspectionCost: null,
		otherYearlyCosts: null,
	},
	yearlyMaintenanceCosts: {
		vehicleID: 1,
		oilChanges: null,
		tires: null,
		batteries: null,
		brakes: null,
		other: null,
		depreciation: null,
	},
	variableCosts: {
		vehicleID: 1,
		monthlyParkingCosts: null,
		monthlyTolls: null,
		monthlyCarWashCost: null,
		monthlyMiscellaneousCosts: null,
		monthlyCostDeductions: null,
	},
};

// refineZodVehicleValidation returns {isVehicleValid: boolean, error: string}; rewrite this .refine to get that and .describe the text of the error
