"use server";

import { Vehicle } from "../server/types/VehicleTypes/GetVehicleTypes";
import { ElectricVehicleData } from "../server/types/VehicleTypes/VehicleSubSchemas";
import { calcAvgFuelCostPerMile } from "./calcAvgFuelCostPerMile";
import { calculateFixedCostPerYear } from "./calculateFixedCostPerYear";

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

export const calculateCarCostMain = (vehicle: Vehicle) => {
	const totalUsageMilesBeforeSale =
		vehicle.purchaseAndSales.willSellCarAtMiles -
		vehicle.purchaseAndSales.milesBoughtAt;

	const normalMilesPerYear =
		vehicle.usage.averageDailyMiles * vehicle.usage.weeksPerYear;

	// TODO: More precision?
	const numYearsWillOwn = Math.round(
		totalUsageMilesBeforeSale / normalMilesPerYear
	);

	const totalFixedCostPerYear = calculateFixedCostPerYear(vehicle);

	const totalFixedCosts = totalFixedCostPerYear * numYearsWillOwn;

	const averagefuelCostPerMile = calcAvgFuelCostPerMile(vehicle);
};
export { calculateFixedCostPerYear };
