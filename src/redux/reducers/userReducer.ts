// README:
// I didn't think it was necessary to include the user's trips and vehicles here, because they are defined in the tripReducer and vehicleReducer respectively.
// Have to make sure that when a user is logged out etc, we also scrub the trips and vehicles from the store.

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
	id: number | null;
	name: string | null;
	email: string | null;
}

const initialState: UserState = {
	id: null,
	name: null,
	email: null,
};

const userSlice = createSlice({
	name: "user",
	initialState,
	reducers: {
		setUser: (state, action: PayloadAction<UserState>) => {
			state.id = action.payload.id;
			state.name = action.payload.name;
			state.email = action.payload.email;
		},
		clearUser: (state) => {
			state.id = null;
			state.name = null;
			state.email = null;
		},
	},
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
