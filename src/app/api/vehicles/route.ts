/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextResponse } from "next/server";
import { createClientSSROnly } from "../../../../supabaseUtilsCustom/server";
import {
	getSingleVehicleById,
	getVehiclesByUser,
} from "@/utils/server/queries/getVehicleUtils";
import { Vehicle } from "@/utils/server/types/GetVehicleTypes";
import { Database, Tables } from "../../../../database.types";

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
			const arrayWithSingleVehicle = await getSingleVehicleById(
				supabase,
				Number(vehicleID)
			);
			console.log("vehicle from getSingleVehicleById:", arrayWithSingleVehicle);
			if (arrayWithSingleVehicle.length === 0) {
				return NextResponse.json({
					error: `Vehicle with id ${vehicleID} not found for user with id ${userID}`,
				});
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

export async function POST(request: Request) {
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

		return NextResponse.json(newVehicle, { status: 200 });
	} catch (error) {
		console.error("Error inserting vehicle data:", error);
		return NextResponse.json(
			{ error: "Failed to insert vehicle data" },
			{ status: 500 }
		);
	}
}
