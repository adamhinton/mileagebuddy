// README
// This is (obviously) associated with calculateCarCostMain.ts
// It's a family of functions that work together to return one result, so the bulk of the testing for this is done elsewhere - see CarCostCalculationTests folder
// Those tests check weird edge cases, big numbers, small numbers, null values etc
// So extensive testing here would be redundant. This file just makes sure it runs without errors and returns expected results.

import { calculateCarCostMain } from "@/app/utils/CarCostAlgorithm/calculateCarCostMain";

const completeMockVehicle = {
	type: "gas" as const,
	userid: 1,
	id: 1,
	vehiclesOrder: 1,
	vehicleData: {
		vehicleID: 1,
		vehicleName: "Tesla Model 3",
		year: 2020,
		make: "Tesla",
		model: "Model 3",
		trim: "Base",
		highwayMPG: 35.5,
	},
	gasVehicleData: {
		vehicleID: 1,
		gasCostPerGallon: 3.5,
		milesPerGallonHighway: 35.5,
		milesPerGallonCity: 35.5,
	},
	purchaseAndSales: {
		vehicleID: 1,
		yearPurchased: 2020,
		purchasePrice: 22000.0,
		downPaymentAmount: 2000.0,
		willSellCarAfterYears: 5,
		milesBoughtAt: 10000,
		willSellCarAtMiles: 80000,
		willSellCarAtPrice: 12000.0,
	},
	usage: {
		vehicleID: 1,
		averageDailyMiles: 100,
		weeksPerYear: 52,
		percentHighway: 0.5,
		extraDistanceMiles: 0,
		extraDistancePercentHighway: 0,
	},
	fixedCosts: {
		vehicleID: 1,
		yearlyInsuranceCost: 1000.0,
		yearlyRegistrationCost: 100.0,
		yearlyTaxes: 100.0,
		monthlyLoanPayment: 300.0,
		monthlyWarrantyCost: 30.0,
		inspectionCost: 100.0,
		// Deprecated, there's a todo item to delete yearlyParkingCost since it's duplicated elsewhere
		yearlyParkingCost: null,
		otherYearlyCosts: 300.0,
	},
	yearlyMaintenanceCosts: {
		vehicleID: 1,
		oilChanges: 100.0,
		tires: 200.0,
		batteries: 300.0,
		brakes: 100.0,
		other: 100.0,
		depreciation: 800.0,
	},
	variableCosts: {
		vehicleID: 1,
		monthlyParkingCosts: 100.0,
		monthlyTolls: 50.0,
		monthlyCarWashCost: 20.0,
		monthlyMiscellaneousCosts: 50.0,
		monthlyCostDeductions: 80.0,
	},
	electricVehicleData: null,
};

describe("Sanity check for car cost calculation tests", () => {
	it("[1] Reality is still real", () => {
		const twoPlusTwo = 4;

		expect(twoPlusTwo).toBe(4);
	});
});

describe("calculateCarCostMain", () => {
	it("[1] Runs without errors", () => {
		calculateCarCostMain(completeMockVehicle);
	});

	it("[2] Returns correct value", async () => {
		const result = await calculateCarCostMain(completeMockVehicle);

		expect(result.costPerAverageDailyMile).toBe(0.491);

		expect(result.costPerExtraMile).toBeCloseTo(0.292);
	});

	it("[3] Sub values add up to total", async () => {
		const result = await calculateCarCostMain(completeMockVehicle);

		const sumOfCostBreakdown =
			result.costPerMileBreakdown.fixedCostsPerMile +
			result.costPerMileBreakdown.variableCostsPerMile +
			result.costPerMileBreakdown.maintenanceCostPerMile +
			result.costPerMileBreakdown.averagefuelCostPerMileDollars +
			result.costPerMileBreakdown.netLossProfitPerMile;

		expect(result.costPerAverageDailyMile).toBeCloseTo(sumOfCostBreakdown);
	});
});
