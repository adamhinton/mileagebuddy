// README
// This is (obviously) a test file for calcAvgFuelCostPerMile.ts
// It takes in a Vehicle that is either type GasVehicle or ElectricVehicle and calculates either the cost per mile of gas or electricity

import { calcAvgFuelCostPerMileDollars } from "@/app/utils/CarCostAlgorithm/calcAvgFuelCostPerMileDollars";
import { Vehicle } from "@/app/utils/server/types/VehicleTypes/GetVehicleTypes";
import {
	ElectricVehicleData,
	GasVehicleData,
	HybridVehicleData,
	Usage,
} from "@/app/zod/schemas/vehicles/VehicleSubSchemas";

// Dummy part of a Vehicle with only gasVehicleData
// Only passing in the needed fields
// Will pass this in as the only object in a typecasted Vehicle
const dummyGasVehicleData: GasVehicleData = {
	vehicleID: 1,
	milesPerGallonCity: 20,
	milesPerGallonHighway: 30,
	gasCostPerGallon: 3.5,
};

// Only passing in needed types for the test
// No type casting, will type assert it when passing it in to function to keep this TS butchery narrow
const dummyGasVehicle = {
	type: "gas",
	usage: { percentHighway: 30 } as unknown as Usage,
	gasVehicleData: dummyGasVehicleData,
};

// Dummy part of a Vehicle with only electricVehicleData
// Only passing in the needed fields
// Will pass this in as the only object in a typecasted Vehicle
const dummyElectricVehicleData: ElectricVehicleData = {
	vehicleID: 1,
	costPerCharge: 3,
	milesPerCharge: 102,
};

// Only passing in needed types for the test
// No type casting, will type assert it when passing it in to function to keep this TS butchery narrow
const dummyElectricVehicle = {
	type: "electric",
	usage: { percentHighway: 30 } as unknown as Usage,
	electricVehicleData: dummyElectricVehicleData,
};

const dummyHybridVehicleData: HybridVehicleData = {
	vehicleID: 1,
	gasCostPerGallon: 3.5,
	milesPerGallonHighway: 50,
	milesPerGallonCity: 55,
	electricityCostPerKWh: 0.14,
	milesPerKWhHighway: 4.5,
	milesPerKWhCity: 3.8,
	percentElectricDriving: 60,
};

const dummyHybridVehicle = {
	type: "hybrid",
	usage: { percentHighway: 40 } as unknown as Usage,
	hybridVehicleData: dummyHybridVehicleData,
};

describe("Sanity check", () => {
	it("[1] Reality is still real. If this fails you have bigger problems than this test", async () => {
		expect(1).toBe(1);
	});
});

