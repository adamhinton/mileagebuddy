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
	// There are multiple tables with vehicle data. This assembles data from all of them
	// const vehicleInfoPromises = [
	// 	supabase
	// 		.from("vehicledata")
	// 		.select("vehiclename, year, make, model, trim, highwaympg")
	// 		.eq("vehicleid", vehicleId)
	// 		.single(),
	// 	supabase
	// 		// This will not exist if vehicle is electric, that's normal
	// 		.from("gasvehicledata")
	// 		.select("gascostpergallon, milespergallonhighway, milespergalloncity")
	// 		.eq("vehicleid", vehicleId)
	// 		.single(),
	// 	supabase
	// 		// This will not exist if vehicle is gas, that's normal
	// 		.from("electricvehicledata")
	// 		.select("costpercharge, milespercharge, electricrangemiles")
	// 		.eq("vehicleid", vehicleId)
	// 		.single(),
	// 	supabase
	// 		.from("purchaseandsales")
	// 		.select(
	// 			"yearpurchased, purchaseprice, downpaymentamount, willsellcarafteryears, milesboughtat, willsellcaratmiles, willsellcaratprice"
	// 		)
	// 		.eq("vehicleid", vehicleId)
	// 		.single(),
	// 	supabase
	// 		.from("usage")
	// 		.select(
	// 			"averagedailymiles, weeksperyear, percenthighway, extradistancemiles, extradistancepercenthighway"
	// 		)
	// 		.eq("vehicleid", vehicleId)
	// 		.single(),
	// 	supabase
	// 		.from("fixedcosts")
	// 		.select(
	// 			"yearlyinsurancecost, yearlyregistrationcost, yearlytaxes, monthlyloanpayment, monthlywarrantycost, inspectioncost, otheryearlycosts"
	// 		)
	// 		.eq("vehicleid", vehicleId)
	// 		.single(),
	// 	supabase
	// 		.from("yearlymaintenancecosts")
	// 		.select("oilchanges, tires, batteries, brakes, other, depreciation")
	// 		.eq("vehicleid", vehicleId)
	// 		.single(),
	// 	supabase
	// 		.from("variablecosts")
	// 		.select(
	// 			"monthlyparkingcosts, monthlytolls, monthlycarwashcost, monthlymiscellaneouscosts, monthlycostdeductions"
	// 		)
	// 		.eq("vehicleid", vehicleId)
	// 		.single(),
	// ];

	/**Vehicle data is stored in several different tables
	 * This fetches data from each relevant table and joins it
	 */
	// TODO: Fix this up. Note it takes in a user id but getSingleVehicleById expects a vehicleid, this is just for testing
	const vehicleInfoQuery = getSingleVehicleByIdQuery(vehicleId);

	const { data, error } = await vehicleInfoQuery;

	// type VehicleTestType = {
	// 	userid: number;
	// 	type: string;

	// 	vehicledata: Pick<
	// 		Tables<"vehicledata">,
	// 		| "vehicleid"
	// 		| "vehiclename"
	// 		| "year"
	// 		| "make"
	// 		| "model"
	// 		| "trim"
	// 		| "highwaympg"
	// 	>;
	// 	gasvehicledata: Pick<
	// 		Tables<"gasvehicledata">,
	// 		| "vehicleid"
	// 		| "gascostpergallon"
	// 		| "milespergallonhighway"
	// 		| "milespergalloncity"
	// 	>;

	// 	electricvehicledata: Pick<
	// 		Tables<"electricvehicledata">,
	// 		"vehicleid" | "costpercharge" | "milespercharge" | "electricrangemiles"
	// 	>;

	// 	purchaseandsales: Pick<
	// 		Tables<"purchaseandsales">,
	// 		| "vehicleid"
	// 		| "yearpurchased"
	// 		| "purchaseprice"
	// 		| "downpaymentamount"
	// 		| "willsellcarafteryears"
	// 		| "milesboughtat"
	// 		| "willsellcaratmiles"
	// 		| "willsellcaratprice"
	// 	>;

	// 	usage: Pick<
	// 		Tables<"usage">,
	// 		| "vehicleid"
	// 		| "averagedailymiles"
	// 		| "weeksperyear"
	// 		| "percenthighway"
	// 		| "extradistancemiles"
	// 		| "extradistancepercenthighway"
	// 	>;

	// 	fixedcosts: Pick<
	// 		Tables<"fixedcosts">,
	// 		| "vehicleid"
	// 		| "yearlyinsurancecost"
	// 		| "yearlyregistrationcost"
	// 		| "yearlytaxes"
	// 		| "monthlyloanpayment"
	// 		| "monthlywarrantycost"
	// 		| "inspectioncost"
	// 		| "otheryearlycosts"
	// 	>;

	// 	yearlymaintenancecosts: Pick<
	// 		Tables<"yearlymaintenancecosts">,
	// 		| "vehicleid"
	// 		| "oilchanges"
	// 		| "tires"
	// 		| "batteries"
	// 		| "brakes"
	// 		| "other"
	// 		| "depreciation"
	// 	>;

	// 	variablecosts: Pick<
	// 		Tables<"variablecosts">,
	// 		| "vehicleid"
	// 		| "monthlyparkingcosts"
	// 		| "monthlytolls"
	// 		| "monthlycarwashcost"
	// 		| "monthlymiscellaneouscosts"
	// 		| "monthlycostdeductions"
	// 	>;
	// };

	if (error) {
		throw new Error("Error fetching vehicle data in TEST: " + error.message);
	}

	const testData: VehiclesArrayReturnedFromDB = data;

	testData.map((vehicle, i) => {
		console.log("testData[i]:", testData[i]);
	});
	console.log("error from test await vehicleInfoQuery:", error);

	// const vehicleInfos = await Promise.all(vehicleInfoPromises);

	// Aggregate the data from all the fetched tables
	// const vehicleData: Tables<"vehicles"> = vehicleInfos.reduce((acc, info) => {
	// 	return { ...acc, ...info.data };
	// }, {} as Tables<"vehicles">);

	// Not sure why this thinks vehicleData is an empty object, works fine on frontend
	// I'm sure I'll regret this when it crashes and breaks everything
	return testData;
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

