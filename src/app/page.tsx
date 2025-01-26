"use client";

import { User } from "@/app/zod/schemas/UserSchema";
import { useEffect, useState } from "react";
import { Tables } from "../../database.types";
import {
	Vehicle,
	Vehicles,
} from "./utils/server/types/VehicleTypes/GetVehicleTypes";
import { Vehicle_For_db_POST } from "./utils/server/types/VehicleTypes/POSTVehicleTypes";
// README:
// This is a dummy HTML setup written by Copilot to give me something to bounce off of early in dev, will be replaced with my own design later.

// TODO: Add this to app
//supabase.com/dashboard/project/kqnhzwgaypywymhqfbgd/settings/api?showConnect=true

const mockVehicle: Vehicle_For_db_POST = {
	type: "gas",
	userid: 1,
	vehiclesOrder: 1,
	vehicleData: {
		vehicleName: "Tesla Model 3",
		year: 2020,
		make: "Tesla",
		model: "Model 3",
		trim: "Base",
		highwayMPG: 35.5,
	},
	gasVehicleData: {
		gasCostPerGallon: 3.5,
		milesPerGallonHighway: 35.5,
		milesPerGallonCity: 35.5,
	},
	purchaseAndSales: {
		yearPurchased: 2020,
		purchasePrice: 22000.0,
		downPaymentAmount: 2000.0,
		willSellCarAfterYears: 5,
		milesBoughtAt: 70000,
		willSellCarAtMiles: 80000,
		willSellCarAtPrice: 12000.0,
	},
	usage: {
		averageDailyMiles: 100,
		weeksPerYear: 52,
		percentHighway: 0.5,
		extraDistanceMiles: 0,
		extraDistancePercentHighway: 4,
	},
	fixedCosts: {
		yearlyInsuranceCost: 1000.0,
		yearlyRegistrationCost: 100.0,
		yearlyTaxes: 100.0,
		monthlyLoanPayment: 300.0,
		monthlyWarrantyCost: 30.0,
		inspectionCost: 100.0,
		otherYearlyCosts: 300.0,
		yearlyParkingCost: 100.0,
	},
	yearlyMaintenanceCosts: {
		oilChanges: 100.0,
		tires: 200.0,
		batteries: 300.0,
		brakes: 100.0,
		other: 100.0,
		depreciation: 800.0,
	},
	variableCosts: {
		monthlyParkingCosts: 100.0,
		monthlyTolls: 50.0,
		monthlyCarWashCost: 20.0,
		monthlyMiscellaneousCosts: 50.0,
		monthlyCostDeductions: 80.0,
	},
	electricVehicleData: null,
};

