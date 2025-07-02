"use client";

// README
// This component exists solely to watch for auth events (login, logout etc) and update Redux state
// It wraps around its children so that the children don't render until the auth state is known
// This component has no UI, it's just a wrapper

import { useAppDispatch } from "@/redux/hooks";
import { createClientCSROnly } from "../utils/server/supabase/client";
import { clearUser, setUser } from "@/redux/reducers/userReducer";
import { ReactNode, useEffect, useState } from "react";
import {
	removeAllVehicles,
	setVehicles,
} from "@/redux/reducers/vehiclesReducer";
import { getVehiclesByUserIDClient } from "../utils/server/client/DBInteractions/VehiclesDBInteractions";
import { redirect } from "next/navigation";
import { removeAllTrips, setTrips } from "@/redux/reducers/tripsReducer";
import { getTripsByUser } from "../utils/server/queries/trips/tripsDBUtils";
import { TripWithID } from "../zod/schemas/trips/TripSchemas/TripSchemaForPatch";

interface AuthWatcherProps {
	children: ReactNode;
}

const AuthWatcher = ({ children }: AuthWatcherProps) => {
	const supabase = createClientCSROnly();
	const dispatch = useAppDispatch();
	const [authInitialized, setAuthInitialized] = useState(false);

	useEffect(() => {
		/**Get user's vehicles from DB and set them to redux state */
		const fetchAndSetVehicles = async (userId: string) => {
			try {
				console.log("userId:", userId);

				// These vehicles are Zod-Validated by this function
				const vehicles = await getVehiclesByUserIDClient(userId);

				// sort by vehiclesOrder, starting at 1
				const vehiclesInOrder = vehicles.sort(
					(a, b) => a.vehiclesOrder - b.vehiclesOrder
				);

				dispatch(setVehicles(vehiclesInOrder));
			} catch (error) {
				console.error("Error fetching vehicles on sign in:", error);
			}
		};

		const fetchAndSetTrips = async (userId: string) => {
			try {
				const trips = await getTripsByUser(supabase, userId);
				dispatch(setTrips(trips as unknown as TripWithID[]));
				// dispatch(setTrips(trips));
			} catch (error) {
				console.error("Error fetching trips on sign in:", error);
			}
		};

		// Check if there's an initial session on first load
		const initializeAuth = async () => {
			const { data } = await supabase.auth.getSession();

			if (data.session) {
				// User is already logged in
				dispatch(
					setUser({
						id: data.session.user.id,
						email: data.session.user.email!,
						isDarkMode: false,
					})
				);
				// await fetchAndSetVehicles(data.session.user.id);
				await fetchAndSetTrips(data.session.user.id);
			}

			// Indicate auth is initialized whether user is logged in or not
			setAuthInitialized(true);
		};

		// Check if there's a logged in user on first load and set them to state if they exist
		initializeAuth();

		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange((event, session) => {
			if (event === "SIGNED_IN") {
				console.log("SIGNED_IN");
				dispatch(
					setUser({
						id: session!.user.id,
						email: session!.user.email!,
						isDarkMode: false,
					})
				);
				fetchAndSetVehicles(session!.user.id);
				redirect("/dashboard");
			} else if (event === "SIGNED_OUT") {
				// Handle sign out event
				console.log("User signed out");
				dispatch(clearUser());
				dispatch(removeAllVehicles());
				dispatch(removeAllTrips());
				redirect("/login");
			} else if (event === "TOKEN_REFRESHED") {
				// Handle token refresh event
				console.log("Token refreshed:", session);
			} else if (event === "USER_UPDATED") {
				// Handle user update event

				dispatch(
					setUser({
						id: session!.user.id,
						email: session!.user.email!,
						isDarkMode: false,
					})
				);

				console.log("User updated:", session);
			} else if (event === "PASSWORD_RECOVERY") {
				// Handle password recovery event
				console.log("Password recovery event", session);
			} else if (event === "INITIAL_SESSION") {
				// INITIAL_SESSION is page first loading, among other things
				console.log("INITIAL SESSION");

				if (!session) {
					return;
				}

				dispatch(
					setUser({
						id: session!.user.id,
						email: session!.user.email!,
						isDarkMode: false,
					})
				);
				fetchAndSetVehicles(session!.user.id);
			}
		});

		// Unsubscribe from the listener when the component unmounts
		return () => {
			subscription.unsubscribe();
		};
	}, [supabase.auth, supabase, dispatch]);

	// Only render children when auth is initialized
	if (!authInitialized) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="text-center">
					<h2 className="text-xl font-semibold mb-2">Loading...</h2>
					<p>Checking authentication status</p>
				</div>
			</div>
		);
	}

	return <>{children}</>;
};

export default AuthWatcher;
