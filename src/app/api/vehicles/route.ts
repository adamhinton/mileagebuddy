import { NextResponse } from "next/server";
import VehiclesDBUtils from "@/app/utils/server/queries/vehiclesDBUtils";
import { Vehicle } from "@/app/utils/server/types/VehicleTypes/GetVehicleTypes";
import { createClientSSROnly } from "@/app/utils/server/supabase/server";
import { Vehicle_For_db_POST } from "@/app/utils/server/types/VehicleTypes/POSTVehicleTypes";

const {
	addNewVehicleToDB,
	getSingleVehicleById,
	getVehiclesByUser,
	checkIfVehicleExistsInDB,
	deleteDBVehicle,
	updateVehicleInDB,
} = VehiclesDBUtils;

// If vehicleid query parameter is passed in, it gets only that vehicle
// if no vehicleid is passed in, it gets all vehicles for that user
// Right now userid must be passed in (api/vehicles?userid=1 or optionally, api/vehicles?userid=1&vehicleid=4) but that can be nixed once we get auth set up, since it'll only get vehicles for an authenticated user
export async function GET(request: Request) {
	const supabase = await createClientSSROnly();

	const url = new URL(request.url!);

	try {
		const userID = url.searchParams.get("userid");
		const vehicleID = url.searchParams.get("vehicleid");

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
			const vehicles = await getVehiclesByUser(supabase, userID);
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

/** I wrote a DB function for this since it was complicated with all these different tables
 * See insert_vehicle_function.sql
 *
 * NOTE: Middleware has validated this Vehicle before it gets here
 */
export async function POST(
	request: Request
): Promise<NextResponse<Vehicle | { error: string }>> {
	const supabase = await createClientSSROnly();

	// Body has already been validated against VehicleToBePostedSchema in the middleware
	const body: Vehicle_For_db_POST = await request.json();

	const response = await addNewVehicleToDB(body, supabase);

	return response;
}

export async function DELETE(
	request: Request
): Promise<NextResponse<Vehicle | { error: string }>> {
	const supabase = await createClientSSROnly();
	const url = new URL(request.url!);
	const vehicleID = url.searchParams.get("vehicleid");

	if (!vehicleID) {
		return NextResponse.json(
			{
				error:
					"vehicleid is required. Must be formatted like: /api/vehicles?vehicleid=2348",
			},
			{ status: 400 }
		);
	}

	const vehicleArray = await getSingleVehicleById(Number(vehicleID));
	if (vehicleArray.length === 0) {
		return NextResponse.json(
			{ error: `Vehicle with id ${vehicleID} not found` },
			{ status: 404 }
		);
	}

	const vehicle = vehicleArray[0]!;

	const response = await deleteDBVehicle(vehicle, supabase);

	return response;
}

/**
 * This takes in a Partial<Vehicle>
 * So you don't have to include all data, obviously
 * Only the tables included in the Partial<Vehicle> will be updated in the db
 * This endpoint calls the db function update_vehicle which does most of the heavy lifting here
 * The function only makes updates if all parts succeed
 */
export async function PATCH(
	request: Request
): Promise<NextResponse<Vehicle | { error: string }>> {
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

	const body = await request.json();
	const updatedPartialVehicle: Partial<Vehicle> = body;

	// Should only include the fields that need to be updated
	const {
		userid,
		type,
		vehiclesOrder,
		vehicleData,
		purchaseAndSales,
		// gasVehicleData and electricVehicleData are accounted for in the `if` block just below
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
		!("gasVehicleData" in updatedPartialVehicle) &&
		!("electricVehicleData" in updatedPartialVehicle) &&
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

	const isVehicleExistsInDB = await checkIfVehicleExistsInDB(Number(vehicleID));
	if (!isVehicleExistsInDB) {
		return NextResponse.json({
			error: `Vehicle with id ${vehicleID} not found`,
			status: 404,
		});
	}

	// Either the FULL updated vehicle or an error
	const response = await updateVehicleInDB(
		updatedPartialVehicle,
		supabase,
		Number(vehicleID)
	);

	return response;
}
