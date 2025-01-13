import { createClientSSROnly } from "../../../../supabaseUtilsCustom/server";

const stringForJoiningVehicleTables = `
		userid, type,

		vehicledata(
			"vehicleID", vehiclename, year, make, model, trim, highwaympg
		),

		gasvehicledata(
			"vehicleID", gascostpergallon, milespergallonhighway, milespergalloncity
		),

		electricvehicledata(
			"vehicleID", costpercharge, milespercharge, electricrangemiles
		),

		purchaseandsales(
			"vehicleID", yearpurchased, purchaseprice, downpaymentamount, willsellcarafteryears, milesboughtat, willsellcaratmiles, willsellcaratprice
		),

		usage(
			"vehicleID", averagedailymiles, weeksperyear, percenthighway, extradistancemiles, extradistancepercenthighway
		),

		fixedcosts(
			"vehicleID", yearlyinsurancecost, yearlyregistrationcost, yearlytaxes, monthlyloanpayment, monthlywarrantycost, inspectioncost, otheryearlycosts
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
