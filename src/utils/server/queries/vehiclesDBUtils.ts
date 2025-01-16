// README:
// This is, obviously, helper functions to for GET /api/vehicles
// As opposed to GetVehiclesQueries.ts in the same folder, which contains the strings of the db queries for GET

import { SupabaseClient } from "@supabase/supabase-js";
import { Vehicle, Vehicles } from "../types/GetVehicleTypes";
import {
	getSingleVehicleByIdQuery,
	getVehiclesByUserIdQuery,
	stringForJoiningVehicleTables,
} from "./GetVehiclesQueries";
import { NextResponse } from "next/server";

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

/** Attempts to delete a vehicle by its id
 * The DELETE endpoint which calls it has already validated that vehicle exists and that vehicleID is valid
 * Returns the deleted vehicle or an error message
 */
const deleteDBVehicleByID = async (
	vehicleID: number,
	supabase: SupabaseClient
): Promise<NextResponse<Vehicle | { error: string }>> => {
	try {
		// Data will be an array of one vehicle
		// This delete also deletes all sub tables due to ON DELETE CASCADE
		const { data, error } = await supabase
			.from("vehicles")
			.delete()
			.eq("id", Number(vehicleID))
			// This causes the delete statement to return the deleted vehicle, including data from sub tables
			.select(stringForJoiningVehicleTables);

		// This should never happen, but TS needed to know data wouldn't be null
		if (data === null || data.length === 0) {
			return NextResponse.json(
				{ error: `Vehicle with id ${vehicleID} not found` },
				{ status: 404 }
			);
		}

		const deletedVehicle: Vehicle = data[0] as unknown as Vehicle;

		if (error) throw error;
		return NextResponse.json(deletedVehicle, {
			status: 200,
			statusText: "Vehicle deleted successfully",
		});
	} catch (error) {
		console.error("Error deleting vehicle data:", error);
		return NextResponse.json(
			{ error: "Failed to delete vehicle data" },
			{ status: 500 }
		);
	}
};

/** Attempts to add a new vehicle's data to DB
 * Returns the vehicle if successful, and an error if unsuccessful
 */
const addNewVehicleToDB = async (
	body: Vehicle,
	supabase: SupabaseClient
): Promise<NextResponse<Vehicle | { error: string }>> => {
	// Should only include the fields that need to be updated
	const {
		userid,
		type,
		vehiclesOrder,
		vehicleData,
		gasVehicleData,
		electricVehicleData,
		purchaseAndSales,
		usage,
		fixedCosts,
		yearlyMaintenanceCosts,
		variableCosts,
	} = body;

	try {
		// Wrote db function insert_vehicle_function.sql for this
		// The db function should do auto-validation to make sure fields exist and are correct, but --- TODO: More thorough new Vehicle validation
		const { data, error } = await supabase.rpc("insert_vehicle", {
			// These parameter names had to be all lower case to play nice with SQL
			_userid: userid,
			_type: type,
			_vehiclesorder: vehiclesOrder,
			_vehicledata: vehicleData,
			_gasvehicledata: gasVehicleData,
			_electricvehicledata: electricVehicleData,
			_purchaseandsales: purchaseAndSales,
			_usage: usage,
			_fixedcosts: fixedCosts,
			_yearlymaintenancecosts: yearlyMaintenanceCosts,
			_variablecosts: variableCosts,
		});

		if (error) throw error;

		const newVehicleID = data;

		// getSingleVehicleById returns an array with one Vehicle
		const newVehicleArray = await getSingleVehicleById(supabase, newVehicleID!);
		const newVehicle = newVehicleArray[0];

		return NextResponse.json(newVehicle!, { status: 200 });
	} catch (error) {
		console.error("Error inserting vehicle data:", error);
		return NextResponse.json(
			{ error: "Failed to insert vehicle data" },
			{ status: 500 }
		);
	}
};

const VehiclesDBUtils = {
	addNewVehicleToDB,
	deleteDBVehicleByID,
	getSingleVehicleById,
	getVehiclesByUser,
	checkIfVehicleExistsInDB,
};

export default VehiclesDBUtils;
