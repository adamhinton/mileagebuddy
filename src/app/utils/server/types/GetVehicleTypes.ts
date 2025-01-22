/* eslint-disable @typescript-eslint/no-unused-vars */
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
// Vehicle you're GETTING from the DB: VehicleFromDB
// Vehicle you're POSTING to the DB: Vehicle_For_db_POST
// Vehicle you're PATCHING to the DB: TODO, will write this soon

import z from "zod";

/**This will be either an ElectricVehicle type or GasVehicle type
 * depending on the "type" field ("type": "gas" or "type":  "electric").
 * This matches what you will receive from a GET request to the db.
 * There are other types for vehicles you haven't POSTed yet, or PATCH vehicles.
 */
export type Vehicle = z.infer<typeof NewVehicleSchema>;

/**This is the same when getting one vehicle by id or multiple by user,
 * because it always returns an array of vehicles -- even with length 1.
 */
export type Vehicles = Vehicle[];

// This caused problems because under the hood it creates a supabase client in the global scope, which isn't allowed. You have to make it in a function. I decided to just define the type myself.
// // This get the supabase-generated type of a vehicle returned from DB
// const exampleGetVehiclesByUserQuery = getVehiclesByUserIdQuery("1");
// /**This is what the Vehicles returned from the DB will look like */
// type VehiclesArrayFromDB = QueryData<typeof exampleGetVehiclesByUserQuery>;
// /**This is what a single Vehicle returned from the DB will look like */
// export type VehicleFromDB = VehiclesArrayFromDB[number];

/**
 * This doesn't have any ids anywhere because it's for a POST request
 *
 * So it wouldn't have been assigned an id or vehicleids yet by the db
 *
 * Use this type for POST requests!
 */
export type Vehicle_For_db_POST = z.infer<typeof VehicleToBePostedSchema>;

/**IMPORTANT:
 *
 * This doesn't match what you expect?
 *
 * You have to manually update the zod Schema with any new changes to your db schema.
 *
 * This schema is manually generated.
 *
 * This is the grandfather prototype of all Vehicles.
 *
 * Further types will be inferred from this.
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
 */
export const BaseVehicleSchema = z.object({
	id: z.number().readonly(),
	userid: z.number().readonly(),
	vehiclesOrder: z.number().positive(),
	type: z.enum(["gas", "electric"]),

	vehicleData: z.object({
		vehicleID: z.number().readonly(),
		vehicleName: z.string().min(1).max(30),
		year: z.number().min(1875).max(2100).nullable(),
		make: z.string().min(1).max(30).nullable(),
		model: z.string().min(1).max(30).nullable(),
		trim: z.string().min(1).max(30).nullable(),
		highwayMPG: z.number().positive().nullable(),
	}),

	gasVehicleData: z.object({
		vehicleID: z.number().readonly(),
		gasCostPerGallon: z.number().max(1000).positive().nullable(),
		milesPerGallonHighway: z.number().positive().nullable(),
		milesPerGallonCity: z.number().positive().nullable(),
	}),
	electricVehicleData: z.object({
		vehicleID: z.number().readonly(),
		costPerCharge: z.number().positive().nullable(),
		milesPerCharge: z.number().positive().nullable(),
		electricRangeMiles: z.number().positive().nullable(),
	}),
	purchaseAndSales: z
		.object({
			vehicleID: z.number().readonly(),
			yearPurchased: z.number().positive().nullable(),
			purchasePrice: z.number().positive(),
			downPaymentAmount: z.number().positive().nullable(),
			willSellCarAfterYears: z.number().positive(),
			milesBoughtAt: z.number().positive(),
			willSellCarAtMiles: z.number().positive(),
			willSellCarAtPrice: z.number().positive(),
		})
		.refine((data) => data.milesBoughtAt <= data.willSellCarAtMiles)
		.describe("milesBoughtAt must be less than or equal to willSellCarAtMiles"),

	usage: z.object({
		vehicleID: z.number().readonly(),
		averageDailyMiles: z.number().nonnegative(),
		weeksPerYear: z.number().nonnegative(),
		percentHighway: z.number().positive().max(100),
		extraDistanceMiles: z.number().nonnegative().nullable(),
		extraDistancePercentHighway: z.number().positive().max(100).nullable(),
	}),

	fixedCosts: z.object({
		vehicleID: z.number().readonly(),
		yearlyInsuranceCost: z.number().positive().nullable(),
		yearlyRegistrationCost: z.number().positive().nullable(),
		yearlyTaxes: z.number().positive().nullable(),
		yearlyParkingCost: z.number().positive().nullable(),
		monthlyLoanPayment: z.number().positive().nullable(),
		monthlyWarrantyCost: z.number().positive().nullable(),
		inspectionCost: z.number().positive().nullable(),
		otherYearlyCosts: z.number().positive().nullable(),
	}),

	yearlyMaintenanceCosts: z.object({
		vehicleID: z.number().readonly(),
		oilChanges: z.number().positive().nullable(),
		tires: z.number().positive().nullable(),
		batteries: z.number().positive().nullable(),
		brakes: z.number().positive().nullable(),
		other: z.number().positive().nullable(),
		depreciation: z.number().positive().nullable(),
	}),

	variableCosts: z.object({
		vehicleID: z.number().readonly(),
		monthlyParkingCosts: z.number().positive().nullable(),
		monthlyTolls: z.number().positive().nullable(),
		monthlyCarWashCost: z.number().positive().nullable(),
		monthlyMiscellaneousCosts: z.number().positive().nullable(),
		monthlyCostDeductions: z.number().positive().nullable(),
	}),
});

