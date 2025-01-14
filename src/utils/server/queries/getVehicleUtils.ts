// README:
// This is, obviously, helper functions to for GET /api/vehicles
// As opposed to GetVehiclesQueries.ts in the same folder, which contains the strings of the db queries for GET

import { SupabaseClient } from "@supabase/supabase-js";
import { Vehicles } from "../types/GetVehicleTypes";
import {
	getSingleVehicleByIdQuery,
	getVehiclesByUserIdQuery,
} from "./GetVehiclesQueries";

/**Looks up vehicle by id, assembles the data from the multiple sub-tables, and returns an array with just that vehicle*/
export async function getSingleVehicleById(
	supabase: SupabaseClient,
	vehicleId: number
): Promise<Vehicles> {
	/**Vehicle data is stored in several different tables
	 * This fetches data from each relevant table and joins it
	 */

	const vehicleInfoQuery = getSingleVehicleByIdQuery(vehicleId);

	const { data, error } = await vehicleInfoQuery;

	if (error) {
		throw new Error("Error fetching vehicle data in TEST: " + error.message);
	}

	const vehicles: Vehicles = data;

	vehicles.map((vehicle, i) => {
		console.log("vehicles[i]:", vehicles[i]);
	});
	console.log("error from test await vehicleInfoQuery:", error);

	// Not sure why this thinks vehicleData is an empty object, works fine on frontend
	// I'm sure I'll regret this when it crashes and breaks everything
	return vehicles;
}

/** Get all vehicles belonging to a user */
export async function getVehiclesByUser(
	supabase: SupabaseClient,
	userId: number
): Promise<Vehicles> {
	/** This is just the data from the vehicles table
	 * There are several db tables that contain user data. Still need to aggregate all of them
	 */
	const vehiclesDataQuery = getVehiclesByUserIdQuery(String(userId));
	const { data, error } = await vehiclesDataQuery;

	if (error) {
		throw new Error("Error fetching vehicle data in TEST: " + error.message);
	}

	return data;
}
