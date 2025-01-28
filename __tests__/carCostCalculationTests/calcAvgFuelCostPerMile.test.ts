// README
// This is (obviously) a test file for calcAvgFuelCostPerMile.ts
// It takes in a Vehicle that is either type GasVehicle or ElectricVehicle and calculates either the cost per mile of gas or electricity

import { calcAvgFuelCostPerMile } from "@/app/utils/CarCostAlgorithm/calcAvgFuelCostPerMile";
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
	gasCostPerGallon: 3,
};

// Only passing in needed types for the test
// No type casting, will type assert it when passing it in to function to keep this TS butchery narrow
const dummyGasVehicle = {
	usage: { percentHighway: 0.3 } as unknown as Usage,
	gasVehicleData: dummyGasVehicleData,
};

// Dummy part of a Vehicle with only electricVehicleData
// Only passing in the needed fields
// Will pass this in as the only object in a typecasted Vehicle
const dummyElectricVehicleData: ElectricVehicleData = {
	vehicleID: 1,
	costPerCharge: 3,
	milesPerCharge: 100,
	electricRangeMiles: 200,
};

// Only passing in needed types for the test
// No type casting, will type assert it when passing it in to function to keep this TS butchery narrow
const dummyElectricVehicle = {
	usage: { percentHighway: 0.3 } as unknown as Usage,
	electricVehicleData: dummyElectricVehicleData,
};

describe("calcAvgFuelCostPerMile", () => {
	it("[1] Runs without errors with a gas vehicle", () => {
		calcAvgFuelCostPerMile(dummyGasVehicle as unknown as Vehicle);
	});

	it("[2] Runs without errors with an electric vehicle", () => {
		calcAvgFuelCostPerMile(dummyElectricVehicle as unknown as Vehicle);
	});
});
