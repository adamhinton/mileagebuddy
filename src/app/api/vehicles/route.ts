// import { NextResponse } from "next/server";
import { NextResponse } from "next/server";
import { createClientSSROnly } from "../../../../supabaseUtilsCustom/server";
import { SupabaseClient } from "@supabase/supabase-js";

const vehiclesTableName = "vehicles";

// TODO: Make sure this only returns data for authenticated User id
export async function GET(request: Request) {
	const url = new URL(request.url!);

	type PartialVehicle = {
		id: number;
		userid: number;
		type: "gas" | "electric";
	};

	type VehiclesDataResponse = {
		error: string;
		data: PartialVehicle[];
	};

	try {
		const supabase = await createClientSSROnly();

		const userID = url.searchParams.get("userid");

		/**If this is null, get all that user's vehicles */
		const vehicleID = url.searchParams.get("vehicleid");

		let vehiclesData: {
			error: string;
			data: PartialVehicle[];
		};
		if (vehicleID) {
			vehiclesData = (await supabase
				.from(vehiclesTableName)
				.select("id, userid, type")
				.eq("id", vehicleID)
				// TODO: Better typing here
				.single()) as unknown as VehiclesDataResponse;
		} else {
			vehiclesData = (await supabase
				.from(vehiclesTableName)
				.select("id, userid, type")
				// TODO: Better typing here
				.eq("userid", userID)) as unknown as VehiclesDataResponse;
		}

		if (!vehiclesData) {
			return NextResponse.json(
				{
					error: "No vehicles found",
				},
				{ status: 404 }
			);
		}

		console.log("vehiclesData:", vehiclesData);

		const vehicleIDs = Array.isArray(vehiclesData.data)
			? vehiclesData.data.map((v) => v.id)
			: [vehicleID];

		console.log("vehicleIDs:", vehicleIDs);

		// There are multiple different tables containing different kinds of user data. This pulls them all together.
		const vehicleInfoPromises = vehicleIDs.map((id) =>
			Promise.all([
				supabase
					.from("vehicledata")
					.select("vehiclename, year, make, model, trim, highwaympg")
					.eq("vehicleid", id)
					.single(),
				supabase
					// Will return error/null if vehicle is electric. That's normal and expected
					.from("gasvehicledata")
					.select("gascostpergallon, milespergallonhighway, milespergalloncity")
					.eq("vehicleid", id)
					.single(),
				supabase
					// Will return error/null if vehicle is gas. That's normal and expected
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

		const fullVehiclesInfo = vehicleInfos.map((info, index) => {
			const vehicleData = vehicleID ? vehiclesData : vehiclesData.data[index];

			const basicVehicleData = info[0].data;
			const gasVehicleData = info[1].data;
			const electricVehicleData = info[2].data;
			const purchaseAndSalesData = info[3].data;
			const usageData = info[4].data;
			const fixedCostsData = info[5].data;
			const yearlyMaintenanceCostsData = info[6].data;
			const variableCosts = info[7].data;

			console.log("info:", info);

			return {
				// TODO: Name these for easier reading
				...vehicleData,
				...basicVehicleData,
				// either gas vehicle info or electric vehicle info
				// both can't exist together
				...(gasVehicleData ? gasVehicleData : electricVehicleData),
				...purchaseAndSalesData,
				...usageData,
				...fixedCostsData,
				...yearlyMaintenanceCostsData,
				...variableCosts,
			};
		});

		return NextResponse.json(fullVehiclesInfo, { status: 200 });
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

const getVehiclesById = async (
	vehicleIDs: string[],
	supabase: SupabaseClient
) => {};
