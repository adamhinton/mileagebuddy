// README:
// This is the meat and potatoes of the whole project
// User enters data about their vehicle, then we calculate how their cost per mile
// Can have multiple vehicles

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
	Vehicles,
	Vehicle,
} from "@/app/utils/server/types/VehicleTypes/GetVehicleTypes";

const initialState: Vehicles = [];

// vehicles reducer
const vehiclesSlice = createSlice({
	name: "vehicles",
	initialState: initialState,
	reducers: {
		// Zod should have already validated vehicle here in the create vehicle form component
		addVehicle: (state, action: PayloadAction<Vehicle>) => {
			state.push(action.payload);
		},
		removeVehicleById: (state, action: PayloadAction<number>) => {
			const vehicleIndex = state.findIndex((v) => v.id === action.payload);
			if (vehicleIndex !== -1) {
				state.splice(vehicleIndex, 1);
			} else {
				console.error("Vehicle not found in state");
			}
		},
		// Zod should have already validated these vehicles when getting them from the db
		setVehicles: (state, action: PayloadAction<Vehicle[]>) => {
			state.length = 0;
			state.push(...action.payload);
		},
		removeAllVehicles: (state) => {
			state.length = 0;
		},
		editVehicleById: (state, action: PayloadAction<{ vehicle: Vehicle }>) => {
			// find vehicle with relevant id and edit it

			const { vehicle } = action.payload;
			const vehicleIndex = state.findIndex((v) => v.id === vehicle.id);
			if (vehicleIndex !== -1) {
				state[vehicleIndex] = vehicle;
			} else {
				console.error("Vehicle not found in state");
			}

			console.log("state:", state);
		},
	},
});

export const {
	addVehicle,
	removeVehicleById,
	setVehicles,
	removeAllVehicles,
	editVehicleById,
} = vehiclesSlice.actions;
export default vehiclesSlice.reducer;
