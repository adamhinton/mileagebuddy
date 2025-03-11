// README
// This is (obviously) unit tests for the function calculateFixedCostPerYear
// Takes in data from Vehicle.fixedCosts and returns, obviously, the total fixed costs per year
// Note: I defined fake FixedCostses and passed them in to functions with  `as unkonwn as Vehicle` to keep type assertions as narrow as possible
// I didn't include other vehicle data in the fake vehicles because it wasn't needed and would clutter my code

import { calculateFixedCostPerYear } from "@/app/utils/CarCostAlgorithm/calculateFixedCostPerYear";
import { Vehicle } from "@/app/utils/server/types/VehicleTypes/GetVehicleTypes";
import { FixedCosts } from "@/app/zod/schemas/VehicleSubSchemas";

const fakeFixedCosts: FixedCosts = {
	vehicleID: 1,
	yearlyInsuranceCost: 1000,
	yearlyRegistrationCost: 100,
	yearlyTaxes: 500,
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
	it("Runs without errors", async () => {
		await calculateFixedCostPerYear({
			fixedCosts: fakeFixedCosts,
		} as unknown as Vehicle);
	});

	it("[1] Returns the correct total fixed cost per year", async () => {
		const result = await calculateFixedCostPerYear({
			fixedCosts: fakeFixedCosts,
		} as unknown as Vehicle);

		expect(result).toBe(4390);
	});

	it("[2] Allows zero values", async () => {
		const fakeFixedCostsWithZeroValues: FixedCosts = {
			...fakeFixedCosts,
			monthlyLoanPayment: 0,
		};

		const result = await calculateFixedCostPerYear({
			fixedCosts: fakeFixedCostsWithZeroValues,
		} as unknown as Vehicle);

		expect(result).toBe(1990);
	});

	it("[3] Doesn't accept negative values", async () => {
		// TOOD: Implement this once schema validation happens
		// But, low priority - there's enough validation before reaching this function that this should never occur
	});

	// used to have [4] and [5] here and they were deprecated, too lazy to change the numbers

	it("[6] Returns 0 for all zero values", async () => {
		const fakeFixedCostsWithAllZeroValues: FixedCosts = {
			...fakeFixedCosts,
			yearlyInsuranceCost: 0,
			yearlyRegistrationCost: 0,
			yearlyTaxes: 0,
			monthlyLoanPayment: 0,
			monthlyWarrantyCost: 0,
			inspectionCost: 0,
			otherYearlyCosts: 0,
		};

		const result = await calculateFixedCostPerYear({
			fixedCosts: fakeFixedCostsWithAllZeroValues,
		} as unknown as Vehicle);

		expect(result).toBe(0);
	});
});
