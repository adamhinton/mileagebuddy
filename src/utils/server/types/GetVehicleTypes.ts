/* eslint-disable @typescript-eslint/no-unused-vars */
import { createClient, QueryData, SupabaseClient } from "@supabase/supabase-js";
import { createClientSSROnly } from "../../../../supabaseUtilsCustom/server";
import {
	getSingleVehicleByIdQuery,
	getVehiclesByUserIdQuery,
} from "../queries/GetVehiclesQueries";

const supabase = await createClientSSROnly();

const exampleGetVehiclesByUserQuery = getVehiclesByUserIdQuery("1");

/**This is the same when getting one vehicle by id or multiple by user,
 * because it always returns an array of vehicles -- even with length 1.
 */
export type VehiclesArrayReturnedFromDB = QueryData<
	typeof exampleGetVehiclesByUserQuery
>;
