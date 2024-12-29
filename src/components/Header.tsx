"use client";

// basic Header to go at top of application
// Make sure it fits with styling I've already used in this project
// Should include ThemeSwitch which I've defined elsewhere
// Use dark and light mode functionality

import React from "react";
import ThemeSwitch from "./ThemeSwitch";

export const Header: React.FC = () => {
	return (
		<header className="bg-white dark:bg-slate-800 p-4 flex justify-between items-center">
			<h1 className="text-2xl bg-white text-black dark:bg-black dark:text-white ">
				Trip Planner
			</h1>
			<ThemeSwitch />
		</header>
	);
};
