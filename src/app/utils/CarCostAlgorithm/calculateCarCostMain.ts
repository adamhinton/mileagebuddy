"use server";

import { Vehicle } from "../server/types/VehicleTypes/GetVehicleTypes";
import { calcAvgFuelCostPerMileDollars } from "./calcAvgFuelCostPerMileDollars";
import { calculateFixedCostPerYear } from "./calculateFixedCostPerYear";
import {
	calcCostPerAddtlMileDollars,
	calcMaintenanceCostPerYear,
	calculatePurchasePriceMinusSalesPrice,
	calculateVariableCostPerYear,
} from "./smallerCostUtils";

// README
// This is the main file for the algorithm that calculates the true cost of owning a car
// The primary function is exported from here
// It takes in an object of type Vehicle and performs various calculations to estimate the true cost per mile driven
// This is currently (1.28.25) a WIP and will develop as the project evolves.
// In the returned object, costPerMile is the total cost per mile for the amount of yearly miles the user reports driving
// Whereas costPerExtraMile is the cost per mile for any extra miles driven beyond the yearly amount they report
// costPerExtraMile factors in 		averagefuelCostPerMileDollars, maintenanceCostPerMile and netLossProfitPerMile, but not fixedCostsPerMile or variableCostsPerMile

// NOTES:
// The miles they'll sell at is taken in to account more than how many years they say they'll keep it
// Need to make sure user understands that daily miles per day is on a seven day week, so if they commute five days a week it needs to account for that

export type CarCostCalculationResults = {
	// Breakdown of cost per mile? In gas, maintenance etc.
	// That's a stretch goal maybe (TODO)
	costPerAverageDailyMile: number;
	costPerExtraMile: number;
	// Not sure this is needed
	vehicle: Vehicle;
	costPerMileBreakdown: {
		averagefuelCostPerMileDollars: number;
		netLossProfitPerMile: number;
		fixedCostsPerMile: number;
		variableCostsPerMile: number;
		maintenanceCostPerMile: number;
	};
};

// Only async because server actions must be async
// TODO: Move some of this logic to helper function? Just to keep main function pretty and readable
export const calculateCarCostMain = async (
	vehicle: Vehicle
): Promise<CarCostCalculationResults> => {
	const normalMilesPerYear =
		vehicle.usage.averageDailyMiles * 7 * vehicle.usage.weeksPerYear;

	const totalUsageMilesBeforeSale =
		vehicle.purchaseAndSales.willSellCarAtMiles -
		vehicle.purchaseAndSales.milesBoughtAt;

	const averagefuelCostPerMileDollars =
		await calcAvgFuelCostPerMileDollars(vehicle);

	/** This is, basically, purchase price minus sales price
	 *
	 * Monthly loan payments are accounted for elsewhere
	 */
	const netLossOnPurchaseAndSale = await calculatePurchasePriceMinusSalesPrice(
		vehicle.purchaseAndSales
	);
	const netLossProfitPerMile =
		netLossOnPurchaseAndSale / totalUsageMilesBeforeSale;

	const fixedCostsPerMile =
		(await calculateFixedCostPerYear(vehicle)) / normalMilesPerYear;

	const variableCostsPerMile =
		(await calculateVariableCostPerYear(vehicle.variableCosts)) /
		normalMilesPerYear;

	const maintenanceCostPerMile =
		(await calcMaintenanceCostPerYear(vehicle.yearlyMaintenanceCosts)) /
		normalMilesPerYear;

	const total =
		averagefuelCostPerMileDollars +
		netLossProfitPerMile +
		fixedCostsPerMile +
		variableCostsPerMile +
		maintenanceCostPerMile;

	let totalCostPerAverageMileInDollars = 0;

	totalCostPerAverageMileInDollars += total;
	// Round to three decimal places
	totalCostPerAverageMileInDollars =
		Math.round(totalCostPerAverageMileInDollars * 1000) / 1000;

	/** The cost of every additional mile that the user drives beyond the typical average they've already inputted
	 *
	 * See definition of calculateCostPerAddtlMileDollars for more info
	 */
	const costPerAddtlMileDollars = await calcCostPerAddtlMileDollars(
		averagefuelCostPerMileDollars,
		maintenanceCostPerMile,
		netLossProfitPerMile
	);

	const results: CarCostCalculationResults = {
		/**Total cost per mile for the normal use reported by user */
		costPerAverageDailyMile: totalCostPerAverageMileInDollars,
		/** Cost of any extra miles beyond typical reported use */
		costPerExtraMile: costPerAddtlMileDollars,
		/** THese factors are added together to make costPerMile */
		costPerMileBreakdown: {
			averagefuelCostPerMileDollars,
			netLossProfitPerMile,
			fixedCostsPerMile,
			variableCostsPerMile,
			maintenanceCostPerMile,
		},
		vehicle,
	};

	return results;
};
