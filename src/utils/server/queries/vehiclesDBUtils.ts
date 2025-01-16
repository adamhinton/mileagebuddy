// README:
// This is, obviously, helper functions to for GET /api/vehicles
// As opposed to GetVehiclesQueries.ts in the same folder, which contains the strings of the db queries for GET

import { SupabaseClient } from "@supabase/supabase-js";
import { Vehicle, Vehicles } from "../types/GetVehicleTypes";
import {
	getSingleVehicleByIdQuery,
	getVehiclesByUserIdQuery,
} from "./GetVehiclesQueries";

type ArrayWithOneVehicle = [Vehicle?];

/**Looks up vehicle by id, assembles the data from the multiple sub-tables, and returns an array with just that vehicle
 * Returns empty array if vehicle doesn't exist
 */
async function getSingleVehicleById(
	supabase: SupabaseClient,
	vehicleId: number
): Promise<ArrayWithOneVehicle> {
	/**Vehicle data is stored in several different tables
	 * This fetches data from each relevant table and joins it
	 */

	const vehicleInfoQuery = getSingleVehicleByIdQuery(vehicleId);

	const { data, error } = await vehicleInfoQuery;

	if (error) {
		throw new Error("Error fetching vehicle data in TEST: " + error.message);
	}

	const vehicles: Vehicles = data;

	// vehicle ids are unique so this should never happen
	if (vehicles.length > 1) {
		throw new Error(
			"Error fetching vehicle data: Multiple vehicles found. \n how did you even do that?"
		);
	}

	// This returns an empty array if no vehicle exists by that id
	// Otherwise, returns a single vehicle
	if (!vehicles[0]) return [];
	return [vehicles[0]];
}

/** Get all vehicles belonging to a user */
async function getVehiclesByUser(
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

const checkIfVehicleExistsInDB = async (
	vehicleID: number,
	supabase: SupabaseClient
): Promise<boolean> => {
	// Should be an array with one vehicle
	const vehicleArray = await getSingleVehicleById(supabase, vehicleID);

	return vehicleArray.length > 0;
};

const VehiclesDBUtils = {
	getSingleVehicleById,
	getVehiclesByUser,
	checkIfVehicleExistsInDB,
};

export default VehiclesDBUtils;
