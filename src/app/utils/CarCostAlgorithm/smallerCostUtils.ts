// README
// This is for smaller functions that don't need their own file
// Is tested in smallerCostUtils.test.ts

import { Vehicle } from "../server/types/VehicleTypes/GetVehicleTypes";

/**
 * NOTE: Loan payments are accounted for elsewhere
 *
 * Can return a negative number if car appreciates in value
 *
 * So this basically subtracts the sales price from the purchase price
 *
 * Note: Not checking whether the sales price is higher than the purchase price because car could appreciate in value
 */
export const calculatePurchasePriceMinusSalesPrice = (vehicle: Vehicle) => {
	// NOTE: Loan payments are accounted for elsewhere
	// So this focuses only on purchase price

	const { purchasePrice, downPaymentAmount, willSellCarAtPrice } =
		vehicle.purchaseAndSales;

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
