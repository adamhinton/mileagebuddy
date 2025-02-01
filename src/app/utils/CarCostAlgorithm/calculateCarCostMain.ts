"use server";

import { Vehicle } from "../server/types/VehicleTypes/GetVehicleTypes";
import { calcAvgFuelCostPerMileDollars } from "./calcAvgFuelCostPerMileDollars";
import { calculateFixedCostPerYear } from "./calculateFixedCostPerYear";
import {
	calculateCostPerAddtlMileDollars,
	calculateMaintenanceCostPerYear,
	calculatePurchasePriceMinusSalesPrice,
	calculateVariableCostPerYear,
} from "./smallerCostUtils";

// README
// This is the main file for the algorithm that calculates the true cost of owning a car
// The primary function is exported from here
// It takes in an object of type Vehicle and performs various calculations to estimate the true cost per mile driven
// This is currently (1.28.25) a WIP and will develop as the project evolves.

// NOTES:
// The miles they'll sell at is taken in to account more than how many years they say they'll keep it
// Need to make sure user understands that daily miles per day is on a seven day week, so if they commute five days a week it needs to account for that

export type CarCostCalculationResults = {
	// Breakdown of cost per mile? In gas, maintenance etc.
	// That's a stretch goal maybe (TODO)
	costPerMile: number;
	costPerExtraMile: number;
	// Not sure this is needed
	vehicle: Vehicle;
};

// Only async because server actions must be async
export const calculateCarCostMain = async (
	vehicle: Vehicle
): Promise<CarCostCalculationResults> => {
	let totalCostPerAverageMileInDollars = 0;

	const normalMilesPerYear =
		vehicle.usage.averageDailyMiles * 7 * vehicle.usage.weeksPerYear;

	const totalUsageMilesBeforeSale =
		vehicle.purchaseAndSales.willSellCarAtMiles -
		vehicle.purchaseAndSales.milesBoughtAt;

	console.log("totalUsageMilesBeforeSale:", totalUsageMilesBeforeSale);

	/** The number of years user will own the car before selling it
	 *
	 * Not rounded at all. TODO: Round this?
	 *
	 * If they, say, own it for a fraction of a year at the end that will only minorly affect the cost per mile, since most significant costs are monthly
	 *
	 * So it may add or subtract an inspection cost or something but that's not worth extra complexity for $50 yearly
	 */
	const numYearsWillOwn = totalUsageMilesBeforeSale / normalMilesPerYear;

	console.log("numYearsWillOwn:", numYearsWillOwn);

	const averagefuelCostPerMileDollars =
		await calcAvgFuelCostPerMileDollars(vehicle);

	console.log("averagefuelCostPerMileDollars:", averagefuelCostPerMileDollars);

	/** This is, basically, purchase price minus sales price
	 *
	 * Monthly loan payments are accounted for elsewhere
	 */
	const netLossOnPurchaseAndSale = await calculatePurchasePriceMinusSalesPrice(
		vehicle.purchaseAndSales
	);
	const netLossProfitPerMile =
		netLossOnPurchaseAndSale / totalUsageMilesBeforeSale;

	console.log("netLossProfitPerMile:", netLossProfitPerMile);

	const fixedCostsPerMile =
		(await calculateFixedCostPerYear(vehicle)) / normalMilesPerYear;

	console.log("fixedCostsPerMile:", fixedCostsPerMile);

	const variableCostsPerMile =
		(await calculateVariableCostPerYear(vehicle.variableCosts)) /
		normalMilesPerYear;

	console.log("variableCostsPerMile:", variableCostsPerMile);

	const maintenanceCostPerMile =
		(await calculateMaintenanceCostPerYear(vehicle.yearlyMaintenanceCosts)) /
		normalMilesPerYear;

	console.log("maintenanceCostPerMile:", maintenanceCostPerMile);

	const total =
		averagefuelCostPerMileDollars +
		netLossProfitPerMile +
		fixedCostsPerMile +
		variableCostsPerMile +
		maintenanceCostPerMile;

	totalCostPerAverageMileInDollars += total;
	totalCostPerAverageMileInDollars =
		Math.round(totalCostPerAverageMileInDollars * 1000) / 1000;

	/** The cost of every additional mile that the user drives beyond the typical average they've already inputted
	 *
	 * See definition of calculateCostPerAddtlMileDollars for more info
	 */
	const costPerAddtlMileDollars = await calculateCostPerAddtlMileDollars(
		averagefuelCostPerMileDollars,
		maintenanceCostPerMile,
		netLossProfitPerMile
	);

	console.log("costPerAddtlMile:", costPerAddtlMileDollars);

	console.log(
		"totalCostPerAverageMileInDollars:",
		totalCostPerAverageMileInDollars
	);

	const results: CarCostCalculationResults = {
		costPerMile: totalCostPerAverageMileInDollars,
		costPerExtraMile: costPerAddtlMileDollars,
		vehicle,
	};

	return results;
};
