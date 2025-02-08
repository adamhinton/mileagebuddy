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

const fakeVehicles: Vehicle[] = [
	// {
	// 	vehicleName: "Tesla Model 3",
	// 	year: 2022,
	// 	make: "Tesla",
	// 	model: "Model 3",
	// 	gasCostPerGallon: 0,
	// 	milesPerGallon: 0,
	// 	yearlyMaintenanceCost: 300,
	// 	yearlyInsuranceCost: 1200,
	// 	yearlyRegistrationCost: 150,
	// 	yearlyTaxes: 300,
	// 	monthlyPayments: 500,
	// 	monthlyParkingCosts: 100,
	// 	monthlyTolls: 30,
	// 	monthlyCarWashes: 20,
	// 	miscellaneousMonthlyCosts: 10,
	// },
	// {
	// 	vehicleName: "Honda Civic",
	// 	year: 2018,
	// 	make: "Honda",
	// 	model: "Civic",
	// 	gasCostPerGallon: 3.5,
	// 	milesPerGallon: 35,
	// 	yearlyMaintenanceCost: 400,
	// 	yearlyInsuranceCost: 800,
	// 	yearlyRegistrationCost: 120,
	// 	yearlyTaxes: 250,
	// 	monthlyPayments: 350,
	// 	monthlyParkingCosts: 80,
	// 	monthlyTolls: 25,
	// 	monthlyCarWashes: 15,
	// 	miscellaneousMonthlyCosts: 5,
	// },
	// {
	// 	vehicleName: "Ford F-150",
	// 	year: 2020,
	// 	make: "Ford",
	// 	model: "F-150",
	// 	gasCostPerGallon: 3.75,
	// 	milesPerGallon: 18,
	// 	yearlyMaintenanceCost: 500,
	// 	yearlyInsuranceCost: 1000,
	// 	yearlyRegistrationCost: 150,
	// 	yearlyTaxes: 350,
	// 	monthlyPayments: 450,
	// 	monthlyParkingCosts: 150,
	// 	monthlyTolls: 40,
	// 	monthlyCarWashes: 25,
	// 	miscellaneousMonthlyCosts: 20,
	// },
	// {
	// 	vehicleName: "BMW 3 Series",
	// 	year: 2021,
	// 	make: "BMW",
	// 	model: "3 Series",
	// 	gasCostPerGallon: 3.8,
	// 	milesPerGallon: 25,
	// 	yearlyMaintenanceCost: 600,
	// 	yearlyInsuranceCost: 1500,
	// 	yearlyRegistrationCost: 200,
	// 	yearlyTaxes: 400,
	// 	monthlyPayments: 600,
	// 	monthlyParkingCosts: 120,
	// 	monthlyTolls: 35,
	// 	monthlyCarWashes: 30,
	// 	miscellaneousMonthlyCosts: 15,
	// },
	// {
	// 	vehicleName: "Chevrolet Malibu",
	// 	year: 2019,
	// 	make: "Chevrolet",
	// 	model: "Malibu",
	// 	gasCostPerGallon: 3.6,
	// 	milesPerGallon: 30,
	// 	yearlyMaintenanceCost: 350,
	// 	yearlyInsuranceCost: 700,
	// 	yearlyRegistrationCost: 100,
	// 	yearlyTaxes: 200,
	// 	monthlyPayments: 300,
	// 	monthlyParkingCosts: 90,
	// 	monthlyTolls: 20,
	// 	monthlyCarWashes: 18,
	// 	miscellaneousMonthlyCosts: 8,
	// },
];

const preloadedState: RootState = {
	user: fakeUser,
	vehicles: fakeVehicles,
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
