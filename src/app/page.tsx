"use client";

import { User } from "@/zod/schemas/UserSchema";
// import ThemeSwitch from "@/components/ThemeSwitch";
// import { useAppSelector } from "@/redux/hooks";
import { createClient } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
// README:
// This is a dummy HTML setup written by Copilot to give me something to bounce off of early in dev, will be replaced with my own design later.

// import React, { useState } from "react";
// import { createClient } from "../../supabase/supabaseutils";

export default function Page() {
	const [users, setUsers] = useState<User[]>([]);

	useEffect(() => {
		const fetchData = async () => {
			// Determine if we're in development mode
			const isDev = process.env.NODE_ENV === "development";

			const supabase = createClient(
				process.env.NEXT_PUBLIC_SUPABASE_URL!,
				process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
				{
					global: {
						headers: {
							// Only add the authorization header if we're in development
							// It's not needed in prod and would actively sabotage our prod API calls
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

			setUsers(data);
		};

		fetchData();
	}, []);

	// const Page: React.FC = () => {
	// 	const initialState = useAppSelector((state) => state.theme.isDarkMode);
	// 	console.log("initialState:", initialState);

	// 	const [milesPerYear, setMilesPerYear] = useState<number>(0);
	// 	const [costPerMile, setCostPerMile] = useState<number>(0);

	// 	const handleCalculate = () => {
	// 		// Placeholder calculation logic
	// 		setCostPerMile(milesPerYear * 0.5);
	// 	};

	// 	// get NextJS children pages

	return (
		<div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
			<header className="bg-blue-600 w-full py-4 text-white text-center">
				<h1 className="text-3xl font-bold">MileageBuddy</h1>
				<p className="text-lg">Calculate your car ownership costs easily</p>
			</header>
			{/* <ThemeSwitch /> */}
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
								// value={milesPerYear}
								// onChange={(e) => setMilesPerYear(Number(e.target.value))}
								className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
							/>
						</div>
						<button
							type="button"
							// onClick={handleCalculate}
							className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
						>
							Calculate
						</button>
					</form>
					{/* {costPerMile > 0 && (
            <div className="mt-4">
              <p className="text-lg">
                Estimated Cost per Mile:{" "}
                <span className="font-bold">${costPerMile.toFixed(2)}</span>
              </p>
            </div>
          )} */}
				</div>
			</main>

			<section className="mt-8 w-full max-w-md">
				<h2 className="text-xl font-semibold">Fetched User Data</h2>
				<pre>{JSON.stringify(users, null, 2)}</pre>
			</section>
		</div>
	);
}

// export default Page;