/** Takes in array of vehicle ids and returns full information about them
 * There are multiple db tables with vehicle info, this aggregates all of that together
 */

// 	supabase: SupabaseClient,
// 	vehicleIds: number[]
// ) {
// 	const { data, error } = await supabase
// 		.from("vehicledata")
// 		.select(
// 			`
//       vehiclename, year, make, model, trim, highwaympg,
//       gasvehicledata (
//         gascostpergallon, milespergallonhighway, milespergalloncity
//       ),
//       electricvehicledata (
//         costpercharge, milespercharge, electricrangemiles
//       ),
//       purchaseandsales (
//         yearpurchased, purchaseprice, downpaymentamount, willsellcarafteryears,
//         milesboughtat, willsellcaratmiles, willsellcaratprice
//       ),
//       usage (
//         averagedailymiles, weeksperyear, percenthighway,
//         extradistancemiles, extradistancepercenthighway
//       ),
//       fixedcosts (
//         yearlyinsurancecost, yearlyregistrationcost, yearlytaxes,
//         monthlyloanpayment, monthlywarrantycost, inspectioncost, otheryearlycosts
//       ),
//       yearlymaintenancecosts (
//         oilchanges, tires, batteries, brakes, other, depreciation
//       ),
//       variablecosts (
//         monthlyparkingcosts, monthlytolls, monthlycarwashcost,
//         monthlymiscellaneouscosts, monthlycostdeductions
//       )
//     `
// 		)
// 		.in("vehicledata.vehicleid", vehicleIds);

// 	if (error) {
// 		console.error(error);
// 		throw new Error(error.message);
// 	}

