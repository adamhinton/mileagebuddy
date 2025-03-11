import { calcVariableCostPerYear } from "@/app/utils/CarCostAlgorithm/smallerCostUtils";
import { VariableCosts } from "@/app/zod/schemas/VehicleSubSchemas";

describe("calcVariableCostPerYear", () => {
	/** Only including needed fields */
	const dummyData: VariableCosts = {
		vehicleID: 1,
		monthlyParkingCosts: 100,
		monthlyTolls: 50,
		monthlyCarWashCost: 10,
		monthlyMiscellaneousCosts: 20,
		monthlyCostDeductions: 30,
	};

	it("Runs without errors", async () => {
		expect(async () => await calcVariableCostPerYear(dummyData)).not.toThrow();
	});

	it("Returns correct value", async () => {
		expect(await calcVariableCostPerYear(dummyData)).toBe(1_800);
	});

	// Zod should prevent this
	it("Throws error if monthly cost deductions is negative", async () => {
		const dummyData3: VariableCosts = {
			vehicleID: 1,
			monthlyParkingCosts: 100,
			monthlyTolls: 50,
			monthlyCarWashCost: 10,
			monthlyMiscellaneousCosts: 20,
			monthlyCostDeductions: -30,
		};

		expect(
			async () => await calcVariableCostPerYear(dummyData3)
		).rejects.toThrow();
	});

	it("Handles a mix of zeroes and positive values", async () => {
		const dummyData4: VariableCosts = {
			vehicleID: 1,
			monthlyParkingCosts: 0,
			monthlyTolls: 60,
			monthlyCarWashCost: 10,
			monthlyMiscellaneousCosts: 0,
			monthlyCostDeductions: 10,
		};

		expect(await calcVariableCostPerYear(dummyData4)).toBe(720);
	});

	it("Handles large amounts", async () => {
		const dummyDataHuge = {
			vehicleID: 1,
			// These are the max values zod permits for these fields
			monthlyParkingCosts: 20_000,
			monthlyTolls: 20_000,
			monthlyCarWashCost: 10_000,
			monthlyMiscellaneousCosts: 500_000,
			monthlyCostDeductions: 500_000,
		};

		expect(await calcVariableCostPerYear(dummyDataHuge)).toBe(600_000);
	});
});
