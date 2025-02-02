"use server";

// README
// This helper function calculates the yearly amount that the user spends on fixed/unchanging costs, like taxes, registration etc
// Comes from Vehicle.fixedCosts, aka the FixedCosts type/schema
// This is one of the items added together in calculateCarCostMain.ts to calculate the true cost per mile of driving a vehicle

import { Vehicle } from "../server/types/VehicleTypes/GetVehicleTypes";

/** This adds up all the costs that don't change and are predictable
 *
 * Includes thigns like insurance premiums, registration, taxes, etc.
 *
 * Excludes things like gas costs, maintenance, etc
 *
 * I decided to pass in full Vehicle to these sub helper functions because it avoids confusion and keeps uniformity, but I may decide to change that later
 *
 */
export const calculateFixedCostPerYear = async (vehicle: Vehicle) => {
	let totalfixedCostPerYear = 0;

	const {
		yearlyInsuranceCost,
		yearlyRegistrationCost,
		yearlyTaxes,
		// Deprecated, there's a todo item to delete this since it's duplicated elsewhere
		// yearlyParkingCost,
		monthlyLoanPayment,
		monthlyWarrantyCost,
		inspectionCost,
		otherYearlyCosts,
	} = vehicle.fixedCosts;

	totalfixedCostPerYear += yearlyInsuranceCost ?? 0;
	totalfixedCostPerYear += yearlyRegistrationCost ?? 0;
	totalfixedCostPerYear += yearlyTaxes ?? 0;
	// yearlyParkingCost is deprecated
	// totalfixedCostPerYear += yearlyParkingCost ?? 0;
	totalfixedCostPerYear += monthlyLoanPayment ? 12 * monthlyLoanPayment : 0;
	totalfixedCostPerYear += monthlyWarrantyCost ? 12 * monthlyWarrantyCost : 0;
	totalfixedCostPerYear += inspectionCost ?? 0;
	totalfixedCostPerYear += otherYearlyCosts ?? 0;

	return totalfixedCostPerYear;
};
