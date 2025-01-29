"use server";

import { Vehicle } from "../server/types/VehicleTypes/GetVehicleTypes";
import { calcAvgFuelCostPerMileDollars } from "./calcAvgFuelCostPerMileDollars";
import { calculateFixedCostPerYear } from "./calculateFixedCostPerYear";
import { calculateVariableCostPerYear } from "./smallerCostUtils";

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
	const totalCostPerAverageMileInDollars = 0;

	// Add up total years and miles will own car
	// Add:
	// Total fuel costs during that time (calcAvgFuelCostPerMileDollars)
	// Total purchase amount (calculatePurchasePriceMinusSalesPrice)
	// Total fixed costs for that time (calculateFixedCostPerYear)
	// Total variable costs for that time (calculateVariableCostPerYear) (TODO)
	// Total maintenance costs for that time (calculateMaintenanceCostPerYear) (TODO)
	// Divide it by total number of miles driven during that time

	// TODO: Calculate any additional miles:
	// Recalculate total years and miles will own car; maybe don't do this if it's a small number like <100 or something
	// Subtract any costs for lessened period of owning car (lower loan amounts, lower parking etc)
	// Add increased variable costs; scale up maintenance one to one, add fuel costs
	// Just assume variableCosts scale up 1:1 with miles driven

	const totalUsageMilesBeforeSale =
		vehicle.purchaseAndSales.willSellCarAtMiles -
		vehicle.purchaseAndSales.milesBoughtAt;

	const normalMilesPerYear =
		vehicle.usage.averageDailyMiles * vehicle.usage.weeksPerYear;

	/** The number of years user will own the car before selling it
	 *
	 * Not rounded at all. TODO: Round this?
	 *
	 * If they, say, own it for a fraction of a year at the end that will only minorly affect the cost per mile, since most significant costs are monthly
	 *
	 * So it may add or subtract an inspection cost or something but that's not worth extra complexity for $50 yearly
	 */
	const numYearsWillOwn = totalUsageMilesBeforeSale / normalMilesPerYear;

	const totalFixedCostPerYear = calculateFixedCostPerYear(vehicle);

	/** This will change as(if) the user adds additional extra miles
	 *
	 * In that sense the additional extra miles save them money on this specific factor, bc they reduce the time the user will own the car before selling it at xx miles
	 */
	const totalFixedCosts = totalFixedCostPerYear * numYearsWillOwn;

	const averagefuelCostPerMile = calcAvgFuelCostPerMileDollars(vehicle);

	const milesDrivenPerYear =
		vehicle.usage.averageDailyMiles * vehicle.usage.weeksPerYear;

	const variableCostPerYear = calculateVariableCostPerYear(vehicle);
};
