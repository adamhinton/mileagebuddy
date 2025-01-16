// NOTE: To get the type of sub-objects within Vehicles, do this:
// const fixedCosts: Vehicle["fixedCosts"] = ...

import { getVehiclesByUserIdQuery } from "../queries/GetVehiclesQueries";
import z from "zod";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const exampleGetVehiclesByUserQuery = getVehiclesByUserIdQuery("1");

/**This is the same when getting one vehicle by id or multiple by user,
 * because it always returns an array of vehicles -- even with length 1.
 */
export type Vehicles = z.infer<typeof VehicleSchema>[];

// type of single Vehicle
export type Vehicle = Vehicles[number];

export const VehicleSchema = z.object({
	id: z.number(),
	userid: z.number(),
	vehiclesOrder: z.number(),
	type: z.string(),

	vehicleData: z.object({
		vehicleID: z.number(),
		vehicleName: z.string(),
		year: z.number().nullable(),
		make: z.string().nullable(),
		model: z.string().nullable(),
		trim: z.string().nullable(),
		highwayMPG: z.number().nullable(),
	}),

	gasVehicleData: z
		.object({
			vehicleID: z.number(),
			gasCostPerGallon: z.number().positive().nullable(),
			milesPerGallonHighway: z.number().positive().nullable(),
			milesPerGallonCity: z.number().positive().nullable(),
		})
		.nullable(),

	electricVehicleData: z
		.object({
			vehicleID: z.number(),
			costPerCharge: z.number().positive().nullable(),
			milesPerCharge: z.number().positive().nullable(),
			electricRangeMiles: z.number().positive().nullable(),
		})
		.nullable(),

	purchaseAndSales: z.object({
		vehicleID: z.number(),
		yearPurchased: z.number().nullable(),
		purchasePrice: z.number().positive(),
		downPaymentAmount: z.number().positive().nullable(),
		willSellCarAfterYears: z.number().positive(),
		milesBoughtAt: z.number().positive(),
		willSellCarAtMiles: z.number().positive(),
		willSellCarAtPrice: z.number().positive(),
	}),

	usage: z.object({
		vehicleID: z.number(),
		averageDailyMiles: z.number().positive(),
		weeksPerYear: z.number().positive(),
		percentHighway: z.number().positive(),
		extraDistanceMiles: z.number().positive().nullable(),
		extraDistancePercentHighway: z.number().positive().nullable(),
	}),

	fixedCosts: z.object({
		vehicleID: z.number(),
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
		vehicleID: z.number(),
		oilChanges: z.number().positive().nullable(),
		tires: z.number().positive().nullable(),
		batteries: z.number().positive().nullable(),
		brakes: z.number().positive().nullable(),
		other: z.number().positive().nullable(),
		depreciation: z.number().positive().nullable(),
	}),

	variableCosts: z.object({
		vehicleID: z.number(),
		monthlyParkingCosts: z.number().positive().nullable(),
		monthlyTolls: z.number().positive().nullable(),
		monthlyCarWashCost: z.number().positive().nullable(),
		monthlyMiscellaneousCosts: z.number().positive().nullable(),
		monthlyCostDeductions: z.number().positive().nullable(),
	}),
});