const GasVehicleSchema = BaseVehicleSchema.extend({
	type: z.literal("gas"),
	electricVehicleData: z
		.null()
		.describe("electricVehicleData must be null because this is a gas vehicle"),
});

const ElectricVehicleSchema = BaseVehicleSchema.extend({
	type: z.literal("electric"),
	gasVehicleData: z
		.null()
		.describe(
			"gasVehicleData must be null because this is an electric vehicle"
		),
});

const NewVehicleSchema = z.union([GasVehicleSchema, ElectricVehicleSchema]);

/**Always has "type": "gas" and electricVehicleData: null */
type GasVehicle = z.infer<typeof GasVehicleSchema>;
/**Always has "type": "electric" and gasVehicleData: null */
type ElectricVehicle = z.infer<typeof ElectricVehicleSchema>;

const bob: Vehicle = {
	type: "gas",
	electricVehicleData: null,
	gasVehicleData: {
		vehicleID: 1,
		gasCostPerGallon: null,
		milesPerGallonHighway: null,
		milesPerGallonCity: null,
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
		yearlyParkingCost: null,
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

// Vehicle without any ids except userid, because it hasn't been sent to db yet
// This is for POST requests
// I wasn't sure how to make it only exclude vehicleIDs, this looks clunky but does the job
export const VehicleToBePostedSchema = NewVehicleSchema.omit({
	id: true,
}).extend({
	vehicleData: BaseVehicleSchema.shape.vehicleData.omit({ vehicleID: true }),
	gasVehicleData: BaseVehicleSchema.shape.gasVehicleData.omit({
		vehicleID: true,
	}),
	electricVehicleData: BaseVehicleSchema.shape.electricVehicleData.omit({
		vehicleID: true,
	}),
	// Using innerType() because it has a refine and describe method used
	// Not sure why this is necessary, something about extreacting the underlying schema
	purchaseAndSales: BaseVehicleSchema.shape.purchaseAndSales.innerType().omit({
		vehicleID: true,
	}),
	usage: BaseVehicleSchema.shape.usage.omit({ vehicleID: true }),
	fixedCosts: BaseVehicleSchema.shape.fixedCosts.omit({ vehicleID: true }),
	yearlyMaintenanceCosts: BaseVehicleSchema.shape.yearlyMaintenanceCosts.omit({
		vehicleID: true,
	}),
	variableCosts: BaseVehicleSchema.shape.variableCosts.omit({
		vehicleID: true,
	}),
});
