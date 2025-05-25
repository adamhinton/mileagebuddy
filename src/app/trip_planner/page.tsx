"use client";

import fakeTestTrips from "../utils/unitTestUtils/fakeTestTrips";

// TRIPS TODO: Middleware route protection

// __________________________________________________________________________________
// This is the page the user goes to to create a new Trip.
// It houses TripCreationForm.tsx
// __________________________________________________________________________________

const TripCreationPage = () => {
	// return <TripCreationOrEditForm mode="newTrip" schema={TripSchemaForPOST} />;
	//

	return (
		<div>
			{/* Dummy testing button for dev */}
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
						}
					} catch (error) {
						console.error("Failed to fetch trips:", error);
					}
				}}
				style={{ margin: "20px", padding: "10px" }}
			>
				Test Fetch Trips by User ID
			</button>

			{/* Dummy testing button for dev */}
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
						}
					} catch (error) {
						console.error("Failed to fetch trip:", error);
					}
				}}
				style={{ margin: "20px", padding: "10px" }}
			>
				Test Fetch Trip by ID
			</button>

			{/* Trip POST button */}
			<button
				onClick={async () => {
					// Randomly select fakeTestTrips[0] or fakeTestTrips[2].
					const tripIndex = Math.random() < 0.5 ? 0 : 2;
					const selectedTripBaseData = fakeTestTrips[tripIndex];
					const CURRENT_USER_ID = "0488323f-5e5c-4bb2-b188-75bdaf6eb527"; // Using existing test user ID

					const payload = {
						...selectedTripBaseData,
						userID: CURRENT_USER_ID,
					};

					try {
						const response = await fetch("/api/trips", {
							method: "POST",
							headers: {
								"Content-Type": "application/json",
							},
							body: JSON.stringify(payload),
						});

						const result = await response.json();

						if (!response.ok) {
							console.error("Error posting trip:", response.status, result);
						} else {
							console.log("Trip posted successfully:", result);
						}
					} catch (error) {
						console.error("Failed to make POST request:", error);
					}
				}}
				style={{ margin: "20px", padding: "10px" }}
			>
				Post Random Test Trip
			</button>
			{/* <TripCreationOrEditForm mode="newTrip" schema={TripSchemaForPOST} /> */}
		</div>
	);
};

export default TripCreationPage;
