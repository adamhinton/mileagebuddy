import { createClientSSROnly } from "../../../../supabaseUtilsCustom/server";

// README
// This file contains the strings for the db queries for GET api/vehicles

/**The string we use in our select statement to get vehicles
 * It's longso we're saving it here to stay DRY
 * It just collects vehicle info from multiple tables in to one join
 */
export const stringForJoiningVehicleTables = `
		userid, type, id, "vehiclesOrder",

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

		"yearlyMaintenanceCosts"(
			"vehicleID", "oilChanges", tires, batteries, brakes, other, depreciation
		),

		"variableCosts"(
			"vehicleID", "monthlyParkingCosts", "monthlyTolls", "monthlyCarWashCost", "monthlyMiscellaneousCosts", "monthlyCostDeductions"
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
