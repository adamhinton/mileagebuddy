import { z } from "zod";
// README:
// This is a basic template for now early in the project, will probably flesh out later.
// I didn't think it was necessary to include the user's trips and vehicles here, because they are defined in the tripReducer and vehicleReducer respectively.
// Have to make sure that when a user is logged out etc, we also scrub the trips and vehicles from the store.

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User, UserSchema } from "@/zod/schemas/UserSchema";

// not sure why TS raises a stink about this
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const UserNullableSchema = UserSchema.extend({
	id: z.string().nullable(),
	email: z.string().email().nullable(),
	isDarkMode: z.boolean().nullable(),
});

type UserNullablePreLogin = z.infer<typeof UserNullableSchema>;

const initialState: UserNullablePreLogin = {
	id: null,
	isDarkMode: null,
	email: null,
};

const userSlice = createSlice({
	name: "user",
	initialState,
	reducers: {
		// TODO: Error handling here
		setUser: (state, action: PayloadAction<User>) => {
			state.id = action.payload.id;
			state.isDarkMode = action.payload.isDarkMode;
			state.email = action.payload.email;
		},
		clearUser: (state) => {
			state.id = null;
			state.isDarkMode = null;
			state.email = null;
		},
	},
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
