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

const fakeUser: User = {
	id: "1",
	isDarkMode: true,
	email: "testuser@example.com",
};

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
