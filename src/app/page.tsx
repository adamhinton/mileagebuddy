// _____________________________________________________________________
// This is the root URL (/)
// All it does is push the user to the about page, or dashboard if they're already logged in and have Vehicles
// TODO Stretch put this routing logic in middleware, I just did it this way because I was tired
// _____________________________________________________________________

"use client";

import { useAppSelector } from "@/redux/hooks";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Page() {
	const loggedInUser = useAppSelector((state) => state.user.value);
	const isLoggedIn = !!loggedInUser?.id;

	const usersVehicles = useAppSelector((state) => state.vehicles);

	const router = useRouter();

	useEffect(() => {
		if (!isLoggedIn) {
			router.replace("/about");
			return;
		}

		if (!usersVehicles || usersVehicles.length === 0) {
			router.replace("/about");
			return;
		}

		router.replace("/dashboard");
	}, [isLoggedIn, router, usersVehicles]);

	return <main></main>;
}
