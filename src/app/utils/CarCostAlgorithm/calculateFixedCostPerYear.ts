import { Vehicle } from "../server/types/VehicleTypes/GetVehicleTypes";

/** This adds up all the costs that don't change and are predictable
 * Includes thigns like insurance premiums, registration, taxes, etc.
 * Excludes things like gas costs, maintenance, etc
 */
export const calculateFixedCostPerYear = (vehicle: Vehicle) => {
	let totalfixedCostPerYear = 0;

	const {
		yearlyInsuranceCost,
		yearlyRegistrationCost,
		yearlyTaxes,
		yearlyParkingCost,
		monthlyLoanPayment,
		monthlyWarrantyCost,
		inspectionCost,
		otherYearlyCosts,
	} = vehicle.fixedCosts;

	totalfixedCostPerYear += yearlyInsuranceCost ?? 0;
	totalfixedCostPerYear += yearlyRegistrationCost ?? 0;
	totalfixedCostPerYear += yearlyTaxes ?? 0;
	totalfixedCostPerYear += yearlyParkingCost ?? 0;
	totalfixedCostPerYear += monthlyLoanPayment ? 12 * monthlyLoanPayment : 0;
	totalfixedCostPerYear += monthlyWarrantyCost ? 12 * monthlyWarrantyCost : 0;
	totalfixedCostPerYear += inspectionCost ?? 0;
	totalfixedCostPerYear += otherYearlyCosts ?? 0;

	return totalfixedCostPerYear;
};
