import { createClientSSROnly } from "../../../../supabaseUtilsCustom/server";

const stringForJoiningVehicleTables = `
		userid, type,

		vehicledata(
			vehicleid, vehiclename, year, make, model, trim, highwaympg
		),

		gasvehicledata(
			vehicleid, gascostpergallon, milespergallonhighway, milespergalloncity
		),

		electricvehicledata(
			vehicleid, costpercharge, milespercharge, electricrangemiles
		),

		purchaseandsales(
			vehicleid, yearpurchased, purchaseprice, downpaymentamount, willsellcarafteryears, milesboughtat, willsellcaratmiles, willsellcaratprice
		),

		usage(
			vehicleid, averagedailymiles, weeksperyear, percenthighway, extradistancemiles, extradistancepercenthighway
		),

		fixedcosts(
			vehicleid, yearlyinsurancecost, yearlyregistrationcost, yearlytaxes, monthlyloanpayment, monthlywarrantycost, inspectioncost, otheryearlycosts
		),

		yearlymaintenancecosts(
			vehicleid, oilchanges, tires, batteries, brakes, other, depreciation
		),

		variablecosts(
			vehicleid, monthlyparkingcosts, monthlytolls, monthlycarwashcost, monthlymiscellaneouscosts, monthlycostdeductions
		)

		`;

export const getVehiclesByUserIdQuery = async (userId: string) => {
	console.log("blah blah blah");
	const supabase = await createClientSSROnly();
	const vehicleInfoQuery = await supabase
		.from("vehicles")
		.select(
			`
		userid, type,

		vehicledata(
			vehicleid, vehiclename, year, make, model, trim, highwaympg
		),

		gasvehicledata(
			vehicleid, gascostpergallon, milespergallonhighway, milespergalloncity
		),

		electricvehicledata(
			vehicleid, costpercharge, milespercharge, electricrangemiles
		),

		purchaseandsales(
			vehicleid, yearpurchased, purchaseprice, downpaymentamount, willsellcarafteryears, milesboughtat, willsellcaratmiles, willsellcaratprice
		),

		usage(
			vehicleid, averagedailymiles, weeksperyear, percenthighway, extradistancemiles, extradistancepercenthighway
		),

		fixedcosts(
			vehicleid, yearlyinsurancecost, yearlyregistrationcost, yearlytaxes, monthlyloanpayment, monthlywarrantycost, inspectioncost, otheryearlycosts
		),

		yearlymaintenancecosts(
			vehicleid, oilchanges, tires, batteries, brakes, other, depreciation
		),

		variablecosts(
			vehicleid, monthlyparkingcosts, monthlytolls, monthlycarwashcost, monthlymiscellaneouscosts, monthlycostdeductions
		)

		`
		)
		.eq("userid", userId);

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
