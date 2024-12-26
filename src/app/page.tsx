"use client";

import React, { useState } from "react";

const Page: React.FC = () => {
	const [milesPerYear, setMilesPerYear] = useState<number>(0);
	const [costPerMile, setCostPerMile] = useState<number>(0);

	const handleCalculate = () => {
		// Placeholder calculation logic
		setCostPerMile(milesPerYear * 0.5);
	};

	// get NextJS children pages

	return (
		<div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
			<header className="bg-blue-600 w-full py-4 text-white text-center">
				<h1 className="text-3xl font-bold">MileageBuddy</h1>
				<p className="text-lg">Calculate your car ownership costs easily</p>
			</header>
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
								value={milesPerYear}
								onChange={(e) => setMilesPerYear(Number(e.target.value))}
								className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
							/>
						</div>
						<button
							type="button"
							onClick={handleCalculate}
							className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
						>
							Calculate
						</button>
					</form>
					{costPerMile > 0 && (
						<div className="mt-4">
							<p className="text-lg">
								Estimated Cost per Mile:{" "}
								<span className="font-bold">${costPerMile.toFixed(2)}</span>
							</p>
						</div>
					)}
				</div>
			</main>
		</div>
	);
};

export default Page;
