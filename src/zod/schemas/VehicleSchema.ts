import { z } from "zod";

export const VehicleSchema = z.object({
	vehicleName: z.string(),
	year: z.number(),
	make: z.string(),
	model: z.string(),
	gasCostPerGallon: z.number(),
	milesPerGallon: z.number(),
	yearlyMaintenanceCost: z.number(),
	yearlyInsuranceCost: z.number(),
	yearlyRegistrationCost: z.number(),
	yearlyTaxes: z.number(),
	yearlyDepreciation: z.number(),
	monthlyPayments: z.number(),
	monthlyParkingCosts: z.number(),
	monthlyTolls: z.number(),
	monthlyCarWashes: z.number(),
	miscellaneousMonthlyCosts: z.number(),
});

export type Vehicle = z.infer<typeof VehicleSchema>;
