// README
// Fake redux store Provider that follows setup of my real store. Complete with fake user and vehicle data, one user and five vehicles.
import React, { ReactNode } from "react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../../../redux/reducers/userReducer";
import vehiclesReducer from "../../../redux/reducers/vehiclesReducer";
import isDarkModeReducer from "@/redux/reducers/darkModeReducer";
import { RootState } from "@/redux/store";
import { User } from "@/app/zod/schemas/UserSchema";
import testVehicles from "./fakeTestVehicles";
import { Vehicle } from "../server/types/VehicleTypes/GetVehicleTypes";

const fakeUser: User = {
	id: "1",
	isDarkMode: true,
	email: "testuser@example.com",
};

// Function to create a store with custom or default vehicles list
const createTestStore = (customVehicles?: Vehicle[]) => {
	const customPreloadedState: RootState = {
		user: {
			value: fakeUser,
		},
		// Either uses a vehicle list that is passed in, or the default test vehicles
		vehicles: customVehicles || testVehicles,
		theme: {
			isDarkMode: false,
		},
	};

	return configureStore({
		reducer: {
			user: userReducer,
			vehicles: vehiclesReducer,
			theme: isDarkModeReducer,
		},
		preloadedState: customPreloadedState,
	});
};

// Default store with test vehicles
const defaultStore = createTestStore();

interface Props {
	children: ReactNode;
	vehicles?: typeof testVehicles;
}

/**Dummy redux store for testing
 * Either uses a vehicle list that is passed in, or the default test vehicles
 */
const TestReduxStore: React.FC<Props> = ({ children, vehicles }) => {
	const store = vehicles ? createTestStore(vehicles) : defaultStore;
	return <Provider store={store}>{children}</Provider>;
};

export default TestReduxStore;
