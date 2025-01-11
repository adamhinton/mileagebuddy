import { NextResponse } from "next/server";
import { createClientSSROnly } from "../../../../supabaseUtilsCustom/server";
import { SupabaseClient } from "@supabase/supabase-js";

const vehiclesTableName = "vehicles";

/**Looks up vehicle by id, assembles the data from the multiple sub-tables, and returns it */
async function getSingleVehicleById(
	supabase: SupabaseClient,
	vehicleId: number
): Promise<unknown> {
	// There are multiple tables with vehicle data. This assembles data from all of them
	const vehicleInfoPromises = [
		supabase
			.from("vehicledata")
			.select("vehiclename, year, make, model, trim, highwaympg")
			.eq("vehicleid", vehicleId)
			.single(),
		supabase
			// This will not exist if vehicle is electric, that's normal
			.from("gasvehicledata")
			.select("gascostpergallon, milespergallonhighway, milespergalloncity")
			.eq("vehicleid", vehicleId)
			.single(),
		supabase
			// This will not exist if vehicle is gas, that's normal
			.from("electricvehicledata")
			.select("costpercharge, milespercharge, electricrangemiles")
			.eq("vehicleid", vehicleId)
			.single(),
		supabase
			.from("purchaseandsales")
			.select(
				"yearpurchased, purchaseprice, downpaymentamount, willsellcarafteryears, milesboughtat, willsellcaratmiles, willsellcaratprice"
			)
			.eq("vehicleid", vehicleId)
			.single(),
		supabase
			.from("usage")
			.select(
				"averagedailymiles, weeksperyear, percenthighway, extradistancemiles, extradistancepercenthighway"
			)
			.eq("vehicleid", vehicleId)
			.single(),
		supabase
			.from("fixedcosts")
			.select(
				"yearlyinsurancecost, yearlyregistrationcost, yearlytaxes, monthlyloanpayment, monthlywarrantycost, inspectioncost, otheryearlycosts"
			)
			.eq("vehicleid", vehicleId)
			.single(),
		supabase
			.from("yearlymaintenancecosts")
			.select("oilchanges, tires, batteries, brakes, other, depreciation")
			.eq("vehicleid", vehicleId)
			.single(),
		supabase
			.from("variablecosts")
			.select(
				"monthlyparkingcosts, monthlytolls, monthlycarwashcost, monthlymiscellaneouscosts, monthlycostdeductions"
			)
			.eq("vehicleid", vehicleId)
			.single(),
	];

	const vehicleInfos = await Promise.all(vehicleInfoPromises);

	// Aggregate the data from all the fetched tables
	const vehicleData = vehicleInfos.reduce((acc, info) => {
		return { ...acc, ...info.data };
	}, {});

	return vehicleData;
}

/** Get all vehicles belonging to a user */
async function getVehiclesByUser(
	supabase: SupabaseClient,
	userId: number
): Promise<unknown[]> {
	/** This is just the data from the vehicles table
	 * There are several db tables that contain user data. Still need to aggregate all of them
	 */
	const basicVehiclesData = await supabase
		.from(vehiclesTableName)
		.select("id, userid, type")
		.eq("userid", userId);

	if (!basicVehiclesData.data || basicVehiclesData.error) {
		throw new Error("No vehicles found for this user");
	}

	const vehicleIds = basicVehiclesData.data.map((vehicle) => vehicle.id);

	return getMultipleVehiclesByIds(supabase, vehicleIds);
}

/** Takes in array of vehicle ids and returns full information about them
 * There are multiple db tables with vehicle info, this aggregates all of that together
 */
async function getMultipleVehiclesByIds(
	supabase: SupabaseClient,
	vehicleIds: number[]
): Promise<unknown[]> {
	const vehicleInfoPromises = vehicleIds.map((id) =>
		Promise.all([
			supabase
				.from("vehicledata")
				.select("vehiclename, year, make, model, trim, highwaympg")
				.eq("vehicleid", id)
				.single(),
			supabase
				// Will be empty if vehicle is electric, that's normal
				.from("gasvehicledata")
				.select("gascostpergallon, milespergallonhighway, milespergalloncity")
				.eq("vehicleid", id)
				.single(),
			supabase
				// Will be empty if vehicle is gas, that's normal
				.from("electricvehicledata")
				.select("costpercharge, milespercharge, electricrangemiles")
				.eq("vehicleid", id)
				.single(),
			supabase
				.from("purchaseandsales")
				.select(
					"yearpurchased, purchaseprice, downpaymentamount, willsellcarafteryears, milesboughtat, willsellcaratmiles, willsellcaratprice"
				)
				.eq("vehicleid", id)
				.single(),
			supabase
				.from("usage")
				.select(
					"averagedailymiles, weeksperyear, percenthighway, extradistancemiles, extradistancepercenthighway"
				)
				.eq("vehicleid", id)
				.single(),
			supabase
				.from("fixedcosts")
				.select(
					"yearlyinsurancecost, yearlyregistrationcost, yearlytaxes, monthlyloanpayment, monthlywarrantycost, inspectioncost, otheryearlycosts"
				)
				.eq("vehicleid", id)
				.single(),
			supabase
				.from("yearlymaintenancecosts")
				.select("oilchanges, tires, batteries, brakes, other, depreciation")
				.eq("vehicleid", id)
				.single(),
			supabase
				.from("variablecosts")
				.select(
					"monthlyparkingcosts, monthlytolls, monthlycarwashcost, monthlymiscellaneouscosts, monthlycostdeductions"
				)
				.eq("vehicleid", id)
				.single(),
		])
	);

	const vehicleInfos = await Promise.all(vehicleInfoPromises);

	return vehicleInfos.map((info) => {
		const basicVehicleData = info[0].data;
		const gasVehicleData = info[1].data;
		const electricVehicleData = info[2].data;
		const purchaseAndSalesData = info[3].data;
		const usageData = info[4].data;
		const fixedCostsData = info[5].data;
		const yearlyMaintenanceCostsData = info[6].data;
		const variableCosts = info[7].data;

		return {
			...basicVehicleData,
			...gasVehicleData,
			...electricVehicleData,
			...purchaseAndSalesData,
			...usageData,
			...fixedCostsData,
			...yearlyMaintenanceCostsData,
			...variableCosts,
		};
	});
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
