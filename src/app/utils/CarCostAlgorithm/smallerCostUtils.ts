// README
// This is for smaller functions that don't need their own file
// Is tested in smallerCostUtils.test.ts

import { Vehicle } from "../server/types/VehicleTypes/GetVehicleTypes";

/**
 * NOTE: Loan payments are accounted for elsewhere
 *
 * So this basically subtracts the sales price from the purchase price
 */
export const calculatePurchasePriceMinusSalesPrice = (vehicle: Vehicle) => {
	// NOTE: Loan payments are accounted for elsewhere
	// So this focuses only on purchase price
	const purchasePrice =
		vehicle.purchaseAndSales.purchasePrice +
		Number(vehicle.purchaseAndSales.downPaymentAmount);
	const salesPrice = vehicle.purchaseAndSales.willSellCarAtPrice;

	const expense = purchasePrice - salesPrice;

	return expense;
};
