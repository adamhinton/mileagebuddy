// README:
// This is (obviously) associated with smallerCostUtils.ts
// Testing small functions that don't warrant their own test file

import { calculatePurchasePriceMinusSalesPrice } from "@/app/utils/CarCostAlgorithm/smallerCostUtils";
import { Vehicle } from "@/app/utils/server/types/VehicleTypes/GetVehicleTypes";
import { PurchaseAndSales } from "@/app/utils/server/types/VehicleTypes/VehicleSubSchemas";

describe("Sanity check", () => {
	it("Reality is still real", () => {
		expect(true).toBe(true);
	});
});

describe("calculatePurchasePriceMinusSalesPrice", () => {
	/** Only including needed fields */
	const dummyVehicle = {
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
		const dummyVehicle2 = {
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
		const dummyVehicle3 = {
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
		const dummyVehicle4 = {
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
		const dummyVehicle5 = {
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
		const dummyVehicle6 = {
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
		const dummyVehicle7 = {
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
});
