// README
// This is (obviously) a test file for calcAvgFuelCostPerMile.ts
// It takes in a Vehicle that is either type GasVehicle or ElectricVehicle and calculates either the cost per mile of gas or electricity

import { calcAvgFuelCostPerMileDollars } from "@/app/utils/CarCostAlgorithm/calcAvgFuelCostPerMileDollars";
import { Vehicle } from "@/app/utils/server/types/VehicleTypes/GetVehicleTypes";
import {
	ElectricVehicleData,
	GasVehicleData,
	Usage,
} from "@/app/utils/server/types/VehicleTypes/VehicleSubSchemas";

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
	// electricRangeMiles doesn't actually get used
	electricRangeMiles: 200,
};

// Only passing in needed types for the test
// No type casting, will type assert it when passing it in to function to keep this TS butchery narrow
const dummyElectricVehicle = {
	type: "electric",
	usage: { percentHighway: 30 } as unknown as Usage,
	electricVehicleData: dummyElectricVehicleData,
};

describe("Sanity check", () => {
	it("[1] Reality is still real. If this fails you have bigger problems than this test", () => {
		expect(1).toBe(1);
	});
});

describe("calcAvgFuelCostPerMile", () => {
	it("[1] Runs without errors with a gas vehicle", () => {
		calcAvgFuelCostPerMileDollars(dummyGasVehicle as unknown as Vehicle);
	});

	it("[2] Runs without errors with an electric vehicle", () => {
		calcAvgFuelCostPerMileDollars(dummyElectricVehicle as unknown as Vehicle);
	});

	it("[3] Returns the correct value for a gas vehicle", () => {
		const result = calcAvgFuelCostPerMileDollars(
			dummyGasVehicle as unknown as Vehicle
		);

		expect(result).toBe(0.152);
	});

	it("[4] Returns the correct value for an electric vehicle", () => {
		const result = calcAvgFuelCostPerMileDollars(
			dummyElectricVehicle as unknown as Vehicle
		);

		expect(result).toBe(0.029);
	});

	// This should never happen because TS will prevent it, but doesn't hurt to check
	it("[5] Throws an error if the vehicle type is neither gas nor electric", () => {
		const dummyVehicle = {
			type: "neither",
			usage: { percentHighway: 30, percentCity: 70 } as unknown as Usage,
			electricVehicleData: dummyElectricVehicleData,
		};

		expect(() =>
			calcAvgFuelCostPerMileDollars(dummyVehicle as unknown as Vehicle)
		).toThrow();
	});

	it("[6] Returns the correct value for a gas vehicle with 100% city driving", () => {
		const dummyGasVehicle100City = {
			type: "gas",
			usage: { percentHighway: 0, percentCity: 100 } as unknown as Usage,
			gasVehicleData: dummyGasVehicleData,
		};

		const result = calcAvgFuelCostPerMileDollars(
			dummyGasVehicle100City as unknown as Vehicle
		);

		expect(result).toBe(0.175);
	});

	it("[7] Returns the correct value for a gas vehicle with 100% highway driving", () => {
		const dummyGasVehicle100Highway = {
			type: "gas",
			usage: { percentHighway: 100, percentCity: 0 } as unknown as Usage,
			gasVehicleData: dummyGasVehicleData,
		};

		const result = calcAvgFuelCostPerMileDollars(
			dummyGasVehicle100Highway as unknown as Vehicle
		);

		expect(result).toBe(0.117);
	});

	// Algorithm actually doesn't distinguish between fuel efficiency in city vs highway for EVs so this shouldn't matter
	it("[8] Returns the correct value for an electric vehicle with 100% city driving", () => {
		const dummyElectricVehicle100City = {
			type: "electric",
			usage: { percentHighway: 0, percentCity: 100 } as unknown as Usage,
			electricVehicleData: dummyElectricVehicleData,
		};

		const result = calcAvgFuelCostPerMileDollars(
			dummyElectricVehicle100City as unknown as Vehicle
		);

		expect(result).toBe(0.029);
	});

	// Algorithm actually doesn't distinguish between fuel efficiency in city vs highway for EVs so this shouldn't matter
	it("[9] Returns the correct value for an electric vehicle with 100% highway driving", () => {
		const dummyElectricVehicle100Highway = {
			type: "electric",
			usage: { percentHighway: 100, percentCity: 0 } as unknown as Usage,
			electricVehicleData: dummyElectricVehicleData,
		};

		const result = calcAvgFuelCostPerMileDollars(
			dummyElectricVehicle100Highway as unknown as Vehicle
		);

		expect(result).toBe(0.029);
	});

	// This should never happen because zod will prevent it, but doesn't hurt to check
	it("[10] Throws or handles invalid usage (e.g. < 0 or > 100)", () => {
		const invalidUsageVehicle = {
			type: "gas",
			usage: { percentHighway: 120, percentCity: -20 } as unknown as Usage,
			gasVehicleData: dummyGasVehicleData,
		};
		expect(() =>
			calcAvgFuelCostPerMileDollars(invalidUsageVehicle as Vehicle)
		).toThrow();
	});
});
