// README
// Per the Redux docs https://redux.js.org/usage/nextjs -- to be more compatible with Next, this creates and returns a new store for every request. This is to synthesize better with RSC etc.

import { configureStore } from "@reduxjs/toolkit";

export const makeStore = () => {
	return configureStore({
		reducer: {},
	});
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
