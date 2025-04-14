// README
// This is (obviously) Vehicle types for PATCH requests
// Specifically, it shapes the Vehicle you have to send in to be edited in the db
// Most fields are optional here. So only the sub-objects (gasVehicleData, fixedCosts etc) that you actually include will be updated in the db.
// Because of Zod limitations I can't extend a union type, so I have to make two definitions for Gas and Electric vehicles then make a union of them
// I'm going to regret this when it comes time for refactoring
// NOTE: These aren't deep Partials; if one item of a field is included they all should be. This is to keep up with validation done with one field against another, like making sure purchaseAndSales.milesBoughtAt is less than purchaseAndSales.willSellCarAtMiles

import { z } from "zod";
import {
	DeepReadonly,
	ElectricVehicleSchema,
	GasVehicleSchema,
	HybridVehicleSchema,
} from "./GetVehicleTypes";
import {
	ElectricVehicleDataSchema,
	FixedCostsSchema,
	GasVehicleDataSchema,
	HybridVehicleDataSchema,
	PurchaseAndSalesSchema,
	UsageSchema,
	VariableCostsSchema,
	VehicleDataSchema,
	YearlyMaintenanceCostsSchema,
} from "../../../../zod/schemas/VehicleSubSchemas";

// Really dumb that I have to do this three times then make a union of this and ElectricVehicleSchemaForPATCH
export const GasVehicleSchemaForPATCH = GasVehicleSchema.extend({
	// Other fields won't be changed, like userid and id
	type: z.literal("gas"),
	vehicleData: VehicleDataSchema.optional(),
	gasVehicleData: GasVehicleDataSchema.optional(),
	purchaseAndSales: PurchaseAndSalesSchema.optional(),
	usage: UsageSchema.optional(),
	fixedCosts: FixedCostsSchema.optional(),
	yearlyMaintenanceCosts: YearlyMaintenanceCostsSchema.optional(),
	variableCosts: VariableCostsSchema.optional(),
});

// Really dumb that I have to do this three times then make a union of this and GasVehicleSchemaForPATCH
export const ElectricVehicleSchemaForPATCH = ElectricVehicleSchema.extend({
	// Other fields won't be changed, like userid and id
	type: z.literal("electric"),
	vehicleData: VehicleDataSchema.optional(),
	electricVehicleData: ElectricVehicleDataSchema.optional(),
	purchaseAndSales: PurchaseAndSalesSchema.innerType().optional(),
	usage: UsageSchema.optional(),
	fixedCosts: FixedCostsSchema.optional(),
	yearlyMaintenanceCosts: YearlyMaintenanceCostsSchema.optional(),
	variableCosts: VariableCostsSchema.optional(),
});

export const HybridVehicleSchemaForPATCH = HybridVehicleSchema.extend({
	// Other fields won't be changed, like userid and id
	type: z.literal("hybrid"),
	vehicleData: VehicleDataSchema.optional(),
	hybridVehicleData: HybridVehicleDataSchema.optional(),
	purchaseAndSales: PurchaseAndSalesSchema.innerType().optional(),
	usage: UsageSchema.optional(),
	fixedCosts: FixedCostsSchema.optional(),
	yearlyMaintenanceCosts: YearlyMaintenanceCostsSchema.optional(),
	variableCosts: VariableCostsSchema.optional(),
});

//

/** Use for validating Vehicles being sent in PATCH requests
 *
 * All sub-fields are optional; if a field isn't included, it won't be updated in the db
 */
export const VehicleSchemaForPATCH = z.discriminatedUnion("type", [
	GasVehicleSchemaForPATCH,
	ElectricVehicleSchemaForPATCH,
	HybridVehicleSchemaForPATCH,
]);

/**
 * This is the type of a Vehicle being sent in a PATCH request
 * All sub-fields are optional; if a field isn't included, it won't be updated in the db
 *
 * All fields and sub-objects are readonly because I don't currently have a reason to change them; can update later if needed
 */
export type Vehicle_For_db_PATCH = DeepReadonly<
	z.infer<typeof VehicleSchemaForPATCH>
>;
