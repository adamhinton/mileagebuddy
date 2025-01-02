"use client";

import ThemeSwitch from "@/components/ThemeSwitch";
import { useAppSelector } from "@/redux/hooks";
import { User } from "@/zod/schemas/UserSchema";
import { createClient } from "@supabase/supabase-js";
import React, { useEffect, useState } from "react";

export default function Page() {
	const [users, setUsers] = useState<User[]>([]);

	useEffect(() => {
		// Define the async function inside useEffect
		const fetchData = async () => {
			const isDev = process.env.NODE_ENV === "development";

			const supabase = createClient(
				process.env.NEXT_PUBLIC_SUPABASE_URL!,
				process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
				{
					global: {
						headers: {
							// Only add the authorization header if we're in development
							...(isDev && { authorization: process.env.NEXT_JWT_SECRET! }),
						},
					},
				}
			);

			const { data, error } = await supabase.from("users").select();
			console.log("data:", data);

			if (error) {
				console.error("Error fetching users:", error);
				return;
			}

			// Ensure we set the users data
			setUsers(data as User[]);
		};

		fetchData();
	}, []); // Dependency array is empty, runs once on mount

	return (
		<div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
			<header className="bg-blue-600 w-full py-4 text-white text-center">
				<h1 className="text-3xl font-bold">MileageBuddy</h1>
				<p className="text-lg">Calculate your car ownership costs easily</p>
			</header>
			<ThemeSwitch />
			<main className="flex flex-col items-center mt-8">
				<div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
					<h2 className="text-2xl font-semibold mb-4">Car Cost Calculator</h2>
					<form className="space-y-4">
						<div>
							<label
								htmlFor="milesPerYear"
								className="block text-sm font-medium text-gray-700"
							>
								Miles per Year
							</label>
							<input
								type="number"
								id="milesPerYear"
								// Assuming you would handle state updates for milesPerYear
								className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
							/>
						</div>
						<button
							type="button"
							// Assuming you would handle button click actions here
							className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
						>
							Calculate
						</button>
					</form>
					{/* Add more UI for calculation */}
				</div>
			</main>
		</div>
	);
}
