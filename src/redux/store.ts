// README
// Per the Redux docs https://redux.js.org/usage/nextjs -- to be more compatible with Next, this creates and returns a new store for every request. This is to synthesize better with RSC etc.
// NOTE that any component that interacts with the store must be a client component.

import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "../redux/reducers/dummyReducer";

export const makeStore = () => {
	return configureStore({
		reducer: {
			// DUMMY REDUCER FOR TESTING, DELETE LATER
			counter: counterReducer,
		},
	});
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
