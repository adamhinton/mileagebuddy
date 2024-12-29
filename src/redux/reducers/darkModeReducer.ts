import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";

interface IsDarkModeState {
	isDarkMode: boolean;
}

const initialState: IsDarkModeState = {
	isDarkMode: false,
};

export const isDarkModeSlice = createSlice({
	name: "isDarkMode",
	initialState,
	reducers: {
		toggleIsDarkMode: (state) => {
			state.isDarkMode = !state.isDarkMode;
		},
		setIsDarkMode: (state, action: PayloadAction<boolean>) => {
			state.isDarkMode = action.payload;
		},
	},
});

export const { toggleIsDarkMode, setIsDarkMode } = isDarkModeSlice.actions;

export const selectIsDarkMode = (state: RootState) => state.theme.isDarkMode;

export default isDarkModeSlice.reducer;
