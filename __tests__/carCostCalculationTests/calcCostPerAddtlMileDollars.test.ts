import { calcCostPerAddtlMileDollars } from "@/app/utils/CarCostAlgorithm/smallerCostUtils";

describe("Sanity check", () => {
	it("Reality is still real", () => {
		expect(true).toBe(true);
	});
});

describe("calculateCostPerAddtlMileDollars", () => {
	const averagefuelCostPerMileDollars = 0.1;
	const maintenanceCostPerMile = 0.2;
	const netLossProfitPerMile = 0.3;

	it("Runs without errors", async () => {
		expect(
			async () =>
				await calcCostPerAddtlMileDollars(
					averagefuelCostPerMileDollars,
					maintenanceCostPerMile,
					netLossProfitPerMile
				)
		).not.toThrow();
	});

	it("Returns correct value", async () => {
		expect(
			await calcCostPerAddtlMileDollars(
				averagefuelCostPerMileDollars,
				maintenanceCostPerMile,
				netLossProfitPerMile
			)
		).toBe(0.6);
	});

	it("Can return a negative number if car appreciates in value", async () => {
		const averagefuelCostPerMileDollars = 0.1;
		const maintenanceCostPerMile = 0.2;
		const netLossProfitPerMile = -0.5;

		expect(
			await calcCostPerAddtlMileDollars(
				averagefuelCostPerMileDollars,
				maintenanceCostPerMile,
				netLossProfitPerMile
			)
		).toBe(-0.2);
	});

	it("Returns 0 when all costs are 0", async () => {
		// Shouldn't actually ever happen
		expect(await calcCostPerAddtlMileDollars(0, 0, 0)).toBe(0);
	});

	it("Correctly rounds values to three decimal places", async () => {
		// Sum = 0.12345 + 0.54321 + 0.11111 = 0.77777, should round to 0.778
		expect(await calcCostPerAddtlMileDollars(0.12345, 0.54321, 0.11111)).toBe(
			0.778
		);
	});

	it("Handles cases with extra decimals correctly", async () => {
		expect(
			await calcCostPerAddtlMileDollars(0.333333, 0.333333, 0.333333)
		).toBe(1);
	});
});