describe("calcAvgFuelCostPerMile", () => {
	it("[1] Runs without errors with a gas vehicle", async () => {
		await calcAvgFuelCostPerMileDollars(dummyGasVehicle as unknown as Vehicle);
	});

	it("[2] Runs without errors with an electric vehicle", async () => {
		await calcAvgFuelCostPerMileDollars(
			dummyElectricVehicle as unknown as Vehicle
		);
	});

	it("[3] Returns the correct value for a gas vehicle", async () => {
		const result = await calcAvgFuelCostPerMileDollars(
			dummyGasVehicle as unknown as Vehicle
		);

		expect(result).toBe(0.152);
	});

	it("Runs without errors with a hybrid vehicle", async () => {
		await calcAvgFuelCostPerMileDollars(
			dummyHybridVehicle as unknown as Vehicle
		);
	});

	it("[4] Returns the correct value for an electric vehicle", async () => {
		const result = await calcAvgFuelCostPerMileDollars(
			dummyElectricVehicle as unknown as Vehicle
		);

		expect(result).toBe(0.029);
	});

	it("Returns the correct value for a hybrid vehicle", async () => {
		const result = await calcAvgFuelCostPerMileDollars(
			dummyHybridVehicle as unknown as Vehicle
		);

		// Adjust expected value based on your hybrid cost calculation logic
		expect(result).toBe(0.047);
	});

	// This should never happen because TS will prevent it, but doesn't hurt to check
	it("[5] Throws an error if the vehicle type is neither gas nor electric or hybrid", async () => {
		const dummyVehicle = {
			type: "neither",
			usage: { percentHighway: 30, percentCity: 70 } as unknown as Usage,
			electricVehicleData: dummyElectricVehicleData,
		};

		await expect(async () => {
			await calcAvgFuelCostPerMileDollars(dummyVehicle as unknown as Vehicle);
		}).rejects.toThrow();
	});

	it("[6] Returns the correct value for a gas vehicle with 100% city driving", async () => {
		const dummyGasVehicle100City = {
			type: "gas",
			usage: { percentHighway: 0, percentCity: 100 } as unknown as Usage,
			gasVehicleData: dummyGasVehicleData,
		};

		const result = await calcAvgFuelCostPerMileDollars(
			dummyGasVehicle100City as unknown as Vehicle
		);

		expect(result).toBe(0.175);
	});

	it("[7] Returns the correct value for a gas vehicle with 100% highway driving", async () => {
		const dummyGasVehicle100Highway = {
			type: "gas",
			usage: { percentHighway: 100, percentCity: 0 } as unknown as Usage,
			gasVehicleData: dummyGasVehicleData,
		};

		const result = await calcAvgFuelCostPerMileDollars(
			dummyGasVehicle100Highway as unknown as Vehicle
		);

		expect(result).toBe(0.117);
	});

	// Algorithm actually doesn't distinguish between fuel efficiency in city vs highway for EVs so this shouldn't matter
	it("[8] Returns the correct value for an electric vehicle with 100% city driving", async () => {
		const dummyElectricVehicle100City = {
			type: "electric",
			usage: { percentHighway: 0, percentCity: 100 } as unknown as Usage,
			electricVehicleData: dummyElectricVehicleData,
		};

		const result = await calcAvgFuelCostPerMileDollars(
			dummyElectricVehicle100City as unknown as Vehicle
		);

		expect(result).toBe(0.029);
	});

	// Algorithm actually doesn't distinguish between fuel efficiency in city vs highway for EVs so this shouldn't matter
	it("[9] Returns the correct value for an electric vehicle with 100% highway driving", async () => {
		const dummyElectricVehicle100Highway = {
			type: "electric",
			usage: { percentHighway: 100, percentCity: 0 } as unknown as Usage,
			electricVehicleData: dummyElectricVehicleData,
		};

		const result = await calcAvgFuelCostPerMileDollars(
			dummyElectricVehicle100Highway as unknown as Vehicle
		);

		expect(result).toBe(0.029);
	});

	// This should never happen because zod will prevent it, but doesn't hurt to check
	it("[10] Throws or handles invalid usage (e.g. < 0 or > 100)", async () => {
		const invalidUsageVehicle = {
			type: "gas",
			usage: { percentHighway: 120, percentCity: -20 } as unknown as Usage,
			gasVehicleData: dummyGasVehicleData,
		};
		await expect(
			calcAvgFuelCostPerMileDollars(invalidUsageVehicle as Vehicle)
		).rejects.toThrow();
	});

	it("[11] Returns the correct value for a hybrid vehicle with 100% city driving", async () => {
		const dummyHybridVehicle100City = {
			type: "hybrid",
			usage: { percentHighway: 0, percentCity: 100 } as unknown as Usage,
			hybridVehicleData: dummyHybridVehicleData,
		};

		const result = await calcAvgFuelCostPerMileDollars(
			dummyHybridVehicle100City as unknown as Vehicle
		);

		expect(result).toBe(0.048);
	});

	it("[12] Returns the correct value for a hybrid vehicle with 100% highway driving", async () => {
		const dummyHybridVehicle100Highway = {
			type: "hybrid",
			usage: { percentHighway: 100, percentCity: 0 } as unknown as Usage,
			hybridVehicleData: dummyHybridVehicleData,
		};

		const result = await calcAvgFuelCostPerMileDollars(
			dummyHybridVehicle100Highway as unknown as Vehicle
		);

		expect(result).toBe(0.047);
	});

	it("[13] Returns the correct value for a hybrid vehicle with 100% electric driving", async () => {
		const dummyHybridVehicle100Electric = {
			type: "hybrid",
			usage: { percentHighway: 40 } as unknown as Usage,
			hybridVehicleData: {
				...dummyHybridVehicleData,
				percentElectricDriving: 100,
			},
		};

		const result = await calcAvgFuelCostPerMileDollars(
			dummyHybridVehicle100Electric as unknown as Vehicle
		);

		// When 100% electric, only the electric portion is used
		expect(result).toBe(0.034);
	});

	it("[14] Returns the correct value for a hybrid vehicle with 0% electric driving", async () => {
		const dummyHybridVehicle0Electric = {
			type: "hybrid",
			usage: { percentHighway: 40 } as unknown as Usage,
			hybridVehicleData: {
				...dummyHybridVehicleData,
				percentElectricDriving: 0,
			},
		};

		const result = await calcAvgFuelCostPerMileDollars(
			dummyHybridVehicle0Electric as unknown as Vehicle
		);

		// When 0% electric, only the gas portion is used
		expect(result).toBe(0.066);
	});
});
