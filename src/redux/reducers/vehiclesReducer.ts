// README:
// This is the meat and potatoes of the whole project
// User enters data about their vehicle, then we calculate how their cost per mile
// Can have multiple vehicles

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
	Vehicles,
	Vehicle,
} from "@/app/utils/server/types/VehicleTypes/GetVehicleTypes";

// const mockVehicles: Vehicles = [
// 	{
// 		type: "gas",
// 		userid: 1,
// 		vehiclesOrder: 1,
// 		id: 1,
// 		vehicleData: {
// 			vehicleName: "Tesla Model 3",
// 			vehicleID: 1,
// 			year: 2020,
// 			make: "Tesla",
// 			model: "Model 3",
// 			trim: "Base",
// 			highwayMPG: 35.5,
// 		},
// 		gasVehicleData: {
// 			vehicleID: 1,
// 			gasCostPerGallon: 3.5,
// 			milesPerGallonHighway: 35.5,
// 			milesPerGallonCity: 35.5,
// 		},
// 		purchaseAndSales: {
// 			vehicleID: 1,
// 			yearPurchased: 2020,
// 			purchasePrice: 22000.0,
// 			downPaymentAmount: 2000.0,
// 			willSellCarAfterYears: 5,
// 			milesBoughtAt: 10000,
// 			willSellCarAtMiles: 80000,
// 			willSellCarAtPrice: 12000.0,
// 		},
// 		usage: {
// 			vehicleID: 1,
// 			averageDailyMiles: 100,
// 			weeksPerYear: 52,
// 			percentHighway: 0.5,
// 			extraDistanceMiles: 0,
// 			extraDistancePercentHighway: 0,
// 		},
// 		fixedCosts: {
// 			vehicleID: 1,
// 			yearlyInsuranceCost: 1000.0,
// 			yearlyRegistrationCost: 100.0,
// 			yearlyTaxes: 100.0,
// 			monthlyLoanPayment: 300.0,
// 			monthlyWarrantyCost: 30.0,
// 			inspectionCost: 100.0,
// 			otherYearlyCosts: 300.0,
// 		},
// 		yearlyMaintenanceCosts: {
// 			vehicleID: 1,
// 			oilChanges: 100.0,
// 			tires: 200.0,
// 			batteries: 300.0,
// 			brakes: 100.0,
// 			other: 100.0,
// 		},
// 		variableCosts: {
// 			vehicleID: 1,
// 			monthlyParkingCosts: 100.0,
// 			monthlyTolls: 50.0,
// 			monthlyCarWashCost: 20.0,
// 			monthlyMiscellaneousCosts: 50.0,
// 			monthlyCostDeductions: 80.0,
// 		},
// 		electricVehicleData: null,
// 	},
// ];

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
