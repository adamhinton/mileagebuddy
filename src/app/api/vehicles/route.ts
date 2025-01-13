import { NextResponse } from "next/server";
import { createClientSSROnly } from "../../../../supabaseUtilsCustom/server";
import { SupabaseClient } from "@supabase/supabase-js";
import { VehiclesArrayReturnedFromDB } from "@/utils/server/types/GetVehicleTypes";
import {
	getSingleVehicleByIdQuery,
	getVehiclesByUserIdQuery,
} from "@/utils/server/queries/GetVehiclesQueries";

/**Looks up vehicle by id, assembles the data from the multiple sub-tables, and returns it */
async function getSingleVehicleById(
	supabase: SupabaseClient,
	vehicleId: number
): Promise<VehiclesArrayReturnedFromDB> {
	/**Vehicle data is stored in several different tables
	 * This fetches data from each relevant table and joins it
	 */

	const vehicleInfoQuery = getSingleVehicleByIdQuery(vehicleId);

	const { data, error } = await vehicleInfoQuery;

	if (error) {
		throw new Error("Error fetching vehicle data in TEST: " + error.message);
	}

	const vehicles: VehiclesArrayReturnedFromDB = data;

	vehicles.map((vehicle, i) => {
		console.log("vehicles[i]:", vehicles[i]);
	});
	console.log("error from test await vehicleInfoQuery:", error);

	// Not sure why this thinks vehicleData is an empty object, works fine on frontend
	// I'm sure I'll regret this when it crashes and breaks everything
	return vehicles;
}

/** Get all vehicles belonging to a user */
async function getVehiclesByUser(supabase: SupabaseClient, userId: number) {
	/** This is just the data from the vehicles table
	 * There are several db tables that contain user data. Still need to aggregate all of them
	 */
	const vehiclesDataQuery = getVehiclesByUserIdQuery(String(userId));
	const vehiclesData = await vehiclesDataQuery;
	return vehiclesData;
}

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
			// Fetch details of a single vehicle by its ID
			const vehicle = await getSingleVehicleById(supabase, Number(vehicleID));
			return NextResponse.json(vehicle, { status: 200 });
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
