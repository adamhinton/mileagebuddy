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

describe("Sanity check", () => {
	// If this fails, turn off the computer and go hug your family before spacetime inevitably rips itself apart under the strain
	it("[1] Reality is still real", () => {
		const twoPlusTwo = 4;

		expect(twoPlusTwo).toBe(4);
	});
});

describe("calculateFixedCostPerYear", () => {
	it("Runs without errors", () => {
		calculateFixedCostPerYear({
			fixedCosts: fakeFixedCosts,
		} as unknown as Vehicle);
	});

	it("[1] Returns the correct total fixed cost per year", () => {
		const result = calculateFixedCostPerYear({
			fixedCosts: fakeFixedCosts,
		} as unknown as Vehicle);

		expect(result).toBe(4590);
	});

	it("[2] Allows zero values", () => {
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

	it("[3] Doesn't accept negative values", () => {
		// TOOD: Implement this once schema validation happens
		// But, low priority - there's enough validation before reaching this function that this should never occur
	});

	it("[4] Allows null values", () => {
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

	it("[5] Returns 0 for all null values", () => {
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

	it("[6] Returns 0 for all zero values", () => {
		const fakeFixedCostsWithAllZeroValues: FixedCosts = {
			...fakeFixedCosts,
			yearlyInsuranceCost: 0,
			yearlyRegistrationCost: 0,
			yearlyTaxes: 0,
			yearlyParkingCost: 0,
			monthlyLoanPayment: 0,
			monthlyWarrantyCost: 0,
			inspectionCost: 0,
			otherYearlyCosts: 0,
		};

		const result = calculateFixedCostPerYear({
			fixedCosts: fakeFixedCostsWithAllZeroValues,
		} as unknown as Vehicle);

		expect(result).toBe(0);
	});
});
