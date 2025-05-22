"use client";

// TRIPS TODO: Middleware route protection

import { TripSchemaForPOST } from "../zod/schemas/trips/TripSchemas/TripSchemaPOST";
import TripCreationOrEditForm from "./TripFormComponents/TripCreationOrEditForm";

// __________________________________________________________________________________
// This is the page the user goes to to create a new Trip.
// It houses TripCreationForm.tsx
// __________________________________________________________________________________

const TripCreationPage = () => {
	// return <TripCreationOrEditForm mode="newTrip" schema={TripSchemaForPOST} />;
	//

	return (
		<div>
			<button
				onClick={async () => {
					const testUserId = "0488323f-5e5c-4bb2-b188-75bdaf6eb527"; // From seed.sql
					try {
						const response = await fetch(`/api/trips?userid=${testUserId}`);
						const data = await response.json();
						console.log("Fetched trips by user ID:", data);
						if (!response.ok) {
							console.error("Error fetching trips:", response.status, data);
							alert(`Error: ${data.error || response.statusText}`);
						} else {
							alert("Fetched trips! Check the console.");
						}
					} catch (error) {
						console.error("Failed to fetch trips:", error);
						alert("Failed to fetch trips. Check console.");
					}
				}}
				style={{ margin: "20px", padding: "10px" }}
			>
				Test Fetch Trips by User ID
			</button>

			<button
				onClick={async () => {
					const testUserId = "0488323f-5e5c-4bb2-b188-75bdaf6eb527"; // From seed.sql
					try {
						const response = await fetch(
							`/api/trips?userid=${testUserId}&tripid=1`
						);
						const data = await response.json();
						console.log("Fetched trip by ID:", data);
						if (!response.ok) {
							console.error("Error fetching trip:", response.status, data);
							alert(`Error: ${data.error || response.statusText}`);
						} else {
							alert("Fetched trip! Check the console.");
						}
					} catch (error) {
						console.error("Failed to fetch trip:", error);
						alert("Failed to fetch trip. Check console.");
					}
				}}
				style={{ margin: "20px", padding: "10px" }}
			>
				Test Fetch Trip by ID
			</button>
			{/* <TripCreationOrEditForm mode="newTrip" schema={TripSchemaForPOST} /> */}
		</div>
	);
};

export default TripCreationPage;
