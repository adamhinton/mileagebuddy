import { NextResponse } from "next/server";
import { createClientSSROnly } from "../../../../supabaseUtilsCustom/server";
import VehiclesDBUtils from "@/utils/server/queries/vehiclesDBUtils";
import { Vehicle } from "@/utils/server/types/GetVehicleTypes";

const {
	addNewVehicleToDB,
	getSingleVehicleById,
	getVehiclesByUser,
	checkIfVehicleExistsInDB,
	deleteDBVehicleByID,
} = VehiclesDBUtils;

/** The client that we will use to interact with supabase in all of these route handlers */
const supabase = await createClientSSROnly();

// If vehicleid query parameter is passed in, it gets only that vehicle
// if no vehicleid is passed in, it gets all vehicles for that user
// Right now userid must be passed in (api/vehicles?userid=1 or optionally, api/vehicles?userid=1&vehicleid=4) but that can be nixed once we get auth set up, since it'll only get vehicles for an authenticated user
export async function GET(request: Request) {
	const url = new URL(request.url!);

	try {
		const userID = url.searchParams.get("userid");
		const vehicleID = url.searchParams.get("vehicleid");

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
		return NextResponse.json(
			{
				error: "Failed to fetch vehicle data" + error,
			},
			{ status: 500 }
		);
	}
}

// TODO: Vehicle validation middleware
/** I wrote a DB function for this since it was complicated with all these different tables
 * See insert_vehicle_function.sql
 * NOTE: This only needs a Partial<Vehicle>, and only updates the fields/tables included on the passed-in Vehicle.
 * So, you only need to pass in items that need updated.
 */
export async function POST(
	request: Request
): Promise<NextResponse<Vehicle | { error: string }>> {
	const body: Vehicle = await request.json();

	const response = await addNewVehicleToDB(body, supabase);

	return response;
}

export async function DELETE(
	request: Request
): Promise<NextResponse<Vehicle | { error: string }>> {
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

	const response: NextResponse<Vehicle | { error: string }> =
		await deleteDBVehicleByID(Number(vehicleID), supabase);

	return response;
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
	const url = new URL(request.url!);
	const vehicleID = url.searchParams.get("vehicleid");

	if (!vehicleID) {
		return NextResponse.json({
			status: 400,
			error:
				"vehicleid is required. Must be formatted like: /api/vehicles?vehicleid=2348",
		});
	}

	const body = await request.json();
	const updatedPartialVehicle: Partial<Vehicle> = body;

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
		console.log("No fields to update in PATCH");
		return NextResponse.json({
			error: "Must include at least one vehicle field to update",
			status: 400,
		});
	}

	const isVehicleExistsInDB = await checkIfVehicleExistsInDB(
		Number(vehicleID),
		supabase
	);
	if (!isVehicleExistsInDB) {
		return NextResponse.json({
			error: `Vehicle with id ${vehicleID} not found`,
			status: 404,
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
}
