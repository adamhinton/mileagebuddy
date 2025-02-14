// README:
// This is a basic template for now early in the project, will probably flesh out later.
// I didn't think it was necessary to include the user's trips and vehicles here, because they are defined in the tripReducer and vehicleReducer respectively.
// Have to make sure that when a user is logged out etc, we also scrub the trips and vehicles from the store.

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "@/app/zod/schemas/UserSchema";

const initialState: { value?: User } = {
	value: undefined,
};
const userSlice = createSlice({
	name: "user",
	initialState,
	reducers: {
		// TODO: Error handling here
		setUser: (state, action: PayloadAction<User>) => {
			state.value = action.payload;
		},
		clearUser: (state) => {
			state.value = undefined;
		},
	},
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
