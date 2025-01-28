// README
// This is (obviously) unit tests for the function calculateFixedCostPerYear
// Takes in data from Vehicle.fixedCosts and returns, obviously, the total fixed costs per year
// Note: I defined fake FixedCostses and passed them in to functions with  `as unkonwn as Vehicle` to keep type assertions as narrow as possible
// I didn't include other vehicle data in the fake vehicles because it wasn't needed and would clutter my code

import { calculateFixedCostPerYear } from "@/app/utils/CarCostAlgorithm/calculateCarCostMain";
import { Vehicle } from "@/app/utils/server/types/VehicleTypes/GetVehicleTypes";
import { FixedCosts } from "@/app/utils/server/types/VehicleTypes/VehicleSubSchemas";

const fakeFixedCosts: FixedCosts = {
	vehicleID: 1,
	yearlyInsuranceCost: 1000,
	yearlyRegistrationCost: 100,
	yearlyTaxes: 500,
	yearlyParkingCost: 200,
	monthlyLoanPayment: 200,
	monthlyWarrantyCost: 20,
	inspectionCost: 50,
	otherYearlyCosts: 100,
};

describe("calculateFixedCostPerYear", () => {
	it("Runs without errors", () => {
		calculateFixedCostPerYear({
			fixedCosts: fakeFixedCosts,
		} as unknown as Vehicle);
	});

	it("Returns the correct total fixed cost per year", () => {
		const result = calculateFixedCostPerYear({
			fixedCosts: fakeFixedCosts,
		} as unknown as Vehicle);

		expect(result).toBe(4590);
	});

	it("Allows zero values", () => {
		const fakeFixedCostsWithZeroValues: FixedCosts = {
			...fakeFixedCosts,
			yearlyParkingCost: 0,
			monthlyLoanPayment: 0,
		};

		const result = calculateFixedCostPerYear({
			fixedCosts: fakeFixedCostsWithZeroValues,
		} as unknown as Vehicle);

		expect(result).toBe(1990);
	});

	it("Doesn't accept negative values", () => {
		// TOOD: Implement this once schema validation happens
		// But, low priority - there's enough validation before reaching this function that this should never occur
	});

	it("Allows null values", () => {
		const fakeFixedCostsWithNullValues: FixedCosts = {
			...fakeFixedCosts,
			yearlyInsuranceCost: null,
			yearlyRegistrationCost: null,
		};

		const result = calculateFixedCostPerYear({
			fixedCosts: fakeFixedCostsWithNullValues,
		} as unknown as Vehicle);

		expect(result).toBe(3490);
	});

	it("Returns 0 for all null values", () => {
		const fakeFixedCostsWithAllNullValues: FixedCosts = {
			...fakeFixedCosts,
			yearlyInsuranceCost: null,
			yearlyRegistrationCost: null,
			yearlyTaxes: null,
			yearlyParkingCost: null,
			monthlyLoanPayment: null,
			monthlyWarrantyCost: null,
			inspectionCost: null,
			otherYearlyCosts: null,
		};

		const result = calculateFixedCostPerYear({
			fixedCosts: fakeFixedCostsWithAllNullValues,
		} as unknown as Vehicle);

		expect(result).toBe(0);
	});
});
