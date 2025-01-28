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

		expect(result).toBe(0.109);
	});

	it.only("[4] Returns the correct value for an electric vehicle", () => {
		const result = calcAvgFuelCostPerMileDollars(
			dummyElectricVehicle as unknown as Vehicle
		);

		expect(result).toBe(0.029);
	});
});
