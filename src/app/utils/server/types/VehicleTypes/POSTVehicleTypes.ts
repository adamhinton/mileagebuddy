import z from "zod";

//README:
// This is the zod schemas and type definitions for all things to do with Vehicle POST requests to the db
// Specifically, types of Vehicles being POSTed
// A vehicle for db POST doesn't have vehicleIDs or IDs, because the db hasn't had the chance to assign those ids yet
// it does still have a userid

import {
	DeepReadonly,
	ElectricVehicleSchema,
	GasVehicleSchema,
	HybridVehicleSchema,
	refineZodVehicleValidation,
} from "./GetVehicleTypes";
import { boughtAtLessThanSoldAtError } from "@/app/zod/schemas/vehicles/VehicleSubSchemas";

/**
 * This doesn't have any ids anywhere because it's for a POST request
 *
 * So it wouldn't have been assigned an id or vehicleids yet by the db
 *
 * Use this type for POST requests!
 *
 * All fields and sub-objects are readonly because I don't currently have a reason to change them; can update later if needed
 */
export type Vehicle_For_db_POST = DeepReadonly<
	z.infer<typeof VehicleToBePostedSchema>
>;

// See notes above VehicleToBePostedSchema about why I had  to do this
export const GasVehicleSchemaForPOST = GasVehicleSchema.omit({
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
		.refine(
			(data) => {
				return data.milesBoughtAt <= data.willSellCarAtMiles;
			},
			{
				message: boughtAtLessThanSoldAtError,
				path: ["purchaseAndSales"],
			}
		)
		.describe("milesBoughtAt must be less than or equal to willSellCarAtMiles"),

	usage: GasVehicleSchema.shape.usage.omit({ vehicleID: true }),
});

export type Gas_Vehicle_For_DB_POST = z.infer<typeof GasVehicleSchemaForPOST>;

// This is for VehicleToBePostedSchema
// See notes above VehicleToBePostedSchema about why I had  to do this
export const ElectricVehicleSchemaForPOST = ElectricVehicleSchema.omit({
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
		})
		.refine(
			(data) => {
				return data.milesBoughtAt <= data.willSellCarAtMiles;
			},
			{
				message: boughtAtLessThanSoldAtError,
				path: ["purchaseAndSales"],
			}
		),
	usage: ElectricVehicleSchema.shape.usage.omit({ vehicleID: true }),
});

export type Electric_Vehicle_For_DB_POST = z.infer<
	typeof ElectricVehicleSchemaForPOST
>;

// same thing with hybrid
export const HybridVehicleSchemaForPOST = HybridVehicleSchema.omit({
	id: true,
}).extend({
	vehicleData: HybridVehicleSchema.shape.vehicleData.omit({ vehicleID: true }),
	hybridVehicleData: HybridVehicleSchema.shape.hybridVehicleData.omit({
		vehicleID: true,
	}),
	fixedCosts: HybridVehicleSchema.shape.fixedCosts.omit({ vehicleID: true }),
	yearlyMaintenanceCosts: HybridVehicleSchema.shape.yearlyMaintenanceCosts.omit(
		{
			vehicleID: true,
		}
	),
	variableCosts: HybridVehicleSchema.shape.variableCosts.omit({
		vehicleID: true,
	}),
	// Need innerType here because it has a describe and refine block
	// Don't ask me why, that's what Google says
	purchaseAndSales: HybridVehicleSchema.shape.purchaseAndSales
		.innerType()
		.omit({
			vehicleID: true,
		})
		.refine(
			(data) => {
				return data.milesBoughtAt <= data.willSellCarAtMiles;
			},
			{
				message: boughtAtLessThanSoldAtError,
				path: ["purchaseAndSales"],
			}
		),
	usage: HybridVehicleSchema.shape.usage.omit({ vehicleID: true }),
});

export type Hybrid_Vehicle_For_DB_POST = z.infer<
	typeof HybridVehicleSchemaForPOST
>;

// Vehicle without any ids except userid, because it hasn't been sent to db yet
// This is for POST requests
// I wasn't sure how to make it only exclude vehicleIDs, this looks clunky but does the job
// Vehicle schema for POST requests
// NOTE: Since VehicleSchema is a union type, I can't just do VehicleSchema.omit
// So I have to do this sort of clunky solution, which is to make a union of the two types without ids
export const VehicleToBePostedSchema = z
	.discriminatedUnion("type", [
		GasVehicleSchemaForPOST,
		ElectricVehicleSchemaForPOST,
		HybridVehicleSchemaForPOST,
	])
	.refine(
		(data) => {
			const validation = refineZodVehicleValidation(data);
			return validation.isVehicleValid;
		},
		(data) => ({
			message: refineZodVehicleValidation(data).error,
		})
	);
