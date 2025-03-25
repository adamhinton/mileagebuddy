import { calcMaintenanceCostPerYear } from "@/app/utils/CarCostAlgorithm/smallerCostUtils";
import { YearlyMaintenanceCosts } from "@/app/zod/schemas/VehicleSubSchemas";

describe("calcMaintenanceCostPerYear", () => {
	// Only including needed fields
	const dummyYearlyMaintenanceCosts: YearlyMaintenanceCosts = {
		vehicleID: 1,
		oilChanges: 100,
		tires: 200,
		batteries: 50,
		brakes: 300,
		other: 100,
	};

	it("Runs without errors", async () => {
		expect(
			async () => await calcMaintenanceCostPerYear(dummyYearlyMaintenanceCosts)
		).not.toThrow();
	});

	it("Returns correct value", async () => {
		expect(await calcMaintenanceCostPerYear(dummyYearlyMaintenanceCosts)).toBe(
			750
		);
	});

	it("Can handle zero values", async () => {
		const dummyYearlyMaintenanceCosts3: YearlyMaintenanceCosts = {
			vehicleID: 1,
			oilChanges: 0,
			tires: 0,
			batteries: 0,
			brakes: 0,
			other: 0,
		};

		expect(await calcMaintenanceCostPerYear(dummyYearlyMaintenanceCosts3)).toBe(
			0
		);
	});

	it("Handles a mix of zero and positive values", async () => {
		const dummyYearlyMaintenanceCosts4: YearlyMaintenanceCosts = {
			vehicleID: 1,
			oilChanges: 0,
			tires: 0,
			batteries: 50,
			brakes: 0,
			other: 100,
		};

		expect(await calcMaintenanceCostPerYear(dummyYearlyMaintenanceCosts4)).toBe(
			150
		);
	});

	it("Handles large amounts", async () => {
		const dummyYearlyMaintenanceCostsHuge: YearlyMaintenanceCosts = {
			vehicleID: 1,
			// These are the max values zod permits for these fields
			oilChanges: 1_000,
			tires: 50_000,
			batteries: 50_000,
			brakes: 50_000,
			other: 500_000,
		};

		expect(
			await calcMaintenanceCostPerYear(dummyYearlyMaintenanceCostsHuge)
		).toBe(651_000);
	});
});
