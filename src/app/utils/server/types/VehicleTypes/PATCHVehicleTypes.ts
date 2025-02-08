// README
// This is (obviously) Vehicle types for PATCH requests
// Specifically, it shapes the Vehicle you have to send in to be edited in the db
// Most fields are optional here. So only the sub-objects (gasVehicleData, fixedCosts etc) that you actually include will be updated in the db.
// Because of Zod limitations I can't extend a union type, so I have to make two definitions for Gas and Electric vehicles then make a union of them
// I'm going to regret this when it comes time for refactoring
// NOTE: These aren't deep Partials; if one item of a field is included they all should be. This is to keep up with validation done with one field against another, like making sure milesBoughtAt is less than willSellCarAtMiles

import { z } from "zod";
import {
	DeepReadonly,
	ElectricVehicleSchema,
	GasVehicleSchema,
} from "./GetVehicleTypes";
import {
	ElectricVehicleDataSchema,
	FixedCostsSchema,
	GasVehicleDataSchema,
	PurchaseAndSalesSchema,
	UsageSchema,
	VariableCostsSchema,
	VehicleDataSchema,
	YearlyMaintenanceCostsSchema,
} from "../../../../zod/schemas/VehicleSubSchemas";

// Really dumb that I have to do this twice then make a union of this and ElectricVehicleSchemaForPATCH
export const GasVehicleSchemaForPATCH = GasVehicleSchema.extend({
	// Other fields won't be changed, like userid and id
	vehiclesOrder: z.number().optional(),
	type: z.enum(["gas"]).optional(),
	vehicleData: VehicleDataSchema.optional(),
	gasVehicleData: GasVehicleDataSchema.optional(),
	// This will always be null anyway
	electricVehicleData: ElectricVehicleDataSchema.optional(),
	purchaseAndSales: PurchaseAndSalesSchema.optional(),
	usage: UsageSchema.optional(),
	fixedCosts: FixedCostsSchema.optional(),
	yearlyMaintenanceCosts: YearlyMaintenanceCostsSchema.optional(),
	variableCosts: VariableCostsSchema.optional(),
});

// Really dumb that I have to do this twice then make a union of this and GasVehicleSchemaForPATCH
export const ElectricVehicleSchemaForPATCH = ElectricVehicleSchema.extend({
	// Other fields won't be changed, like userid and id
	vehiclesOrder: z.number().optional(),
	type: z.enum(["electric"]).optional(),
	vehicleData: VehicleDataSchema.optional(),
	// This will always be null anyway
	gasVehicleData: GasVehicleDataSchema.optional(),
	electricVehicleData: ElectricVehicleDataSchema.optional(),
	purchaseAndSales: PurchaseAndSalesSchema.innerType().optional(),
	usage: UsageSchema.optional(),
	fixedCosts: FixedCostsSchema.optional(),
	yearlyMaintenanceCosts: YearlyMaintenanceCostsSchema.optional(),
	variableCosts: VariableCostsSchema.optional(),
});

/** Use for validating Vehicles being sent in PATCH requests
 *
 * All sub-fields are optional; if a field isn't included, it won't be updated in the db
 */
export const VehicleSchemaForPATCH = z.union([
	GasVehicleSchemaForPATCH,
	ElectricVehicleSchemaForPATCH,
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
