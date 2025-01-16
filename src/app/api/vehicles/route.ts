import { NextResponse } from "next/server";
import { createClientSSROnly } from "../../../../supabaseUtilsCustom/server";
import {
	getSingleVehicleById,
	getVehiclesByUser,
} from "@/utils/server/queries/getVehicleUtils";
import { Vehicle } from "@/utils/server/types/GetVehicleTypes";
import { stringForJoiningVehicleTables } from "@/utils/server/queries/GetVehiclesQueries";
import { SupabaseClient } from "@supabase/supabase-js";

// If vehicleid query parameter is passed in, it gets only that vehicle
// if no vehicleid is passed in, it gets all vehicles for that user
// Right now userid must be passed in (api/vehicles?userid=1 or optionally, api/vehicles?userid=1&vehicleid=4) but that can be nixed once we get auth set up, since it'll only get vehicles for an authenticated user
export async function GET(request: Request) {
	const url = new URL(request.url!);

	try {
		const supabase = await createClientSSROnly();

		const userID = url.searchParams.get("userid");
		const vehicleID = url.searchParams.get("vehicleid");

		console.log("userid:", userID, "vehicleid:", vehicleID);

		// Ensure that the user ID is provided
		if (!userID) {
			return NextResponse.json(
				{
					error:
						"userid is required. Must be formatted like: /api/vehicles?userid=2348. Or, optionally, api/vehicles?userid=1234&vehicleid=2348",
				},
				{ status: 400 }
			);
		}

		// If vehicleId is provided, get one vehicle. If no vehicleid is provided, get all the user's vehicles

		if (vehicleID) {
			console.log("vehicleid:", vehicleID);
			// Fetch details of a single vehicle by its ID
			/**
			 * Will be an array with one vehicle if vehicle exists in db, or empty array if vehicle isn't in db
			 */
			const arrayWithSingleVehicle = await getSingleVehicleById(
				supabase,
				Number(vehicleID)
			);

			if (arrayWithSingleVehicle.length === 0) {
				return NextResponse.json(
					{ error: `Vehicle with id ${vehicleID} not found` },
					{ status: 404 }
				);
			}

			return NextResponse.json(arrayWithSingleVehicle, { status: 200 });
		} else {
			// Fetch all vehicles for the given user
			const vehicles = await getVehiclesByUser(supabase, Number(userID));
			return NextResponse.json(vehicles, { status: 200 });
		}
	} catch (error) {
		console.error("Error fetching vehicle data:", error);
		return NextResponse.json(
			{
				error: "Failed to fetch vehicle data",
			},
			{ status: 500 }
		);
	}
}

// TODO: Vehicle validation middleware
/** I wrote a DB function for this since it was complicated with all these different tables
 * See insert_vehicle_function.sql
 */
export async function POST(
	request: Request
): Promise<NextResponse<Vehicle | { error: string }>> {
	const supabase = await createClientSSROnly();

	const body: Vehicle = await request.json();

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
			_gasvehicledata: gasVehicleData,
			_electricvehicledata: electricVehicleData,
			_purchaseandsales: purchaseAndSales,
			_usage: usage,
			_fixedcosts: fixedCosts,
			_yearlymaintenancecosts: yearlyMaintenanceCosts,
			_variablecosts: variableCosts,
		});

		if (error) throw error;

		console.log("data in POST api/vehicle:", data);

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
}

export async function DELETE(
	request: Request
): Promise<NextResponse<Vehicle | { error: string }>> {
	const supabase = await createClientSSROnly();
	const url = new URL(request.url!);
	const vehicleID = url.searchParams.get("vehicleid");

	const isVehicleExistsInDB = await checkIfVehicleExistsInDB(
		Number(vehicleID!),
		supabase
	);

	if (!isVehicleExistsInDB) {
		return NextResponse.json(
			{ error: `Vehicle with id ${vehicleID} not found` },
			{ status: 404 }
		);
	}

	if (!vehicleID) {
		return NextResponse.json(
			{
				error:
					"vehicleid is required. Must be formatted like: /api/vehicles?vehicleid=2348",
			},
			{ status: 400 }
		);
	}

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
}

// TODO: Vehicle validation
/**
 * This takes in a Partial<Vehicle>
 * So you don't have to include all data, obviously
 * Only the tables included in the Partial<Vehicle> will be updated in the db
 * This endpoint calls the db function update_vehicle which does most of the heavy lifting here
 * The function only makes updates if all parts succeed
 */
export async function PATCH(
	request: Request
): Promise<NextResponse<Vehicle> | NextResponse<{ error: string }>> {
	const supabase = await createClientSSROnly();
	const url = new URL(request.url!);
	const vehicleID = url.searchParams.get("vehicleid");

	if (!vehicleID) {
		return NextResponse.json({
			status: 400,
			error:
				"vehicleid is required. Must be formatted like: /api/vehicles?vehicleid=2348",
		});
	}

	const isVehicleExistsInDB = await checkIfVehicleExistsInDB(
		Number(vehicleID),
		supabase
	);
	if (!isVehicleExistsInDB) {
		return NextResponse.json({
			error: `Vehicle with id ${vehicleID} not found`,
		});
	}

	const body = await request.json();
	const updatedPartialVehicle: Partial<Vehicle> = body;

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
}

const checkIfVehicleExistsInDB = async (
	vehicleID: number,
	supabase: SupabaseClient
): Promise<boolean> => {
	// Should be an array with one vehicle
	const vehicleArray = await getSingleVehicleById(supabase, vehicleID);

	return vehicleArray.length > 0;
};
