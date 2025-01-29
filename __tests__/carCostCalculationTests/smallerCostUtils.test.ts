// README:
// This is (obviously) associated with smallerCostUtils.ts
// Testing small functions that don't warrant their own test file
// Tests functions calculatePurchasePriceMinusSalesPrice and calculateVariableCostPerYear
// Will add more too
// TODO: Separate each function in to its own test file?

import {
	calculateMaintenanceCostPerYear,
	calculatePurchasePriceMinusSalesPrice,
	calculateVariableCostPerYear,
} from "@/app/utils/CarCostAlgorithm/smallerCostUtils";
import { Vehicle } from "@/app/utils/server/types/VehicleTypes/GetVehicleTypes";
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
	const dummyVehicle: {
		purchaseAndSales: PurchaseAndSales;
	} = {
		purchaseAndSales: {
			purchasePrice: 10_000,
			willSellCarAtPrice: 7_000,
			downPaymentAmount: null,
		} as unknown as PurchaseAndSales,
	};

	// calculatePurchasePriceMinusSalesPrice();
	it("Runs without errors", () => {
		expect(() =>
			calculatePurchasePriceMinusSalesPrice(dummyVehicle as unknown as Vehicle)
		).not.toThrow();
	});

	it("Returns correct value", () => {
		expect(
			calculatePurchasePriceMinusSalesPrice(dummyVehicle as unknown as Vehicle)
		).toBe(3_000);
	});

	it("Can return a negative number if car appreciates in value", () => {
		const dummyVehicle2: {
			purchaseAndSales: PurchaseAndSales;
		} = {
			purchaseAndSales: {
				purchasePrice: 7_000,
				willSellCarAtPrice: 10_000,
				downPaymentAmount: null,
			} as unknown as PurchaseAndSales,
		};

		expect(
			calculatePurchasePriceMinusSalesPrice(dummyVehicle2 as unknown as Vehicle)
		).toBe(-3_000);
	});

	it("Can handle down payments", () => {
		const dummyVehicle3: {
			purchaseAndSales: PurchaseAndSales;
		} = {
			purchaseAndSales: {
				purchasePrice: 10_000,
				willSellCarAtPrice: 5_000,
				downPaymentAmount: 2_000,
			} as unknown as PurchaseAndSales,
		};

		expect(
			calculatePurchasePriceMinusSalesPrice(dummyVehicle3 as unknown as Vehicle)
		).toBe(7_000);
	});

	// This should never happen due to zod
	it("Throws error if purchase price is not a number", () => {
		const dummyVehicle4: {
			purchaseAndSales: PurchaseAndSales;
		} = {
			purchaseAndSales: {
				purchasePrice: "10_000fa",
				willSellCarAtPrice: 7_000,
				downPaymentAmount: null,
			} as unknown as PurchaseAndSales,
		};

		expect(() =>
			calculatePurchasePriceMinusSalesPrice(dummyVehicle4 as unknown as Vehicle)
		).toThrow();
	});

	// This should never happen due to zod
	it("Throws error if will sell car at price is not a number", () => {
		const dummyVehicle5: {
			purchaseAndSales: PurchaseAndSales;
		} = {
			purchaseAndSales: {
				purchasePrice: 10_000,
				willSellCarAtPrice: "7_000fa",
				downPaymentAmount: null,
			} as unknown as PurchaseAndSales,
		};

		expect(() =>
			calculatePurchasePriceMinusSalesPrice(dummyVehicle5 as unknown as Vehicle)
		).toThrow();
	});

	// This should never happen due to zod
	it("Throws error if purchase price is null", () => {
		const dummyVehicle6: {
			purchaseAndSales: PurchaseAndSales;
		} = {
			purchaseAndSales: {
				purchasePrice: null,
				willSellCarAtPrice: 7_000,
				downPaymentAmount: null,
			} as unknown as PurchaseAndSales,
		};

		expect(() =>
			calculatePurchasePriceMinusSalesPrice(dummyVehicle6 as unknown as Vehicle)
		).toThrow();
	});

	// This should never happen due to zod
	it("Throws error if will sell car at price is null", () => {
		const dummyVehicle7: {
			purchaseAndSales: PurchaseAndSales;
		} = {
			purchaseAndSales: {
				purchasePrice: 10_000,
				willSellCarAtPrice: null,
				downPaymentAmount: null,
			} as unknown as PurchaseAndSales,
		};

		expect(() =>
			calculatePurchasePriceMinusSalesPrice(dummyVehicle7 as unknown as Vehicle)
		).toThrow();
	});

	it("Handles large amounts", () => {
		const dummyVehicleHuge: {
			purchaseAndSales: PurchaseAndSales;
		} = {
			// These are the max values zod permits for these fields
			purchaseAndSales: {
				purchasePrice: 50_000_000,
				willSellCarAtPrice: 53_000_000,
				downPaymentAmount: 51_000_000,
			},
		} as unknown as Vehicle;

		expect(
			calculatePurchasePriceMinusSalesPrice(
				dummyVehicleHuge as unknown as Vehicle
			)
		).toBe(48_000_000);
	});
});

