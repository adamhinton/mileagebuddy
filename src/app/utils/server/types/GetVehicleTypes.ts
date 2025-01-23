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
export const BaseVehicleSchema = z
	.object({
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
			highwayMPG: z.number().max(5000).nonnegative().nullable(),
		}),

		gasVehicleData: z.object({
			vehicleID: z.number().readonly(),
			gasCostPerGallon: z.number().max(1000).nonnegative().nullable(),
			milesPerGallonHighway: z.number().max(1000).nonnegative().nullable(),
			milesPerGallonCity: z.number().max(1000).nonnegative().nullable(),
		}),
		electricVehicleData: z.object({
			vehicleID: z.number().readonly(),
			costPerCharge: z
				.number()
				.nonnegative()
				.max(1000)
				.nonnegative()
				.nullable(),
			milesPerCharge: z.number().max(10_000).nullable(),
			electricRangeMiles: z.number().max(10_000).nonnegative().nullable(),
		}),
		purchaseAndSales: z
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
			.describe(
				"milesBoughtAt must be less than or equal to willSellCarAtMiles"
			),

		usage: z.object({
			vehicleID: z.number().readonly(),
			averageDailyMiles: z.number().max(5_000).nonnegative(),
			weeksPerYear: z.number().nonnegative().max(52),
			percentHighway: z.number().nonnegative().max(100),
			extraDistanceMiles: z.number().nonnegative().max(500_000).nullable(),
			extraDistancePercentHighway: z.number().nonnegative().max(100).nullable(),
		}),

		fixedCosts: z.object({
			vehicleID: z.number().readonly(),
			yearlyInsuranceCost: z.number().nonnegative().max(500_000).nullable(),
			yearlyRegistrationCost: z.number().nonnegative().max(50_000).nullable(),
			yearlyTaxes: z.number().nonnegative().max(50_000_000).nullable(),
			yearlyParkingCost: z.number().nonnegative().max(50_000).nullable(),
			monthlyLoanPayment: z.number().max(50_000).nonnegative().nullable(),
			monthlyWarrantyCost: z.number().max(50_000).nonnegative().nullable(),
			inspectionCost: z.number().max(5_000).nonnegative().nullable(),
			otherYearlyCosts: z.number().max(500_000).nonnegative().nullable(),
		}),

		yearlyMaintenanceCosts: z.object({
			vehicleID: z.number().readonly(),
			oilChanges: z.number().nonnegative().max(1_000).nullable(),
			tires: z.number().nonnegative().max(50_000).nullable(),
			batteries: z.number().nonnegative().max(50_000).nullable(),
			brakes: z.number().nonnegative().max(50_000).nullable(),
			other: z.number().nonnegative().max(500_000).nullable(),
			depreciation: z.number().nonnegative().max(500_000).nullable(),
		}),

		variableCosts: z.object({
			vehicleID: z.number().readonly(),
			monthlyParkingCosts: z.number().max(5_000).nonnegative().nullable(),
			monthlyTolls: z.number().max(5_000).nonnegative().nullable(),
			monthlyCarWashCost: z.number().max(5_000).nonnegative().nullable(),
			monthlyMiscellaneousCosts: z
				.number()
				.max(500_000)
				.nonnegative()
				.nullable(),
			monthlyCostDeductions: z.number().max(500_000).nonnegative().nullable(),
		}),
	})
	.refine((data) => {
		return refineZodVehicleValidation(data);
	});

const GasVehicleSchema = BaseVehicleSchema.innerType().extend({
	type: z.literal("gas"),
	electricVehicleData: z
		.null()
		.describe("electricVehicleData must be null because this is a gas vehicle"),
});

const ElectricVehicleSchema = BaseVehicleSchema.innerType().extend({
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
const VehicleSchema = z.union([GasVehicleSchema, ElectricVehicleSchema]);

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
const refineZodVehicleValidation = (vehicleData) => {
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

// This is for VehicleToBePostedSchema
// // See notes above VehicleToBePostedSchema about why I had  to do this
const GasVehicleSchemaForPOST = GasVehicleSchema.omit({
	id: true,
}).extend({
	vehicleData: GasVehicleSchema.shape.vehicleData.omit({ vehicleID: true }),
	gasVehicleData: GasVehicleSchema.shape.gasVehicleData.omit({
		vehicleID: true,
	}),
	fixedCosts: GasVehicleSchema.shape.fixedCosts.omit({ vehicleID: true }),
	yearlyMaintenanceCosts: GasVehicleSchema.shape.yearlyMaintenanceCosts.omit({
		vehicleID: true,
	}),
	variableCosts: GasVehicleSchema.shape.variableCosts.omit({ vehicleID: true }),
	// Need innerType here because it has a describe and refine block
	// Don't ask me why, that's what Google says
	// Also have to add .refine again because .refine doesn't get passed down to extended schemas
	// Which is really stupid and I'm definitely going to forget this when I extend this again
	purchaseAndSales: GasVehicleSchema.shape.purchaseAndSales
		.innerType()
		.omit({
			vehicleID: true,
		})
		.refine((data) => {
			return data.milesBoughtAt <= data.willSellCarAtMiles;
		})
		.describe("milesBoughtAt must be less than or equal to willSellCarAtMiles"),

	usage: GasVehicleSchema.shape.usage.omit({ vehicleID: true }),
});

// This is for VehicleToBePostedSchema
// See notes above VehicleToBePostedSchema about why I had  to do this
const ElectricVehicleSchemaForPOST = ElectricVehicleSchema.omit({
	id: true,
}).extend({
	vehicleData: ElectricVehicleSchema.shape.vehicleData.omit({
		vehicleID: true,
	}),

	electricVehicleData: ElectricVehicleSchema.shape.electricVehicleData.omit({
		vehicleID: true,
	}),
	fixedCosts: ElectricVehicleSchema.shape.fixedCosts.omit({ vehicleID: true }),
	yearlyMaintenanceCosts:
		ElectricVehicleSchema.shape.yearlyMaintenanceCosts.omit({
			vehicleID: true,
		}),
	variableCosts: ElectricVehicleSchema.shape.variableCosts.omit({
		vehicleID: true,
	}),
	// Need innerType here because it has a describe and refine block
	// Don't ask me why, that's what Google says
	purchaseAndSales: ElectricVehicleSchema.shape.purchaseAndSales
		.innerType()
		.omit({
			vehicleID: true,
		}),
	usage: ElectricVehicleSchema.shape.usage.omit({ vehicleID: true }),
});

// Vehicle without any ids except userid, because it hasn't been sent to db yet
// This is for POST requests
// I wasn't sure how to make it only exclude vehicleIDs, this looks clunky but does the job
// Vehicle schema for POST requests
// NOTE: Since VehicleSchema is a union type, I can't just do VehicleSchema.omit
// So I have to do this sort of clunky solution, which is to make a union of the two types without ids
// TODO: Try to find a better way than this
export const VehicleToBePostedSchema = z
	.union([GasVehicleSchemaForPOST, ElectricVehicleSchemaForPOST])
	.refine(
		(data) => {
			const validation = refineZodVehicleValidation(data);
			return validation.isVehicleValid;
		},
		(data) => ({
			message: refineZodVehicleValidation(data).error,
		})
	);
// refineZodVehicleValidation returns {isVehicleValid: boolean, error: string}; rewrite this .refine to get that and .describe the text of the error
