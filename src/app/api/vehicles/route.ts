// import { NextResponse } from "next/server";
import { NextResponse } from "next/server";
import { createClientSSROnly } from "../../../../supabaseUtilsCustom/server";

const usersTableName = "vehicles";

/* eslint-disable @typescript-eslint/no-unused-vars */
// TODO: Make sure this only returns data for authenticated User id
export async function GET(request: Request) {
	// return NextResponse.json("Hello world vehicles", { status: 200 });
	// get all vehicles from vehicles table where userid= params id (api/vehicles?userid=1)

	const url = new URL(request.url!);
	const supabase = await createClientSSROnly();

	const userID = url.searchParams.get("userid");

	/**If this is null, get all that user's vehicles */

	// TODO: getVehiclesByUserID and getSingleVehicleByVehicleID
	const vehicleID = url.searchParams.get("vehicleID");

	// TODO: Probably won't need user id anymore as we only get vehicles for logged in user
	if (!userID) {
		return NextResponse.json(
			{
				error:
					"User ID is required. Must format like so: /api/vehicles?userid=2348",
			},
			{ status: 400 }
		);
	}

	const query = supabase.from(usersTableName).select("*").eq("userid", userID);

	const { data, error } = await query;

	return NextResponse.json(data);
}
