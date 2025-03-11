// README:
// This is, obviously, helper functions to for CRUD endpoints in /api/vehicles
// As opposed to GetVehiclesQueries.ts in the same folder, which contains the strings of the db queries for GET

import { SupabaseClient } from "@supabase/supabase-js";
import { Vehicle, Vehicles } from "../types/VehicleTypes/GetVehicleTypes";
import {
	getSingleVehicleByIdQuery,
	getVehiclesByUserIdQuery,
} from "./GetVehiclesQueries";
import { NextResponse } from "next/server";
import { Vehicle_For_db_POST } from "../types/VehicleTypes/POSTVehicleTypes";

/**The string we use in our select statement to get vehicles
 * It's longso we're saving it here to stay DRY
 * It just collects vehicle info from multiple tables in to one join
 */
export const stringForJoiningVehicleTables = `
		userid, type, id, "vehiclesOrder",

		"vehicleData"(
			"id", "vehicleID", "vehicleName", year, make, model, trim, "highwayMPG"
		),

		"gasVehicleData"(
			"id", "vehicleID", "gasCostPerGallon", "milesPerGallonHighway", "milesPerGallonCity"
		),

		"electricVehicleData"(
			"id", "vehicleID", "costPerCharge", "milesPerCharge", "electricRangeMiles"
		),

		"purchaseAndSales"(
			"id", "vehicleID", "yearPurchased", "purchasePrice", "downPaymentAmount", "willSellCarAfterYears", "milesBoughtAt", "willSellCarAtMiles", "willSellCarAtPrice"
		),

		usage(
			"id", "vehicleID", "averageDailyMiles", "weeksPerYear", "percentHighway", "extraDistanceMiles", "extraDistancePercentHighway"
		),

		"fixedCosts"(
			"id", "vehicleID", "yearlyInsuranceCost", "yearlyRegistrationCost", "yearlyTaxes", "monthlyLoanPayment", "monthlyWarrantyCost", "inspectionCost", "otherYearlyCosts"
		),

		"yearlyMaintenanceCosts"(
			"id", "vehicleID", "oilChanges", tires, batteries, brakes, other
		),

		"variableCosts"(
			"id", "vehicleID", "monthlyParkingCosts", "monthlyTolls", "monthlyCarWashCost", "monthlyMiscellaneousCosts", "monthlyCostDeductions"
		)

		`;

/**For situations where db call will return an array but we specifically expect one (or 0) Vehicle */
type ArrayWithOneOrZeroVehicles = [Vehicle?];

/**Looks up vehicle by id, assembles the data from the multiple sub-tables, and returns an array with just that vehicle
 *
 * Returns empty array if vehicle doesn't exist
 */
async function getSingleVehicleById(
	supabase: SupabaseClient,
	vehicleId: number
): Promise<ArrayWithOneOrZeroVehicles> {
	/**Vehicle data is stored in several different tables
	 *
	 * This fetches data from each relevant table and joins it
	 */

	const vehicleInfoQuery = getSingleVehicleByIdQuery(vehicleId);

	const { data, error } = await vehicleInfoQuery;

	if (error) {
		throw new Error("Error fetching vehicle data: " + error.message);
	}

	const vehicles: Vehicles = data as unknown as Vehicles;

	// vehicle ids are unique so this should never happen
	if (vehicles.length > 1) {
		throw new Error(
			"Error fetching vehicle data: Multiple vehicles found. \n how did you even do that?"
		);
	}

	// This returns an empty array if no vehicle exists by that id
	// Otherwise, returns a single vehicle
	if (!vehicles[0]) return [];
	return [vehicles[0] as unknown as Vehicle];
}

/** Get all vehicles belonging to a user */
async function getVehiclesByUser(
	supabase: SupabaseClient,
	userId: string
): Promise<Vehicles> {
	/** This is just the data from the vehicles table
	 * There are several db tables that contain user data. Still need to aggregate all of them
	 */
	const vehiclesDataQuery = getVehiclesByUserIdQuery(String(userId));
	const { data, error } = await vehiclesDataQuery;

	if (error) {
		throw new Error("Error fetching vehicle data in TEST: " + error.message);
	}

	return data as unknown as Vehicles;
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
 *
 * The DELETE endpoint which calls it has already validated that vehicle exists and that vehicleID is valid
 *
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

		// This should never happen since the endpoint has already checked that the vehicle exists, but TS needed to know data wouldn't be null
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
 *
 * Returns the vehicle if successful, and an error if unsuccessful
 *
 * Zod validation has alraedy been done on both the client and server before this si called
 */
const addNewVehicleToDB = async (
	body: Vehicle_For_db_POST,
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
		const { data, error } = await supabase.rpc("insert_vehicle", {
			// These parameter names had to be all lower case to play nice with SQL
			_userid: userid,
			_type: type,
			_vehiclesorder: vehiclesOrder,
			_vehicledata: vehicleData,
			_gasvehicledata: gasVehicleData || null,
			_electricvehicledata: electricVehicleData || null, // Always pass the parameter, even if null
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

/**
 *
 * @param updatedPartialVehicle a Vehicle with only the fields that need  updated
 * @param supabase supabase client
 * @returns either the full updated Vehicle (including unchanged fields) or an error
 *
 * This calls update_vehicle_function.sql which does most of the heavy lifting
 *
 * Only updates tables in DB if ALL parts succeed, otherwise rolls everything back
 */
const updateVehicleInDB = async (
	updatedPartialVehicle: Partial<Vehicle>,
	supabase: SupabaseClient,
	vehicleID: number
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
	} = updatedPartialVehicle;

	// if none of that stuff exists on body, throw error
	if (
		!userid &&
		!type &&
		!vehiclesOrder &&
		!vehicleData &&
		!gasVehicleData &&
		!electricVehicleData &&
		!purchaseAndSales &&
		!usage &&
		!fixedCosts &&
		!yearlyMaintenanceCosts &&
		!variableCosts
	) {
		return NextResponse.json({
			error: "Must include at least one vehicle field to update",
			status: 400,
		});
	}

	try {
		// Not getting data because it would be only a partial Vehicle
		// Will fetch the full vehicle momentarily and return that
		const { error } = await supabase.rpc("update_vehicle", {
			_vehicleid: Number(vehicleID),
			_partialdata: updatedPartialVehicle,
		});
		if (error) throw error;

		// An array with one vehicle
		const fullUpdatedVehicle = await getSingleVehicleById(
			supabase,
			Number(vehicleID)
		);

		return NextResponse.json(fullUpdatedVehicle[0]!, { status: 200 });
	} catch (error) {
		console.error("Error updating vehicle data:", error);
		return NextResponse.json(
			{ error: "Failed to update vehicle data" },
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
	updateVehicleInDB,
};

export default VehiclesDBUtils;
