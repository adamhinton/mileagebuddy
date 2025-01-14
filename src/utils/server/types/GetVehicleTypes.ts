/* eslint-disable @typescript-eslint/no-unused-vars */
import { createClient, QueryData, SupabaseClient } from "@supabase/supabase-js";
import { createClientSSROnly } from "../../../../supabaseUtilsCustom/server";
import {
	getSingleVehicleByIdQuery,
	getVehiclesByUserIdQuery,
} from "../queries/GetVehiclesQueries";

const exampleGetVehiclesByUserQuery = getVehiclesByUserIdQuery("1");

/**This is the same when getting one vehicle by id or multiple by user,
 * because it always returns an array of vehicles -- even with length 1.
 */
export type Vehicles = QueryData<typeof exampleGetVehiclesByUserQuery>;

// type of single Vehicle
export type Vehicle = Vehicles[number];

// Each of these is a sub-object within Vehicle
// Each also represents a table in the db
/**A sub-object within Vehicle type */
export type VehicleData = Vehicle["vehicleData"];
/**A sub-object within Vehicle type */
export type GasVehicleData = Vehicle["gasVehicleData"];
/**A sub-object within Vehicle type */
export type ElectricVehicleData = Vehicle["electricVehicleData"];
/**A sub-object within Vehicle type */
export type PurchaseAndSales = Vehicle["purchaseAndSales"];
/**A sub-object within Vehicle type */
export type Usage = Vehicle["usage"];
/**A sub-object within Vehicle type */
export type FixedCosts = Vehicle["fixedCosts"];
/**A sub-object within Vehicle type */
export type yearlyMaintenanceCosts = Vehicle["yearlyMaintenanceCosts"];
/**A sub-object within Vehicle type */

export type VariableCosts = Vehicle["variableCosts"];
