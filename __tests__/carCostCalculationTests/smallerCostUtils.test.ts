// README:
// This is (obviously) associated with smallerCostUtils.ts
// Testing small functions that don't warrant their own test file
// Tests functions calculatePurchasePriceMinusSalesPrice and calculateVariableCostPerYear
// Will add more too
// TODO: Separate each function in to its own test file?

import {
	calculateCostPerAddtlMileDollars,
	calculateMaintenanceCostPerYear,
	calculatePurchasePriceMinusSalesPrice,
	calculateVariableCostPerYear,
} from "@/app/utils/CarCostAlgorithm/smallerCostUtils";
import {
	PurchaseAndSales,
	VariableCosts,
	YearlyMaintenanceCosts,
} from "@/app/utils/server/types/VehicleTypes/VehicleSubSchemas";

describe("Sanity check", () => {
	it("Reality is still real", () => {
		expect(true).toBe(true);
	});
});

describe("calculatePurchasePriceMinusSalesPrice", () => {
	/** Only including needed fields */
	const dummyData1 = {
		purchasePrice: 10_000,
		willSellCarAtPrice: 7_000,
		downPaymentAmount: null,
	} as unknown as PurchaseAndSales;

	it("Runs without errors", async () => {
		expect(
			async () =>
				await calculatePurchasePriceMinusSalesPrice(
					dummyData1 as unknown as PurchaseAndSales
				)
		).not.toThrow();
	});

	it("Returns correct value", async () => {
		expect(
			await calculatePurchasePriceMinusSalesPrice(
				dummyData1 as unknown as PurchaseAndSales
			)
		).toBe(3_000);
	});

	it("Can return a negative number if car appreciates in value", async () => {
		const dummyData2 = {
			purchasePrice: 7_000,
			willSellCarAtPrice: 10_000,
			downPaymentAmount: null,
		} as unknown as PurchaseAndSales;

		expect(
			await calculatePurchasePriceMinusSalesPrice(
				dummyData2 as unknown as PurchaseAndSales
			)
		).toBe(-3_000);
	});

	it("Can handle down payments", async () => {
		const dummyData3 = {
			purchasePrice: 10_000,
			willSellCarAtPrice: 5_000,
			downPaymentAmount: 2_000,
		};

		expect(
			await calculatePurchasePriceMinusSalesPrice(
				dummyData3 as unknown as PurchaseAndSales
			)
		).toBe(7_000);
	});

	// This should never happen due to zod
	it("Throws error if purchase price is not a number", async () => {
		const dummyData4: {
			purchaseAndSales: PurchaseAndSales;
		} = {
			purchaseAndSales: {
				purchasePrice: "10_000fa",
				willSellCarAtPrice: 7_000,
				downPaymentAmount: null,
			} as unknown as PurchaseAndSales,
		};

		expect(
			async () =>
				await calculatePurchasePriceMinusSalesPrice(
					dummyData4 as unknown as PurchaseAndSales
				)
		).rejects.toThrow();
	});

	// This should never happen due to zod
	it("Throws error if will sell car at price is not a number", async () => {
		const dummyData5: {
			purchaseAndSales: PurchaseAndSales;
		} = {
			purchaseAndSales: {
				purchasePrice: 10_000,
				willSellCarAtPrice: "7_000fa",
				downPaymentAmount: null,
			} as unknown as PurchaseAndSales,
		};

		expect(
			async () =>
				await calculatePurchasePriceMinusSalesPrice(
					dummyData5 as unknown as PurchaseAndSales
				)
		).rejects.toThrow();
	});

	// This should never happen due to zod
	it("Throws error if purchase price is null", async () => {
		const dummyData6: {
			purchaseAndSales: PurchaseAndSales;
		} = {
			purchaseAndSales: {
				purchasePrice: null,
				willSellCarAtPrice: 7_000,
				downPaymentAmount: null,
			} as unknown as PurchaseAndSales,
		};

		expect(
			async () =>
				await calculatePurchasePriceMinusSalesPrice(
					dummyData6 as unknown as PurchaseAndSales
				)
		).rejects.toThrow();
	});

	// This should never happen due to zod
	it("Throws error if will sell car at price is null", () => {
		const dummyData7: {
			purchaseAndSales: PurchaseAndSales;
		} = {
			purchaseAndSales: {
				purchasePrice: 10_000,
				willSellCarAtPrice: null,
				downPaymentAmount: null,
			} as unknown as PurchaseAndSales,
		};

		expect(
			async () =>
				await calculatePurchasePriceMinusSalesPrice(
					dummyData7 as unknown as PurchaseAndSales
				)
		).rejects.toThrow();
	});

	it("Handles large amounts", async () => {
		const dummyDataHuge = {
			// These are the max values zod permits for these fields
			purchasePrice: 50_000_000,
			willSellCarAtPrice: 53_000_000,
			downPaymentAmount: 51_000_000,
		};
		expect(
			await calculatePurchasePriceMinusSalesPrice(
				dummyDataHuge as unknown as PurchaseAndSales
			)
		).toBe(48_000_000);
	});
});