describe("calculateVariableCostPerYear", () => {
	/** Only including needed fields */
	const dummyVehicle: {
		variableCosts: VariableCosts;
	} = {
		variableCosts: {
			vehicleID: 1,
			monthlyParkingCosts: 100,
			monthlyTolls: 50,
			monthlyCarWashCost: 10,
			monthlyMiscellaneousCosts: 20,
			monthlyCostDeductions: 30,
		},
	};

	it("Runs without errors", () => {
		expect(() =>
			calculateVariableCostPerYear(dummyVehicle as unknown as Vehicle)
		).not.toThrow();
	});

	it("Returns correct value", () => {
		expect(
			calculateVariableCostPerYear(dummyVehicle as unknown as Vehicle)
		).toBe(1_800);
	});

	it("Can handle null values", () => {
		const dummyVehicle2: {
			variableCosts: VariableCosts;
		} = {
			variableCosts: {
				monthlyParkingCosts: null,
				monthlyTolls: null,
				monthlyCarWashCost: null,
				monthlyMiscellaneousCosts: null,
				monthlyCostDeductions: null,
			},
		} as unknown as Vehicle;

		expect(
			calculateVariableCostPerYear(dummyVehicle2 as unknown as Vehicle)
		).toBe(0);
	});

	// Zod should prevent this
	it("Throws error if monthly cost deductions is negative", () => {
		const dummyVehicle3 = {
			variableCosts: {
				monthlyParkingCosts: 100,
				monthlyTolls: 50,
				monthlyCarWashCost: 10,
				monthlyMiscellaneousCosts: 20,
				monthlyCostDeductions: -30,
			} as unknown as VariableCosts,
		};

		expect(() =>
			calculateVariableCostPerYear(dummyVehicle3 as unknown as Vehicle)
		).toThrow();
	});

	it("Handles a mix of zeroes, nulls and positive values", () => {
		const dummyVehicle4: {
			variableCosts: VariableCosts;
		} = {
			variableCosts: {
				monthlyParkingCosts: null,
				monthlyTolls: 60,
				monthlyCarWashCost: 10,
				monthlyMiscellaneousCosts: 0,
				monthlyCostDeductions: 10,
			} as unknown as VariableCosts,
		};

		expect(
			calculateVariableCostPerYear(dummyVehicle4 as unknown as Vehicle)
		).toBe(720);
	});

	it("Handles large amounts", () => {
		const dummyVehicleHuge: {
			variableCosts: VariableCosts;
		} = {
			// These are the max values zod permits for these fields
			variableCosts: {
				monthlyParkingCosts: 20_000,
				monthlyTolls: 20_000,
				monthlyCarWashCost: 10_000,
				monthlyMiscellaneousCosts: 500_000,
				monthlyCostDeductions: 500_000,
			},
		} as unknown as Vehicle;

		expect(
			calculateVariableCostPerYear(dummyVehicleHuge as unknown as Vehicle)
		).toBe(600_000);
	});
});

describe.only("calculateMaintenanceCostPerYear", () => {
	// Only including needed fields
	const dummyVehicle: {
		yearlyMaintenanceCosts: YearlyMaintenanceCosts;
	} = {
		yearlyMaintenanceCosts: {
			vehicleID: 1,
			oilChanges: 100,
			tires: 200,
			batteries: 50,
			brakes: 300,
			other: 100,
			// DEPRECATED because it's accounted for elsewhere, there's a TODO to delete this
			depreciation: null,
		},
	};

	it("Runs without errors", async () => {
		expect(
			async () =>
				await calculateMaintenanceCostPerYear(
					dummyVehicle as unknown as Vehicle
				)
		).not.toThrow();
	});
});
