import { createClientSSROnly } from "../../../../supabaseUtilsCustom/server";

const stringForJoiningVehicleTables = `
		userid, type,

		"vehicleData"(
			"vehicleID", "vehicleName", year, make, model, trim, "highwayMPG"
		),

		"gasVehicleData"(
			"vehicleID", "gasCostPerGallon", "milesPerGallonHighway", "milesPerGallonCity"
		),

		"electricVehicleData"(
			"vehicleID", "costPerCharge", "milesPerCharge", "electricRangeMiles"
		),

		"purchaseAndSales"(
			"vehicleID", "yearPurchased", "purchasePrice", "downPaymentAmount", "willSellCarAfterYears", "milesBoughtAt", "willSellCarAtMiles", "willSellCarAtPrice"
		),

		usage(
			"vehicleID", "averageDailyMiles", "weeksPerYear", "percentHighway", "extraDistanceMiles", "extraDistancePercentHighway"
		),

		"fixedCosts"(
			"vehicleID", "yearlyInsuranceCost", "yearlyRegistrationCost", "yearlyTaxes", "monthlyLoanPayment", "monthlyWarrantyCost", "inspectionCost", "otherYearlyCosts"
		),

		yearlymaintenancecosts(
			"vehicleID", oilchanges, tires, batteries, brakes, other, depreciation
		),

		variablecosts(
			"vehicleID", monthlyparkingcosts, monthlytolls, monthlycarwashcost, monthlymiscellaneouscosts, monthlycostdeductions
		)

		`;

export const getVehiclesByUserIdQuery = async (userId: string) => {
	console.log("blah blah blah");
	const supabase = await createClientSSROnly();
	const vehicleInfoQuery = await supabase
		.from("vehicles")
		.select(stringForJoiningVehicleTables)
		.eq("userid", Number(userId));

	return vehicleInfoQuery;
};

export const getSingleVehicleByIdQuery = async (vehicleId: number) => {
	const supabase = await createClientSSROnly();
	const vehicleInfoQuery = supabase
		.from("vehicles")
		.select(stringForJoiningVehicleTables)
		.eq("id", vehicleId);

	return vehicleInfoQuery;
};
