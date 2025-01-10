import { z } from "zod";

// TODO: Account for electric

export const VehicleSchema = z.object({
	vehicleName: z.string(),
	year: z.number().nullable(),
	make: z.string().nullable(),
	model: z.string().nullable(),
	purchasePrice: z.number(),
	typicalUse: z.object({
		averageDailyMiles: z.number(),
		weeksPerYear: z.number(),
		percentHighway: z.number().min(0).max(100),
	}),
	additionalUse: z.object({
		distanceMiles: z.number().nonnegative(),
	}),
	milesPerGallon: z.object({
		highwayMPG: z.number().positive(),
		cityMPG: z.number().positive(),
	}),
	/**How many years until the car is sold */
	willSellCarAfterYears: z.number(),
	/** About what price will you sell the car at */
	willSellCarAtPrice: z.number(),
	fixedCosts: z.object({
		yearlyInsuranceCost: z.number().nonnegative(),
		yearlyRegistrationCost: z.number().nonnegative(),
		yearlyTaxes: z.number().nonnegative(),
		monthlyPayments: z.number().nonnegative(),
		monthlyWarrantyCost: z.number().nonnegative(),
	}),
	yearlyMaintenanceCost: z.number().nonnegative(),
	yearlyDepreciation: z.number(),
	monthlyParkingCosts: z.number().nonnegative(),
	monthlyTolls: z.number().nonnegative(),
	monthlyCarWashCost: z.number().nonnegative(),
	monthlyMiscellaneousCosts: z.number().nonnegative(),
	downPaymentAmount: z.number().nonnegative(),
	// trim: z.string(),
	/**Anything you get reimbursed for etc. These reduce your costs */
	monthlyCostDeductions: z.number().nonnegative(),
});

export type Vehicle = z.infer<typeof VehicleSchema>;
