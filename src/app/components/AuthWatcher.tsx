"use client";

// README
// This component exists solely to watch for auth events (login, logout etc) and update Redux state
// There is no UI here, so it doesn't return anything

import { useAppDispatch } from "@/redux/hooks";
import { createClientCSROnly } from "../utils/server/supabase/client";
import { clearUser, setUser } from "@/redux/reducers/userReducer";
import { useEffect } from "react";
import { removeAllVehicles } from "@/redux/reducers/vehiclesReducer";

const AuthWatcher = () => {
	const supabase = createClientCSROnly();
	const dispatch = useAppDispatch();

	useEffect(() => {
		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange((event, session) => {
			if (event === "SIGNED_IN") {
				// Handle sign in event
				console.log(
					"User signed in in AuthWatcher useEffect. User:",
					session!.user
				);
				dispatch(
					setUser({
						id: session!.user.id,
						email: session!.user.email!,
						isDarkMode: false,
					})
				);
				// TODO: Get vehicles from db; set vehicles
			} else if (event === "SIGNED_OUT") {
				// Handle sign out event
				console.log("User signed out");
				dispatch(clearUser());
				dispatch(removeAllVehicles());
				// TODO: Clear vehicles
			} else if (event === "TOKEN_REFRESHED") {
				// Handle token refresh event
				console.log("Token refreshed:", session);
			} else if (event === "USER_UPDATED") {
				// Handle user update event
				console.log("User updated:", session);
			} else if (event === "PASSWORD_RECOVERY") {
				// Handle password recovery event
				console.log("Password recovery event", session);
			} else if (event === "INITIAL_SESSION") {
				// INITIAL_SESSION is page first loading, among other things
				console.log("INITIAL SESSION");
				// Handle initial session event
			}
		});

		// Unsubscribe from the listener when the component unmounts
		return () => {
			subscription.unsubscribe();
		};
	}, [supabase.auth, dispatch]);

	// Has to return something or TS yells at me where this is called in layout.tsx
	return <></>;
};

export default AuthWatcher;
