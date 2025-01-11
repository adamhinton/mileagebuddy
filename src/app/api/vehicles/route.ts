// import { NextResponse } from "next/server";
import { NextResponse } from "next/server";
import { createClientSSROnly } from "../../../../supabaseUtilsCustom/server";

/* eslint-disable @typescript-eslint/no-unused-vars */
// TODO: Make sure this only returns data for authenticated User id
export async function GET(request: Request) {
	// return NextResponse.json("Hello world vehicles", { status: 200 });
	// get all vehicles from vehicles table where userid= params id (api/vehicles?userid=1)

	const url = new URL(request.url!);
	const supabase = await createClientSSROnly();

	const userID = url.searchParams.get("id");

	/**If this is null, get all that user's vehicles */

	// TODO: getVehiclesByUserID and getSingleVehicleByVehicleID
	const vehicleID = url.searchParams.get("vehicleID");

	if (!userID) {
		return NextResponse.json(
			{
				error:
					"User ID is required. Must format like so: /api/vehicles?userid=2348",
			},
			{ status: 400 }
		);
	}
}
