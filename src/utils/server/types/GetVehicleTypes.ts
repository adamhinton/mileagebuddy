/* eslint-disable @typescript-eslint/no-unused-vars */
import { createClient, QueryData, SupabaseClient } from "@supabase/supabase-js";
import { createClientSSROnly } from "../../../../supabaseUtilsCustom/server";
import {
	getSingleVehicleByIdQuery,
	getVehiclesByUserIdQuery,
} from "../queries/GetVehiclesQueries";

const supabase = await createClientSSROnly();

const exampleGetVehiclesByUserQuery = getVehiclesByUserIdQuery("1");

export type VehiclesArrayReturnedFromDB = QueryData<
	typeof exampleGetVehiclesByUserQuery
>;

const exampleGetSingleVehicleByIDQuery = getSingleVehicleByIdQuery(1);

export type SingleVehicleFromDB = QueryData<
	typeof exampleGetSingleVehicleByIDQuery
>;

// const bob = {} as VehiclesReturnedFromDB;

// bob[0].vehicledata?.highwaympg;