describe("calculateVariableCostPerYear", () => {
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
		expect(
			async () => await calculateVariableCostPerYear(dummyData)
		).not.toThrow();
	});

	it("Returns correct value", async () => {
		expect(await calculateVariableCostPerYear(dummyData)).toBe(1_800);
	});

	it("Can handle null values", async () => {
		const dummyData2: VariableCosts = {
			vehicleID: 1,
			monthlyParkingCosts: null,
			monthlyTolls: null,
			monthlyCarWashCost: null,
			monthlyMiscellaneousCosts: null,
			monthlyCostDeductions: null,
		};

		expect(await calculateVariableCostPerYear(dummyData2)).toBe(0);
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
			async () => await calculateVariableCostPerYear(dummyData3)
		).rejects.toThrow();
	});

	it("Handles a mix of zeroes, nulls and positive values", async () => {
		const dummyData4: VariableCosts = {
			vehicleID: 1,
			monthlyParkingCosts: null,
			monthlyTolls: 60,
			monthlyCarWashCost: 10,
			monthlyMiscellaneousCosts: 0,
			monthlyCostDeductions: 10,
		};

		expect(await calculateVariableCostPerYear(dummyData4)).toBe(720);
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

		expect(await calculateVariableCostPerYear(dummyDataHuge)).toBe(600_000);
	});
});

describe("calculateMaintenanceCostPerYear", () => {
	// Only including needed fields
	const dummyYearlyMaintenanceCosts: YearlyMaintenanceCosts = {
		vehicleID: 1,
		oilChanges: 100,
		tires: 200,
		batteries: 50,
		brakes: 300,
		other: 100,
		// DEPRECATED because it's accounted for elsewhere, there's a TODO to delete this
		depreciation: null,
	};

	it("Runs without errors", async () => {
		expect(
			async () =>
				await calculateMaintenanceCostPerYear(dummyYearlyMaintenanceCosts)
		).not.toThrow();
	});

	it("Returns correct value", async () => {
		expect(
			await calculateMaintenanceCostPerYear(dummyYearlyMaintenanceCosts)
		).toBe(750);
	});

	it("Can handle null values", async () => {
		const dummyYearlyMaintenanceCosts2: YearlyMaintenanceCosts = {
			vehicleID: 1,
			oilChanges: null,
			tires: null,
			batteries: null,
			brakes: null,
			other: null,
			// Deprecated
			depreciation: null,
		};

		expect(
			await calculateMaintenanceCostPerYear(dummyYearlyMaintenanceCosts2)
		).toBe(0);
	});

	it("Can handle zero values", async () => {
		const dummyYearlyMaintenanceCosts3: YearlyMaintenanceCosts = {
			vehicleID: 1,
			oilChanges: 0,
			tires: 0,
			batteries: 0,
			brakes: 0,
			other: 0,
			// Deprecated
			depreciation: null,
		};

		expect(
			await calculateMaintenanceCostPerYear(dummyYearlyMaintenanceCosts3)
		).toBe(0);
	});

	it("Handles a mix of zero, null and positive values", async () => {
		const dummyYearlyMaintenanceCosts4: YearlyMaintenanceCosts = {
			vehicleID: 1,
			oilChanges: 0,
			tires: null,
			batteries: 50,
			brakes: 0,
			other: 100,
			// Deprecated
			depreciation: null,
		};

		expect(
			await calculateMaintenanceCostPerYear(dummyYearlyMaintenanceCosts4)
		).toBe(150);
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
			// Deprecated
			depreciation: null,
		};

		expect(
			await calculateMaintenanceCostPerYear(dummyYearlyMaintenanceCostsHuge)
		).toBe(651_000);
	});
});

describe("calculateCostPerAddtlMileDollars", () => {
	const averagefuelCostPerMileDollars = 0.1;
	const maintenanceCostPerMile = 0.2;
	const netLossProfitPerMile = 0.3;

	it("Runs without errors", async () => {
		expect(
			async () =>
				await calculateCostPerAddtlMileDollars(
					averagefuelCostPerMileDollars,
					maintenanceCostPerMile,
					netLossProfitPerMile
				)
		).not.toThrow();
	});
});
