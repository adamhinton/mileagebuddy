// README:
// This is the meat and potatoes of the whole project
// User enters data about their vehicle, then we calculate how their cost per mile
// Can have multiple vehicles

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Vehicle } from "@/zod/schemas/VehicleSchema";

type VehiclesState = Vehicle[];

const initialState: VehiclesState = [];

// vehicles reducer
const vehiclesSlice = createSlice({
	name: "vehicles",
	initialState: initialState,
	reducers: {
		addVehicle: (state, action: PayloadAction<Vehicle>) => {
			state.push(action.payload);
		},
		removeOneVehicle: (state, action: PayloadAction<number>) => {
			state.splice(action.payload, 1);
		},
		setVehicles: (state, action: PayloadAction<Vehicle[]>) => {
			state.length = 0;
			state.push(...action.payload);
		},
		removeAllVehicles: (state) => {
			state.length = 0;
		},
	},
});

export const { addVehicle, removeOneVehicle, setVehicles, removeAllVehicles } =
	vehiclesSlice.actions;
export default vehiclesSlice.reducer;

export const dummyVehicle: Vehicle = {
	vehicleName: "My Car",
	year: 2021,
	make: "Toyota",
	model: "Corolla",
	gasCostPerGallon: 3.0,
	milesPerGallon: 30,
	yearlyMaintenanceCost: 1000,
	yearlyInsuranceCost: 1000,
	yearlyRegistrationCost: 100,
	yearlyTaxes: 100,
	yearlyDepreciation: 5000,
	monthlyPayments: 0,
	monthlyParkingCosts: 0,
	monthlyTolls: 0,
	monthlyCarWashes: 0,
	miscellaneousMonthlyCosts: 0,
};
