// README
// Fake redux store Provider that follows setup of my real store. Complete with fake user and vehicle data, one user and five vehicles.
import React, { ReactNode } from "react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./reducers/userReducer";
import vehiclesReducer from "./reducers/vehiclesReducer";
import isDarkModeReducer from "@/redux/reducers/darkModeReducer";
import { RootState } from "@/redux/store";
import { User } from "@/app/zod/schemas/UserSchema";
import { Vehicle } from "@/app/utils/server/types/VehicleTypes/GetVehicleTypes";

const fakeUser: User = {
	id: "1",
	isDarkMode: true,
	email: "testuser@example.com",
};

const testVehicles: Vehicle[] = [
	// Gas Vehicle 1
	{
		id: 101,
		userid: "b1b2b3b4-1234-5678-9abc-def012345678",
		vehiclesOrder: 1,
		type: "gas",
		vehicleData: {
			vehicleID: 101,
			vehicleName: "Ford F-150",
			year: 2018,
			make: "Ford",
			model: "F-150",
			trim: "XLT",
			highwayMPG: 20,
		},
		purchaseAndSales: {
			vehicleID: 101,
			yearPurchased: 2018,
			purchasePrice: 30000,
			downPaymentAmount: 5000,
			willSellCarAfterYears: 7,
			milesBoughtAt: 15000,
			willSellCarAtMiles: 150000,
			willSellCarAtPrice: 15000,
		},
		usage: {
			vehicleID: 101,
			averageDailyMiles: 50,
			weeksPerYear: 50,
			percentHighway: 60,
			extraDistanceMiles: 10,
			extraDistancePercentHighway: 70,
		},
		fixedCosts: {
			vehicleID: 101,
			yearlyInsuranceCost: 1200,
			yearlyRegistrationCost: 150,
			yearlyTaxes: 250,
			monthlyLoanPayment: 350,
			monthlyWarrantyCost: 50,
			inspectionCost: 100,
			otherYearlyCosts: 200,
		},
		yearlyMaintenanceCosts: {
			vehicleID: 101,
			oilChanges: 150,
			tires: 400,
			batteries: 0,
			brakes: 300,
			other: 100,
		},
		variableCosts: {
			vehicleID: 101,
			monthlyParkingCosts: 0,
			monthlyTolls: 20,
			monthlyCarWashCost: 15,
			monthlyMiscellaneousCosts: 40,
			monthlyCostDeductions: 0,
		},
		gasVehicleData: {
			vehicleID: 101,
			gasCostPerGallon: 3.5,
			milesPerGallonHighway: 20,
			milesPerGallonCity: 15,
		},
		electricVehicleData: null,
	},

	// Gas Vehicle 2
	{
		id: 102,
		userid: "c2c3c4c5-2345-6789-abcd-ef0123456789",
		vehiclesOrder: 2,
		type: "gas",
		vehicleData: {
			vehicleID: 102,
			vehicleName: "Toyota Camry",
			year: 2020,
			make: "Toyota",
			model: "Camry",
			trim: "SE",
			highwayMPG: 32,
		},
		purchaseAndSales: {
			vehicleID: 102,
			yearPurchased: 2020,
			purchasePrice: 25000,
			downPaymentAmount: 3000,
			willSellCarAfterYears: 5,
			milesBoughtAt: 12000,
			willSellCarAtMiles: 120000,
			willSellCarAtPrice: 10000,
		},
		usage: {
			vehicleID: 102,
			averageDailyMiles: 30,
			weeksPerYear: 48,
			percentHighway: 50,
			extraDistanceMiles: 5,
			extraDistancePercentHighway: 60,
		},
		fixedCosts: {
			vehicleID: 102,
			yearlyInsuranceCost: 1000,
			yearlyRegistrationCost: 180,
			yearlyTaxes: 220,
			monthlyLoanPayment: 300,
			monthlyWarrantyCost: 40,
			inspectionCost: 80,
			otherYearlyCosts: 150,
		},
		yearlyMaintenanceCosts: {
			vehicleID: 102,
			oilChanges: 120,
			tires: 350,
			batteries: 0,
			brakes: 250,
			other: 120,
		},
		variableCosts: {
			vehicleID: 102,
			monthlyParkingCosts: 0,
			monthlyTolls: 10,
			monthlyCarWashCost: 20,
			monthlyMiscellaneousCosts: 30,
			monthlyCostDeductions: 0,
		},
		gasVehicleData: {
			vehicleID: 102,
			gasCostPerGallon: 3.6,
			milesPerGallonHighway: 32,
			milesPerGallonCity: 24,
		},
		electricVehicleData: null,
	},

	// Electric Vehicle 1
	{
		id: 201,
		userid: "d3d4d5d6-3456-789a-bcde-f123456789ab",
		vehiclesOrder: 3,
		type: "electric",
		vehicleData: {
			vehicleID: 201,
			vehicleName: "Tesla Model 3",
			year: 2021,
			make: "Tesla",
			model: "Model 3",
			trim: "Long Range",
			highwayMPG: 130, // Approximate MPGe for highways
		},
		purchaseAndSales: {
			vehicleID: 201,
			yearPurchased: 2021,
			purchasePrice: 45000,
			downPaymentAmount: 5000,
			willSellCarAfterYears: 6,
			milesBoughtAt: 8000,
			willSellCarAtMiles: 100000,
			willSellCarAtPrice: 20000,
		},
		usage: {
			vehicleID: 201,
			averageDailyMiles: 40,
			weeksPerYear: 50,
			percentHighway: 65,
			extraDistanceMiles: 10,
			extraDistancePercentHighway: 70,
		},
		fixedCosts: {
			vehicleID: 201,
			yearlyInsuranceCost: 1100,
			yearlyRegistrationCost: 100,
			yearlyTaxes: 300,
			monthlyLoanPayment: 450,
			monthlyWarrantyCost: 30,
			inspectionCost: 0,
			otherYearlyCosts: 180,
		},
		yearlyMaintenanceCosts: {
			vehicleID: 201,
			oilChanges: 0,
			tires: 300,
			batteries: 0,
			brakes: 200,
			other: 100,
		},
		variableCosts: {
			vehicleID: 201,
			monthlyParkingCosts: 25,
			monthlyTolls: 15,
			monthlyCarWashCost: 0,
			monthlyMiscellaneousCosts: 50,
			monthlyCostDeductions: 0,
		},
		gasVehicleData: null,
		electricVehicleData: {
			vehicleID: 201,
			costPerCharge: 15,
			milesPerCharge: 300,
		},
	},

	// Electric Vehicle 2
	{
		id: 202,
		userid: "e4e5e6e7-4567-89ab-cdef-23456789abcd",
		vehiclesOrder: 4,
		type: "electric",
		vehicleData: {
			vehicleID: 202,
			vehicleName: "Nissan Leaf",
			year: 2019,
			make: "Nissan",
			model: "Leaf",
			trim: "SV",
			highwayMPG: 100, // Approximate MPGe for highways
		},
		purchaseAndSales: {
			vehicleID: 202,
			yearPurchased: 2019,
			purchasePrice: 30000,
			downPaymentAmount: 4000,
			willSellCarAfterYears: 5,
			milesBoughtAt: 10000,
			willSellCarAtMiles: 80000,
			willSellCarAtPrice: 12000,
		},
		usage: {
			vehicleID: 202,
			averageDailyMiles: 35,
			weeksPerYear: 52,
			percentHighway: 55,
			extraDistanceMiles: 7,
			extraDistancePercentHighway: 65,
		},
		fixedCosts: {
			vehicleID: 202,
			yearlyInsuranceCost: 950,
			yearlyRegistrationCost: 130,
			yearlyTaxes: 210,
			monthlyLoanPayment: 320,
			monthlyWarrantyCost: 35,
			inspectionCost: 90,
			otherYearlyCosts: 160,
		},
		yearlyMaintenanceCosts: {
			vehicleID: 202,
			oilChanges: 0,
			tires: 280,
			batteries: 0,
			brakes: 220,
			other: 110,
		},
		variableCosts: {
			vehicleID: 202,
			monthlyParkingCosts: 20,
			monthlyTolls: 12,
			monthlyCarWashCost: 0,
			monthlyMiscellaneousCosts: 35,
			monthlyCostDeductions: 0,
		},
		gasVehicleData: null,
		electricVehicleData: {
			vehicleID: 202,
			milesPerCharge: 250,
			costPerCharge: 10,
		},
	},
];

const preloadedState: RootState = {
	user: {
		value: fakeUser,
	},
	vehicles: testVehicles,
	theme: {
		isDarkMode: false,
	},
};

const store = configureStore({
	reducer: {
		user: userReducer,
		vehicles: vehiclesReducer,
		theme: isDarkModeReducer,
	},
	preloadedState,
});

interface Props {
	children: ReactNode;
}

const TestReduxStore: React.FC<Props> = ({ children }) => {
	return <Provider store={store}>{children}</Provider>;
};

export default TestReduxStore;
