// README
// User will input this data and the program will calculate what that vehicle ccosts to operate per mile
// will also calculate the cost per additional mile driven
// requires the user to approximate some things (such as what they'll sell it for and when, and maintenance costs) but this is supposed to give ballpark estimates, it's not an exact science

// ADD TO TABLE:
// createdAT
// updatedAt
// deletedAt

import { z } from "zod";

export const VehicleSchema = z.object({
	id: z.string(),
	userID: z.string(),
	type: z.union([z.literal("gas"), z.literal("electric")]),

	vehicleData: z.object({
		vehicleName: z.string(),
		year: z.number().nullable().optional(),
		make: z.string().nullable().optional(),
		model: z.string().nullable().optional(),
		trim: z.string().optional(),
		highwayMPG: z.number().positive(),
	}),

	gasVehicleData: z.object({
		gasCostPerGallon: z.number().nonnegative(),
		milesPerGallonHighway: z.number().positive(),
		milesPerGallonCity: z.number().positive(),
	}),

	electricVehicleData: z.object({
		batteryType: z.string(),
		// cost per charge and miles per charge will help calculate fuel cost per mile
		// Could include a lot more complex stuff like battery size, cost per KWH, etc etc but this seems simpler
		// costPerCharge divided by milesPerCharge
		costPerCharge: z.number().nonnegative(),
		milesPerCharge: z.number().nonnegative(),
	}),

	purchaseAndSales: z.object({
		yearPurchased: z.number().nonnegative().optional(),
		purchasePrice: z.number(),
		downPaymentAmount: z.number().nonnegative().optional(),
		/**How many years until the car is sold */
		willSellCarAfterYears: z.number(),
		// must be lower than willSellCarAtMiles
		milesBoughtAt: z.number().nonnegative(),
		// must be higher than milesBoughtAt
		willSellCarAtMiles: z.number().nonnegative(),
		willSellCarAtPrice: z.number(),
	}),

	usage: z.object({
		averageDailyMiles: z.number(),
		weeksPerYear: z.number(),
		percentHighway: z.number().min(0).max(100),
		extraDistanceMiles: z.number().nonnegative().optional(),
		extraDistancePercentHighway: z.number().min(0).max(100).optional(),
	}),

	/** About what price will you sell the car at */
	/**This will be hard to estimate. User can do their best. */
	fixedCosts: z
		.object({
			yearlyInsuranceCost: z.number().nonnegative(),
			yearlyRegistrationCost: z.number().nonnegative(),
			yearlyTaxes: z.number().nonnegative(),
			monthlyPayments: z.number().nonnegative(),
			monthlyWarrantyCost: z.number().nonnegative(),
			inspectionCost: z.number().nonnegative(),
			otherYearlyCosts: z.number().nonnegative(),
		})
		// everything in fixedCosts is optional
		.partial(),
	yearlyMaintenanceCosts: z
		.object({
			oilChanges: z.number().nonnegative(),
			tires: z.number().nonnegative(),
			batteries: z.number().nonnegative(),
			brakes: z.number().nonnegative(),
			other: z.number().nonnegative(),
			depreciation: z.number().nonnegative(),
		})
		// everything in yearlyMaintenanceCosts is optional
		.partial(),
	variableCosts: z
		.object({
			monthlyParkingCosts: z.number().nonnegative(),
			monthlyTolls: z.number().nonnegative(),
			monthlyCarWashCost: z.number().nonnegative(),
			monthlyMiscellaneousCosts: z.number().nonnegative(),
			/**Anything you get reimbursed for etc. These reduce your costs */
			monthlyCostDeductions: z.number().nonnegative(),
		})
		// everything in variableCosts is optional
		.partial(),
});

export type Vehicle = z.infer<typeof VehicleSchema>;
