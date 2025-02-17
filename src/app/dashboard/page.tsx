"use client";

import { useAppSelector } from "@/redux/hooks";

// README
// As of 2.17.25, this is just a skeleton landing page when the user logs in
// Later it will show all their Vehicles and CRUD options on said vehicles
// As a stretch goal it will also show saved Trips and any other features

const DashboardPage = () => {
	const usersVehicles = useAppSelector((state) => state.vehicles);

	return (
		<div>
			<h1>Dashboard</h1>
			<ol>
				{usersVehicles.map((vehicle) => {
					return <li key={vehicle.id}>{vehicle.vehicleData.vehicleName}</li>;
				})}
			</ol>
		</div>
	);
};

export default DashboardPage;
