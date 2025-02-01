"use server";

// README
// This is for smaller functions that don't need their own file
// Is tested in smallerCostUtils.test.ts
// These are used in calculateCarCostMain.ts

import {
	PurchaseAndSales,
	VariableCosts,
	YearlyMaintenanceCosts,
} from "../server/types/VehicleTypes/VehicleSubSchemas";

/**
 * NOTE: Loan payments are accounted for elsewhere
 *
 * Takes in Vehicle.purchaseAndSales instead of full Vehicle
 *
 * Can return a negative number if car appreciates in value
 *
 * So this basically subtracts the sales price from the purchase price
 *
 * Note: Not checking whether the sales price is higher than the purchase price because car could appreciate in value
 *
 * Only async because server actions must be async
 *
 * This is one of the items added together in claculateCarCostMain.ts to calculate the true cost per mile of driving a vehicle
 *
 */
export const calculatePurchasePriceMinusSalesPrice = async (
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
 * This is one of the items added together in claculateCarCostMain.ts to calculate the true cost per mile of driving a vehicle
 *
 * Only async because server actions must be async
 */
export const calculateVariableCostPerYear = async (
	variableCosts: VariableCosts
) => {
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
	const totalVariableCosts = totalMonthlyVariableCosts * 12;

	return totalVariableCosts;
};

/**Only async because server actions must be async
 *
 * takes in Vehicle.yearlyMaintenanceCosts instead of full Vehicle
 */
export const calculateMaintenanceCostPerYear = async (
	yearlyMaintenanceCosts: YearlyMaintenanceCosts
) => {
	// yearlyMaintenanceCosts.depreciation is deprecated because that's accounted for by the difference between sales price and purchase price in vehicle.purchaseAndSales
	// There's a TODO item to delete `depreciation` from the schema
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
 * It assumes the maintenanceCosts scale linearly which may not be true but it's too complicated to do anything else
 */
export const calculateCostPerAddtlMileDollars = async (
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
