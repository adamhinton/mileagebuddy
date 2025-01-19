/* eslint-disable @typescript-eslint/no-unused-vars */
// NOTE: To get the type of sub-objects within Vehicles, do this:
// const fixedCosts: Vehicle["fixedCosts"] = ...

// README:
// Here we define types for Vehicle (obviously)
// We define the main VehicleSchema, then sub types for GasVehicle and ElectricVehicle
// Also a partial type for updating a vehicle with only the needed data (TODO)
// And a type without id's for creating a new vehicle (TODO), because the db hasn't assigned them id's yet

// GUIDE:
// Here are the types to use in different situations
// Vehicle you're GETTING from the DB: Vehicle
// Vehicle you're POSTING to the DB: Vehicle_For_db_POST
// Vehicle you're PATCHING to the DB: TODO, will write this soon

import { getVehiclesByUserIdQuery } from "../queries/GetVehiclesQueries";
import z from "zod";

const exampleGetVehiclesByUserQuery = getVehiclesByUserIdQuery("1");

/**This is the same when getting one vehicle by id or multiple by user,
 * because it always returns an array of vehicles -- even with length 1.
 */
export type Vehicles = Vehicle[];

/**IMPORTANT:
 *
 * This doesn't match what you expect?
 *
 * You have to manually update the zod Schema with any changes from the db.
 *
 * This schema is manually generated.
 *
 * This is the grandfather prototype of all Vehicles.
 *
 * Further types will be inferred from this.
 *
 * INFO:
 * This is broken down further in to GasVehicleSchema and ElectricVehicleSchema
 *
 * Then, the Vehicle type is a union of those two types.
 */
export const VehicleSchema = z.object({
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

const GasVehicleSchema = VehicleSchema.extend({
	type: z.literal("gas"),
	electricVehicleData: z
		.null()
		.describe("electricVehicleData must be null because this is a gas vehicle"),
});

const ElectricVehicleSchema = VehicleSchema.extend({
	type: z.literal("electric"),
	gasVehicleData: z
		.null()
		.describe(
			"gasVehicleData must be null because this is an electric vehicle"
		),
});

type GasVehicle = z.infer<typeof GasVehicleSchema>;
type ElectricVehicle = z.infer<typeof ElectricVehicleSchema>;

/**This will be either an electric vehicle or gas vehicle
 * depending on the type field.
 */
export type Vehicle = GasVehicle | ElectricVehicle;

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
export const VehicleToBePostedSchema = VehicleSchema.omit({ id: true }).extend({
	vehicleData: VehicleSchema.shape.vehicleData.omit({ vehicleID: true }),
	gasVehicleData: VehicleSchema.shape.gasVehicleData.omit({ vehicleID: true }),
	electricVehicleData: VehicleSchema.shape.electricVehicleData.omit({
		vehicleID: true,
	}),
	purchaseAndSales: VehicleSchema.shape.purchaseAndSales.omit({
		vehicleID: true,
	}),
	usage: VehicleSchema.shape.usage.omit({ vehicleID: true }),
	fixedCosts: VehicleSchema.shape.fixedCosts.omit({ vehicleID: true }),
	yearlyMaintenanceCosts: VehicleSchema.shape.yearlyMaintenanceCosts.omit({
		vehicleID: true,
	}),
	variableCosts: VehicleSchema.shape.variableCosts.omit({ vehicleID: true }),
});

/**
 * This doesn't have any ids anywhere because it's for a POST request
 *
 * So it wouldn't have been assigned an id or vehicleids yet by the db
 *
 * Use this type for POST requests!
 */
export type Vehicle_For_db_POST = z.infer<typeof VehicleToBePostedSchema>;
