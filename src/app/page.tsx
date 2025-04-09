// _____________________________________________________________________
// This is the about/landing page
// Has basic info about the app and how to use it
// _____________________________________________________________________

"use client";

import { useAppSelector } from "@/redux/hooks";

export default function Page() {
	const loggedInUser = useAppSelector((state) => state.user.value);
	const isLoggedIn = !!loggedInUser?.id;

	const usersVehicles = useAppSelector((state) => state.vehicles);
	console.log("usersVehicles:", usersVehicles);

	return <main>About!</main>;
}
