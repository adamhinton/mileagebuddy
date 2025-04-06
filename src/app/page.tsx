"use client";

import { Vehicle_For_db_PATCH } from "./utils/server/types/VehicleTypes/PATCHVehicleTypes";
import {
	deleteVehicleByIDClient,
	getSingleVehicleByIDClient,
	getVehiclesByUserIDClient,
	insertVehicleClient,
	updateVehicleInDBClient,
} from "./utils/server/client/DBInteractions/VehiclesDBInteractions";
import { calculateCarCostMain } from "./utils/CarCostAlgorithm/calculateCarCostMain";
import { createClientCSROnly } from "./utils/server/supabase/client";
import { User } from "./zod/schemas/UserSchema";
import { useAppSelector } from "@/redux/hooks";
// README:
// This is a dummy HTML setup written by Copilot to give me something to bounce off of early in dev, will be replaced with my own design later.

export default function Page() {
	const loggedInUser = useAppSelector((state) => state.user.value);
	const isLoggedIn = !!loggedInUser?.id;

	const usersVehicles = useAppSelector((state) => state.vehicles);
	console.log("usersVehicles:", usersVehicles);

	return (
		<div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center dark:bg-black">
			<main>
				{/* Banner for non-authenticated users */}
				{!isLoggedIn && (
					<div className="bg-accent text-white text-center py-2 mb-4">
						<p>
							Save your calculations and access them anytime!{" "}
							<a href="/signup" className="underline font-bold">
								Create an account
							</a>{" "}
							for free.
						</p>
					</div>
				)}
				{/* dummy button to POST api/vehicles with mockVehicle */}

				{/* PATCH api/vehicles with dummy Vehicle */}
				<button
					onClick={async () => {
						if (!loggedInUser) {
							console.error("No logged in user to PATCH a vehicle for");
							return;
						}

						const partialMockVehicle: Vehicle_For_db_PATCH = {
							type: "gas",
							id: 3,
							userid: loggedInUser.id,
							vehiclesOrder: 1,
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

						if (!loggedInUser) {
							console.error("No logged in user");
							return;
						}

						const data = await updateVehicleInDBClient(partialMockVehicle);

						console.log("data from PATCH vehicles:", data);
					}}
				>
					PATCH vehicle
				</button>

				<button
					onClick={async () => {
						if (!loggedInUser) {
							console.error("No logged in user");
							return;
						}

						const completeMockVehicle = {
							type: "gas" as const,
							// The userid doesn't actually do anything here since this is just a test vehicle, but it's required by the schema
							userid: loggedInUser.id || "1",
							id: 1,
							vehiclesOrder: 1,
							vehicleData: {
								vehicleID: 1,
								vehicleName: "Tesla Model 3",
								year: 2020,
								make: "Tesla",
								model: "Model 3",
								trim: "Base",
								highwayMPG: 35.5,
							},
							gasVehicleData: {
								vehicleID: 1,
								gasCostPerGallon: 3.5,
								milesPerGallonHighway: 35.5,
								milesPerGallonCity: 27.5,
							},
							purchaseAndSales: {
								vehicleID: 1,
								yearPurchased: 2020,
								purchasePrice: 22_000.0,
								downPaymentAmount: 0,
								willSellCarAfterYears: 5,
								milesBoughtAt: 10_000,
								willSellCarAtMiles: 50_000,
								willSellCarAtPrice: 14_500.0,
							},
							usage: {
								vehicleID: 1,
								averageDailyMiles: 25,
								weeksPerYear: 52,
								percentHighway: 40,
								extraDistanceMiles: 0,
								extraDistancePercentHighway: 0,
							},
							fixedCosts: {
								vehicleID: 1,
								yearlyInsuranceCost: 1_200.0,
								yearlyRegistrationCost: 50.0,
								yearlyTaxes: 100.0,
								monthlyLoanPayment: 0.0,
								monthlyWarrantyCost: 15.0,
								inspectionCost: 100.0,
								otherYearlyCosts: 100.0,
							},
							yearlyMaintenanceCosts: {
								vehicleID: 1,
								oilChanges: 100.0,
								tires: 200.0,
								batteries: 30.0,
								brakes: 100.0,
								other: 100.0,
							},
							variableCosts: {
								vehicleID: 1,
								monthlyParkingCosts: 30.0,
								monthlyTolls: 20.0,
								monthlyCarWashCost: 20.0,
								monthlyMiscellaneousCosts: 10.0,
								monthlyCostDeductions: 20.0,
							},
							electricVehicleData: null,
						};
						const calculation = await calculateCarCostMain(completeMockVehicle);
						console.log("calculation:", calculation);
					}}
				>
					Calculate car cost main
				</button>

				<button
					onClick={async () => {
						if (!loggedInUser) {
							console.error("No logged in user");
							return;
						}

						const completeMockVehicle = {
							type: "gas" as const,
							userid: loggedInUser?.id,
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
								otherYearlyCosts: 300.0,
							},
							yearlyMaintenanceCosts: {
								oilChanges: 100.0,
								tires: 200.0,
								batteries: 300.0,
								brakes: 100.0,
								other: 100.0,
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

						const data = await insertVehicleClient(completeMockVehicle);
						console.log("data from POST vehicles:", data);
					}}
				>
					Post Vehicle
				</button>

				<button
					onClick={async () => {
						const deletedVehicleData = await deleteVehicleByIDClient(2);
						console.log("deletedVehicleData:", deletedVehicleData);
					}}
				>
					DELETE vehicle
				</button>

				{/* GET api/vehicles */}

				<button
					onClick={async () => {
						if (!loggedInUser) {
							console.error("No logged in user to GET vehicles for");
							return;
						}

						const data = await getVehiclesByUserIDClient(loggedInUser?.id);
						console.log("data from getVehiclesByUserID:", data);
					}}
				>
					Get Vehicles
				</button>

				<button
					onClick={async () => {
						const data = await getSingleVehicleByIDClient(1, 1);
						console.log("data from GET 1 vehicle:", data);
					}}
				>
					GET 1 vehicle
				</button>

				{/* GET test button using new API */}
				<button
					onClick={async () => {
						const supabase = createClientCSROnly();
						const userFromDB = await supabase.auth.getUser();
						// const { id, email } = userFromDB.data.user!;
						if (!userFromDB.data.user) {
							console.log("user not found");
							return;
						}
						const { id } = userFromDB.data.user;
						// Email should always exist bc they can't sign up without it
						const email = userFromDB.data.user.email!;
						const user: User = {
							id,
							email,
							// TODO: This is just a dummy isDarkMode value, replace with real value
							isDarkMode: false,
						};
						console.log("user:", user);
					}}
				>
					Get User
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
					{/* <pre>{JSON.stringify(user)}</pre> */}
				</section>
			</main>
		</div>
	);
}

// export default Page;