export default function Page() {
	const [users, setUsers] = useState<User[]>([]);

	useEffect(() => {
		console.log("Start useEffect");
		// const safeParsed = VehicleToBePostedSchema.safeParse(mockVehicle);
		// console.log("safeParsed:", safeParsed);

		const fetchData = async () => {
			try {
				const res = await fetch("/api/user?id=3");
				const data = await res.json();
				const fetchedUsers: User[] = data;
				setUsers(fetchedUsers);
			} catch (error) {
				return error;
			}
		};

		// This is a dummy fxn for testing, for now
		const fetchUserByID = async (id: string) => {
			try {
				const res = await fetch(`api/user?id=${id}`);
				const data = await res.json();
				const fetchedUser: Tables<"users"> = data;
				console.log("fetchedUser:", fetchedUser);
				// eslint-disable-next-line @typescript-eslint/no-unused-vars
			} catch (error) {
				// console.error("Error fetching single user in page.tsx:", error);
			}
		};

		fetchUserByID("1");

		fetchData();

		console.log("End useEffect");
	}, []);

	console.log("users:", users);

	return (
		<div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center dark: bg-bl">
			{/* dummy button to POST api/vehicles with mockVehicle */}

			{/* PATCH api/vehicles with dummy Vehicle */}
			<button
				onClick={async () => {
					const partialMockVehicle: Partial<Vehicle> = {
						type: "gas",
						userid: 1,
						vehiclesOrder: 20,
						vehicleData: {
							vehicleID: 1,
							vehicleName: "Hooba Stank",
							year: 2042,
							make: "fsdafasfsa",
							model: "fsdfasfsa",
							trim: "fsdfasfsa",
							highwayMPG: 343.5,
						},
					};

					const res = await fetch("api/vehicles?vehicleid=1", {
						method: "PATCH",
						body: JSON.stringify(partialMockVehicle),
					});
					const data = await res.json();
					console.log("data from PATCH vehicles:", data);
				}}
			>
				PATCH vehicle
			</button>

			<button
				onClick={async () => {
					console.log("blah blah blah");

					const completeMockVehicle = {
						type: "gas",
						userid: 1,
						vehiclesOrder: 1,
						vehicleData: {
							vehicleName: "Tesla Model 3",
							year: 2020,
							make: "Tesla",
							model: "Model 3",
							trim: "Base",
							highwayMPG: 35.5,
						},
						gasVehicleData: {
							gasCostPerGallon: 3.5,
							milesPerGallonHighway: 35.5,
							milesPerGallonCity: 35.5,
						},
						purchaseAndSales: {
							yearPurchased: 2020,
							purchasePrice: 22000.0,
							downPaymentAmount: 2000.0,
							willSellCarAfterYears: 5,
							milesBoughtAt: 10000,
							willSellCarAtMiles: 80000,
							willSellCarAtPrice: 12000.0,
						},
						usage: {
							averageDailyMiles: 100,
							weeksPerYear: 52,
							percentHighway: 0.5,
							extraDistanceMiles: 0,
							extraDistancePercentHighway: 0,
						},
						fixedCosts: {
							yearlyInsuranceCost: 1000.0,
							yearlyRegistrationCost: 100.0,
							yearlyTaxes: 100.0,
							monthlyLoanPayment: 300.0,
							monthlyWarrantyCost: 30.0,
							inspectionCost: 100.0,
							yearlyParkingCost: 100.0,
							otherYearlyCosts: 300.0,
						},
						yearlyMaintenanceCosts: {
							oilChanges: 100.0,
							tires: 200.0,
							batteries: 300.0,
							brakes: 100.0,
							other: 100.0,
							depreciation: 800.0,
						},
						variableCosts: {
							monthlyParkingCosts: 100.0,
							monthlyTolls: 50.0,
							monthlyCarWashCost: 20.0,
							monthlyMiscellaneousCosts: 50.0,
							monthlyCostDeductions: 80.0,
						},
						electricVehicleData: null,
					};

					const vehicleWithNullGasVehicleData = {
						userid: 1,
						type: "gas",
						vehiclesOrder: 1,
						vehicleData: { ...completeMockVehicle.vehicleData },
						electricVehicleData: null,
						gasVehicleData: null,
						purchaseAndSales: { ...completeMockVehicle.purchaseAndSales },
						usage: { ...completeMockVehicle.usage },
						yearlyMaintenanceCosts: {
							...completeMockVehicle.yearlyMaintenanceCosts,
						},
						variableCosts: { ...completeMockVehicle.variableCosts },
						fixedCosts: { ...completeMockVehicle.fixedCosts },
					};

					// checkZodClient(mockVehicle);
					const res = await fetch("api/vehicles", {
						method: "POST",
						body: JSON.stringify(vehicleWithNullGasVehicleData),
					});
					const data = await res.json();
					console.log("data from POST vehicles:", data);
				}}
			>
				Post Vehicle
			</button>

			<button
				onClick={() =>
					fetch("/api/vehicles?vehicleid=1", { method: "DELETE" })
						.then((res) => res.json())
						.then((data) => console.log("data from delete:", data))
				}
			>
				DELETE vehicle
			</button>

			{/* GET api/vehicles */}

			<button
				onClick={async () => {
					const res = await fetch("api/vehicles?userid=1", {
						method: "GET",
					});
					const data: Vehicles = await res.json();
					console.log("data from GET vehicles:", data);
				}}
			>
				Get Vehicles
			</button>
			<button
				onClick={async () => {
					const res = await fetch("/api/user?id=1", {
						method: "DELETE",
					});
					const data = await res.json();
					console.log("data from delete:", data);
				}}
			>
				Delete User
			</button>

			<button
				onClick={() => {
					fetch("/api/user?id=3", {
						method: "PUT",
						body: JSON.stringify({
							email: "random_email" + Math.random() + "@gmail.com",
							isDarkMode: Math.random() < 0.5,
						}),
					})
						.then((res) => {
							if (!res.ok) {
								throw new Error(
									`HTTP error! Status: ${(res.status, res.statusText)}`
								);
							}
							return res.json();
						})
						.then((data) => {
							console.log("Response data:", data);
						})
						.catch((error) => {
							console.error("Error during PUT request:", error);
						});
				}}
			>
				Update User
			</button>

			{/* GET test button using new API */}
			<button
				onClick={() => {
					fetch("/api/user?id=3", {
						method: "GET",
					})
						.then((res) => {
							if (!res.ok) {
								throw new Error(`HTTP error! Status: ${res.status}`);
							}
							return res.json();
						})
						.then((data) => {
							console.log("Response data:", data);
						})
						.catch((error) => {
							console.error("Error during GET request:", error);
						});
				}}
			>
				Get User
			</button>

			<button
				onClick={async () => {
					fetch("/api/user", {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify({
							email: "random_email" + Math.random() + "@gmail.com",
							isDarkMode: Math.random() < 0.5,
						}),
					})
						.then((res) => {
							if (!res.ok) {
								console.log("!res.ok:", !res.ok);
								console.log("POST res:", res);
								throw new Error(
									`HTTP error! Status: ${(res.status, res.statusText)}`
								);
							}
							return res.json();
						})
						.then((data) => {
							console.log("POST Response data:", data);
						})
						.catch((error) => {
							console.error("Error during POST request:", error);
						});
				}}
			>
				Create User
			</button>

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
