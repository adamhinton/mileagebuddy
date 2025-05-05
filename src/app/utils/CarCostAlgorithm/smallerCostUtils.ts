"use server";

// README
// This is for smaller functions that don't need their own file
// These are used in calculateCarCostMain.ts
// These are server actions so must all be async

import {
	PurchaseAndSales,
	VariableCosts,
	YearlyMaintenanceCosts,
} from "../../zod/schemas/vehicles/VehicleSubSchemas";

/**
 * NOTE: Loan payments are accounted for elsewhere
 *
 * Takes in Vehicle.purchaseAndSales instead of full Vehicle
 *
 * Can return a negative number if car appreciates in value (sale price can be higher than purchase price)
 *
 * So this basically subtracts the sales price from the purchase price
 *
 * Only async because server actions must be async
 *
 * This is one of the items added together in claculateCarCostMain.ts to calculate the true cost per mile of driving a vehicle
 *
 */
export const calcPurchasePriceMinusSalesPrice = async (
	purchaseAndSales: PurchaseAndSales
) => {
	// NOTE: Loan payments are accounted for elsewhere
	// So this focuses only on purchase price

	const { purchasePrice, downPaymentAmount, willSellCarAtPrice } =
		purchaseAndSales;

	// This should never happen due to zod
	if (
		typeof purchasePrice !== "number" ||
		typeof willSellCarAtPrice !== "number"
	) {
		throw new Error(
			"Purchase price and will sell car at price must be numbers"
		);
	}

	// Probably they won't have a down payment and a purchase amount, but trying to account for all factors
	const totalPurchasePrice =
		purchasePrice + (downPaymentAmount !== null ? downPaymentAmount : 0);

	const expense = totalPurchasePrice - willSellCarAtPrice;

	return expense;
};

/** Calculates yearly total cost of items from Vehicle.variableCosts
 *
 * Takes in Vehicle.variableCosts instead of full Vehicle
 *
 * This is one of the items added together in calculateCarCostMain.ts to calculate the true cost per mile of driving a vehicle
 *
 * Only async because server actions must be async
 */
export const calcVariableCostPerYear = async (variableCosts: VariableCosts) => {
	const {
		monthlyParkingCosts,
		monthlyTolls,
		monthlyCarWashCost,
		monthlyMiscellaneousCosts,
		/** This will be a POSITIVE number that you SUBTRACT from the total */
		monthlyCostDeductions,
	} = variableCosts;

	// Zod should prevent this
	if (monthlyCostDeductions !== null && monthlyCostDeductions < 0) {
		throw new Error(
			"Monthly cost deductions must be a positive number, it's subtracted from the total"
		);
	}

	const totalMonthlyVariableCosts =
		(monthlyParkingCosts !== null ? monthlyParkingCosts : 0) +
		(monthlyTolls !== null ? monthlyTolls : 0) +
		(monthlyCarWashCost !== null ? monthlyCarWashCost : 0) +
		(monthlyMiscellaneousCosts !== null ? monthlyMiscellaneousCosts : 0) -
		// Deductions is subtracted, it's money they save (writeoffs, work reimbursements etc)
		(monthlyCostDeductions !== null ? monthlyCostDeductions : 0);

	// Yearly (obviously)
	const totalYearlyVariableCosts = totalMonthlyVariableCosts * 12;

	return totalYearlyVariableCosts;
};

/**Only async because server actions must be async
 *
 * takes in Vehicle.yearlyMaintenanceCosts instead of full Vehicle
 */
export const calcMaintenanceCostPerYear = async (
	yearlyMaintenanceCosts: YearlyMaintenanceCosts
) => {
	const { oilChanges, tires, batteries, brakes, other } =
		yearlyMaintenanceCosts;

	// Add these up accounting for null values
	const totalMaintenanceCostsYearly =
		(oilChanges !== null ? oilChanges : 0) +
		(tires !== null ? tires : 0) +
		(batteries !== null ? batteries : 0) +
		(brakes !== null ? brakes : 0) +
		(other !== null ? other : 0);

	return totalMaintenanceCostsYearly;
};

/** Only async because server actions must be async
 *
 * This is the cost of every additional mile that the user drives beyond the typical average they've already inputted
 *
 * So, any extra mile driven beyond the normal costs this amount
 *
 * This number will be less because it doesn't include variableCosts or fixedCosts - it doesn't cost you any more in insurance or taxes or registration to drive the extra miles
 *
 * Also assumes no extra variableCosts such as parking etc.
 *
 * It assumes the maintenanceCosts scale linearly which may not be perfectly accurate, but it's close enough that the complications of doing otherwise aren't necessary
 */
export const calcCostPerAddtlMileDollars = async (
	averagefuelCostPerMileDollars: number,
	maintenanceCostPerMile: number,
	netLossProfitPerMile: number
) => {
	const total =
		averagefuelCostPerMileDollars +
		maintenanceCostPerMile +
		netLossProfitPerMile;

	// round total to three decimal points
	return Math.round(total * 1000) / 1000;
};