// 	// Map through the data and format the response correctly
// 	return data.map((info) => {
// 		// Destructure the needed fields and nested data
// 		const {
// 			vehiclename,
// 			year,
// 			make,
// 			model,
// 			trim,
// 			highwaympg,
// 			gasvehicledata,
// 			electricvehicledata,
// 			purchaseandsales,
// 			usage,
// 			fixedcosts,
// 			yearlymaintenancecosts,
// 			variablecosts,
// 		} = info;

// 		// Since gasvehicledata, electricvehicledata, etc., are arrays, we need to handle them accordingly
// 		const gasData = gasvehicledata?.[0] ?? {}; // Get the first item in the array, or an empty object if no data
// 		const electricData = electricvehicledata?.[0] ?? {}; // Same for electricvehicledata
// 		const purchaseData = purchaseandsales?.[0] ?? {}; // Same for purchaseandsales
// 		const usageData = usage?.[0] ?? {}; // Same for usage
// 		const fixedCostsData = fixedcosts?.[0] ?? {}; // Same for fixedcosts
// 		const maintenanceData = yearlymaintenancecosts?.[0] ?? {}; // Same for yearlymaintenancecosts
// 		const variableCostsData = variablecosts?.[0] ?? {}; // Same for variablecosts

// 		return {
// 			vehiclename,
// 			year,
// 			make,
// 			model,
// 			trim,
// 			highwaympg,
// 			// Gas data (if available)
// 			gascostpergallon: gasData.gascostpergallon,
// 			milespergallonhighway: gasData.milespergallonhighway,
// 			milespergalloncity: gasData.milespergalloncity,
// 			// Electric data (if available)
// 			costpercharge: electricData.costpercharge,
// 			milespercharge: electricData.milespercharge,
// 			electricrangemiles: electricData.electricrangemiles,
// 			// Purchase and sales data
// 			yearpurchased: purchaseData.yearpurchased,
// 			purchaseprice: purchaseData.purchaseprice,
// 			downpaymentamount: purchaseData.downpaymentamount,
// 			willsellcarafteryears: purchaseData.willsellcarafteryears,
// 			milesboughtat: purchaseData.milesboughtat,
// 			willsellcaratmiles: purchaseData.willsellcaratmiles,
// 			willsellcaratprice: purchaseData.willsellcaratprice,
// 			// Usage data
// 			averagedailymiles: usageData.averagedailymiles,
// 			weeksperyear: usageData.weeksperyear,
// 			percenthighway: usageData.percenthighway,
// 			extradistancemiles: usageData.extradistancemiles,
// 			extradistancepercenthighway: usageData.extradistancepercenthighway,
// 			// Fixed costs
// 			yearlyinsurancecost: fixedCostsData.yearlyinsurancecost,
// 			yearlyregistrationcost: fixedCostsData.yearlyregistrationcost,
// 			yearlytaxes: fixedCostsData.yearlytaxes,
// 			monthlyloanpayment: fixedCostsData.monthlyloanpayment,
// 			monthlywarrantycost: fixedCostsData.monthlywarrantycost,
// 			inspectioncost: fixedCostsData.inspectioncost,
// 			otheryearlycosts: fixedCostsData.otheryearlycosts,
// 			// Yearly maintenance costs
// 			oilchanges: maintenanceData.oilchanges,
// 			tires: maintenanceData.tires,
// 			batteries: maintenanceData.batteries,
// 			brakes: maintenanceData.brakes,
// 			other: maintenanceData.other,
// 			depreciation: maintenanceData.depreciation,
// 			// Variable costs
// 			monthlyparkingcosts: variableCostsData.monthlyparkingcosts,
// 			monthlytolls: variableCostsData.monthlytolls,
// 			monthlycarwashcost: variableCostsData.monthlycarwashcost,
// 			monthlymiscellaneouscosts: variableCostsData.monthlymiscellaneouscosts,
// 			monthlycostdeductions: variableCostsData.monthlycostdeductions,
// 		};
// 	});
// }

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
