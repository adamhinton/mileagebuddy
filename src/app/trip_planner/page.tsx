"use client";

import {
	getSingleTripByIdClient,
	getTripsByUserIDClient,
	insertTripToDBClient,
} from "../utils/client/DBInteractions/TripsDBInteractions";
import fakeTestTrips from "../utils/unitTestUtils/fakeTestTrips";
import { Trip_For_DB_PATCH } from "../zod/schemas/trips/TripSchemas/TripSchemaForPatch";
import { Trip_For_DB_POST } from "../zod/schemas/trips/TripSchemas/TripSchemaPOST";

// TRIPS TODO: Middleware route protection
// TODO: DB helper functions for this route

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
					const trips = await getTripsByUserIDClient(testUserId);
					console.log("trips:", trips);
				}}
				style={{ margin: "20px", padding: "10px" }}
			>
				Test Fetch Trips by User ID
			</button>

			{/* Dummy testing button for dev */}
			<button
				onClick={async () => {
					const response = await getSingleTripByIdClient(2);

					console.log("Fetched trip by ID:", response);
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

					const trip = await insertTripToDBClient(
						payload as unknown as Trip_For_DB_POST
					);
					console.log("Trip created successfully:", trip);
				}}
				style={{ margin: "20px", padding: "10px" }}
			>
				Post Random Test Trip
			</button>

			{/* PATCH Test Trip Button with randomized data*/}
			<button
				onClick={async () => {
					const tripToUpdateId = 4;
					const dynamicPayload = generateDynamicDummyTripForPatch();
					try {
						const response = await fetch(
							`/api/trips?tripid=${tripToUpdateId}`,
							{
								method: "PATCH",
								headers: {
									"Content-Type": "application/json",
								},
								body: JSON.stringify(dynamicPayload),
							}
						);
						const result = await response.json();
						if (!response.ok) {
							console.error(
								`Error patching trip (ID: ${tripToUpdateId}):`,
								response.status,
								result
							);
						} else {
							console.log(
								`Trip (ID: ${tripToUpdateId}) patched successfully. Response:`,
								result
							);
						}
					} catch (error) {
						console.error(
							`Failed to make PATCH request for trip (ID: ${tripToUpdateId}):`,
							error
						);
					}
				}}
				style={{ margin: "20px", padding: "10px" }}
			>
				Patch Test Trip (ID: 1 with Random Data)
			</button>

			{/* Dummy test button to DELETE Trip with id 1 */}
			<button
				onClick={async () => {
					const tripIdToDelete = 3;
					try {
						const response = await fetch(
							`/api/trips?tripid=${tripIdToDelete}`,
							{
								method: "DELETE",
							}
						);
						if (!response.ok) {
							const errorData = await response.json();
							console.error(
								`Error deleting trip (ID: ${tripIdToDelete}):`,
								response.status,
								errorData
							);
						} else {
							console.log(`Trip (ID: ${tripIdToDelete}) deleted successfully.`);
						}
					} catch (error) {
						console.error(
							`Failed to make DELETE request for trip (ID: ${tripIdToDelete}):`,
							error
						);
					}
				}}
				style={{ margin: "20px", padding: "10px" }}
			>
				{`Delete Trip)`}
			</button>

			{/* <TripCreationOrEditForm mode="newTrip" schema={TripSchemaForPOST} /> */}
		</div>
	);
};

export default TripCreationPage;

/**
 * This is just for testing, it generates a different Trip every time to test PATCH
 */
const generateDynamicDummyTripForPatch = (): Trip_For_DB_PATCH => {
	const now = new Date();
	// Format to EST (approximation, as true timezone conversion is complex client-side without libraries)
	// For robust EST, a library like date-fns-tz would be better, or server-side formatting.
	// This is a simplified approach for client-side display.
	const estOffset = -4 * 60; // EDT offset, for standard EST use -5 * 60
	const utc = now.getTime() + now.getTimezoneOffset() * 60000;
	const estTime = new Date(utc + 60000 * estOffset);
	const timeString = estTime.toLocaleTimeString("en-US", {
		hour: "2-digit",
		minute: "2-digit",
		second: "2-digit",
		timeZoneName: "short",
	});

	// @ts-expect-error tripoptions missing is fine
	return {
		tripID: "a1b2c3d4-e5f6-7890-1234-567890abcdef", // Dummy UUID for schema compliance
		userID: "0488323f-5e5c-4bb2-b188-75bdaf6eb527", // User ID from seed.sql
		name: `Updated Trip at ${timeString} EST`,
		destination: "Dynamic Destination Update",
		origin: "San Francisco, CA",
		notes: `Patch test executed at ${timeString} EST. Random number: ${Math.random().toFixed(5)}`,
		tripType: "SHORT_DISTANCE",
		roundTripDrivingDistanceMiles: Math.floor(Math.random() * 200) + 50, // Random distance between 50 and 250
		tripsOrder: 1,
	};
};
