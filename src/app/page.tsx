// _____________________________________________________________________
// This is the root URL (/)
// All it does is push the user to the about page, or dashboard if they're already logged in and have Vehicles
// TODO Stretch put this routing logic in middleware, I just did it this way because I was tired
// _____________________________________________________________________

"use client";

import { useAppSelector } from "@/redux/hooks";
import { useRouter } from "next/navigation";

export default function Page() {
	const loggedInUser = useAppSelector((state) => state.user.value);
	const isLoggedIn = !!loggedInUser?.id;

	const usersVehicles = useAppSelector((state) => state.vehicles);

	const router = useRouter();

	if (!isLoggedIn) {
		router.push("/about");
	}

	if (!usersVehicles || usersVehicles.length === 0) {
		router.push("/about");
	}

	if (usersVehicles.length > 0) {
		router.push("/dashboard");
	}

	return <main></main>;
}
