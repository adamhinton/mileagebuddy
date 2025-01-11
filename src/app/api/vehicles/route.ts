import { NextResponse } from "next/server";
import { createClientSSROnly } from "../../../../supabaseUtilsCustom/server";
import { SupabaseClient } from "@supabase/supabase-js";

const vehiclesTableName = "vehicles";

// type PartialVehicle = {
// 	id: number;
// 	userid: number;
// 	type: "gas" | "electric";
// };

// type VehiclesDataResponse = {
// 	error: string;
// 	data: PartialVehicle[] | PartialVehicle;
// };

// Helper function to fetch vehicle data by a single vehicle ID
async function getVehicleById(
	supabase: SupabaseClient,
	vehicleId: number
): Promise<unknown> {
	const vehicleInfoPromises = [
		supabase
			.from("vehicledata")
			.select("vehiclename, year, make, model, trim, highwaympg")
			.eq("vehicleid", vehicleId)
			.single(),
		supabase
			.from("gasvehicledata")
			.select("gascostpergallon, milespergallonhighway, milespergalloncity")
			.eq("vehicleid", vehicleId)
			.single(),
		supabase
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

	const vehicleData = vehicleInfos.reduce((acc, info) => {
		return { ...acc, ...info.data };
	}, {});

	return vehicleData;
}

// Helper function to fetch vehicles for a given user
async function getVehiclesByUser(
	supabase: SupabaseClient,
	userId: number
): Promise<unknown[]> {
	const vehiclesData = await supabase
		.from(vehiclesTableName)
		.select("id, userid, type")
		.eq("userid", userId);

	if (!vehiclesData.data || vehiclesData.error) {
		throw new Error("No vehicles found for this user");
	}

	const vehicleIds = vehiclesData.data.map((vehicle) => vehicle.id);

	console.log("vehicleIds:", vehicleIds);

	return getVehiclesByIds(supabase, vehicleIds);
}

// Helper function to fetch vehicle data by IDs (used by both `getVehicleById` and `getVehiclesByUser`)
async function getVehiclesByIds(
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
				.from("gasvehicledata")
				.select("gascostpergallon, milespergallonhighway, milespergalloncity")
				.eq("vehicleid", id)
				.single(),
			supabase
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

export async function GET(request: Request) {
	const url = new URL(request.url!);

	try {
		const supabase = await createClientSSROnly();

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

		if (vehicleID) {
			const vehicle = await getVehicleById(supabase, Number(vehicleID));
			return NextResponse.json(vehicle, { status: 200 });
		} else {
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
