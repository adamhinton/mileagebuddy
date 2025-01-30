"use server";

import { Vehicle } from "../server/types/VehicleTypes/GetVehicleTypes";
import { calcAvgFuelCostPerMileDollars } from "./calcAvgFuelCostPerMileDollars";
import { calculateFixedCostPerYear } from "./calculateFixedCostPerYear";
import {
	calculateMaintenanceCostPerYear,
	calculatePurchasePriceMinusSalesPrice,
	calculateVariableCostPerYear,
} from "./smallerCostUtils";

// README
// This is the main file for the algorithm that calculates the true cost of owning a car
// The primary function is exported from here
// It takes in an object of type Vehicle and performs various calculations to estimate the true cost per mile driven
// This is currently (1.28.25) a WIP and will develop as the project evolves.
// I decided to pass in full Vehicle to each sub helper function because it avoids confusion and keeps uniformity, but I may decide to change that later

// PLAN:
// "use server" at the top of each file
// Make CarCostResults type. With zod schema?
// Validate passed-in Vehicle?
// TEST EXTENSIVELY
// Write sub-functions for each part of the calculation
// TEST EXTENSIVELY
// Write tests for each sub-function
// TEST EXTENSIVELY
// Did I mention TEST EXTENSIVELY?
// Really, I'll regret it if I don't have thorough unit tests.
// TEST EXTENSIVELY

// NOTES:
// The miles they'll sell at is taken in to account more than how many years they say they'll keep it
// Need to make sure user understands that daily miles per day is on a seven day week, so if they commute five days a week it needs to account for that

export type CarCostCalculationResults = {
	// Breakdown of cost per mile? In gas, maintenance etc.
	// That's a stretch goal maybe
	costPerMile: number;
	costPerExtraMile: number;
	// Not sure this is needed
	vehicle: Vehicle;
};

// Only async because server actions must be async
export const calculateCarCostMain = async (vehicle: Vehicle) => {
	let totalCostPerAverageMileInDollars = 0;

	const normalMilesPerYear =
		vehicle.usage.averageDailyMiles * vehicle.usage.weeksPerYear;

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

	// Add up total years and miles will own car
	// Add:
	// Fuel costs per mile during that time (calcAvgFuelCostPerMileDollars)
	// Total purchase amount (calculatePurchasePriceMinusSalesPrice)
	// Total fixed costs for that time (calculateFixedCostPerYear)
	// Total variable costs for that time (calculateVariableCostPerYear)
	// Total maintenance costs for that time (calculateMaintenanceCostPerYear)
	// Divide it by total number of miles driven during that time

	const averagefuelCostPerMileDollars =
		await calcAvgFuelCostPerMileDollars(vehicle);

	console.log("averagefuelCostPerMileDollars:", averagefuelCostPerMileDollars);

	/** This is, basically, purchase price minus sales price
	 *
	 * Monthly loan payments are accounted for elsewhere
	 */
	const netLossOnPurchaseAndSale =
		await calculatePurchasePriceMinusSalesPrice(vehicle);
	const netLossProfitPerMile =
		netLossOnPurchaseAndSale / totalUsageMilesBeforeSale;

	console.log("netLossProfitPerMile:", netLossProfitPerMile);

	const fixedCostsPerMile =
		(await calculateFixedCostPerYear(vehicle)) / normalMilesPerYear;

	console.log("fixedCostsPerMile:", fixedCostsPerMile);

	const variableCostsPerMile =
		(await calculateVariableCostPerYear(vehicle)) / normalMilesPerYear;

	console.log("variableCostsPerMile:", variableCostsPerMile);

	const maintenanceCostPerMile =
		(await calculateMaintenanceCostPerYear(vehicle)) / normalMilesPerYear;

	console.log("maintenanceCostPerMile:", maintenanceCostPerMile);

	const total =
		averagefuelCostPerMileDollars +
		netLossProfitPerMile +
		fixedCostsPerMile +
		variableCostsPerMile +
		maintenanceCostPerMile;

	totalCostPerAverageMileInDollars += total;

	console.log(
		"totalCostPerAverageMileInDollars:",
		totalCostPerAverageMileInDollars
	);

	// TODO: Calculate any additional miles:
	// Recalculate total years and miles will own car; maybe don't do this if it's a small number like <100 or something
	// Subtract any costs for lessened period of owning car (lower loan amounts, lower parking etc)
	// Add increased variable costs; scale up maintenance one to one, add fuel costs
	// Just assume variableCosts scale up 1:1 with miles driven
};
