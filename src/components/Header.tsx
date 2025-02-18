"use client";

// basic Header to go at top of application
// Make sure it fits with styling I've already used in this project
// Should include ThemeSwitch which I've defined elsewhere
// Use dark and light mode functionality

import React from "react";
import ThemeSwitch from "./ThemeSwitch";
import { createClientCSROnly } from "@/app/utils/server/supabase/client";
import { useAppSelector } from "@/redux/hooks";
import Link from "next/link";

export const Header: React.FC = () => {
	const user = useAppSelector((state) => state.user.value);
	console.log("redux user in Header:", user);

	return (
		<header className="bg-white dark:bg-slate-800 p-4 flex justify-between items-center">
			<h1 className="text-2xl bg-white text-black dark:bg-black dark:text-white ">
				Trip Planner
			</h1>
			{/* Just for testing */}
			<h2>{user ? "Logged in" : "Not logged in "}</h2>
			<button
				className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4"
				onClick={async () => {
					const supabase = createClientCSROnly();
					// Also triggers redux store to update via <AuthWatcher/>
					const { error } = await supabase.auth.signOut();
					if (!error) {
						console.log("Logged out");
					} else {
						console.error("Error logging out:", error.message);
					}
				}}
			>
				Sign Out
			</button>
			<nav className="flex space-x-4">
				<Link href="/dashboard">Dashboard</Link>
				<Link href="/login">Login</Link>
				<Link href="/calculator">Calculator</Link>">
			</nav>
			<ThemeSwitch />
		</header>
	);
};
