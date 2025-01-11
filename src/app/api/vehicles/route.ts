// import { NextResponse } from "next/server";
import { NextResponse } from "next/server";
import { createClientSSROnly } from "../../../../supabaseUtilsCustom/server";

const vehiclesTableName = "vehicles";

// TODO: Make sure this only returns data for authenticated User id
export async function GET(request: Request) {
	// return NextResponse.json("Hello world vehicles", { status: 200 });
	// get all vehicles from vehicles table where userid= params id (api/vehicles?userid=1)

	const url = new URL(request.url!);

	type PartialVehicle = {
		id: number;
		userid: number;
		type: "gas" | "electric";
	};

	try {
		const supabase = await createClientSSROnly();

		const userID = url.searchParams.get("userid");

		/**If this is null, get all that user's vehicles */
		const vehicleID = url.searchParams.get("vehicleID");

		let vehiclesData: PartialVehicle[];
		if (vehicleID) {
			vehiclesData = (await supabase
				.from(vehiclesTableName)
				.select("id, userid, type")
				.eq("id", vehicleID)
				// TODO: Better typing here
				.single()) as unknown as PartialVehicle[];
		} else {
			vehiclesData = (await supabase
				.from(vehiclesTableName)
				.select("id, userid, type, createdat, updatedat")
				// TODO: Better typing here
				.eq("userid", userID)) as unknown as PartialVehicle[];
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

		const vehicleIDs = Array.isArray(vehiclesData)
			? vehiclesData.map((v) => v.id)
			: [vehicleID];

		const vehicleInfoPromises = vehicleIDs.map((id) =>
			Promise.all([
				supabase
					.from("vehicleData")
					.select("vehicleName, year, make, model, trim, highwayMPG")
					.eq("vehicleid", id)
					.single(),
				supabase
					.from("gasVehicleData")
					.select("gasCostPerGallon, milesPerGallonHighway, milesPerGallonCity")
					.eq("vehicleid", id)
					.single(),
				supabase
					.from("electricVehicleData")
					.select("costPerCharge, milesPerCharge, electricRangeMiles")
					.eq("vehicleid", id)
					.single(),
				supabase
					.from("purchaseAndSales")
					.select(
						"yearPurchased, purchasePrice, downPaymentAmount, willSellCarAfterYears, milesBoughtAt, willSellCarAtMiles, willSellCarAtPrice"
					)
					.eq("vehicleid", id)
					.single(),
				supabase
					.from("usage")
					.select(
						"averageDailyMiles, weeksPerYear, percentHighway, extraDistanceMiles, extraDistancePercentHighway"
					)
					.eq("vehicleid", id)
					.single(),
				supabase
					.from("fixedCosts")
					.select(
						"yearlyInsuranceCost, yearlyRegistrationCost, yearlyTaxes, monthlyLoanPayment, monthlyWarrantyCost, inspectionCost, otherYearlyCosts"
					)
					.eq("vehicleid", id)
					.single(),
				supabase
					.from("yearlyMaintenanceCosts")
					.select("oilChanges, tires, batteries, brakes, other, depreciation")
					.eq("vehicleid", id)
					.single(),
				supabase
					.from("variableCosts")
					.select(
						"monthlyParkingCosts, monthlyTolls, monthlyCarWashCost, monthlyMiscellaneousCosts, monthlyCostDeductions"
					)
					.eq("vehicleid", id)
					.single(),
			])
		);

		const vehicleInfos = await Promise.all(vehicleInfoPromises);

		const fullVehiclesInfo = vehicleInfos.map((info, index) => {
			const vehicleData = vehicleID ? vehiclesData : vehiclesData[index];
			return {
				...vehicleData,
				...info[0],
				...info[1],
				...info[2],
				...info[3],
				...info[4],
				...info[5],
				...info[6],
				...info[7],
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
