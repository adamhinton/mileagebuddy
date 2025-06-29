// _____________________________________________________
// Each Trip can have multiple TripOptions
// Out of laziness and simplicity, TripOptions are edited by just passing in the edited Trip
// TripOptions are not stored in the Redux store, but rather in the Trip object itself

// These Trips are stored in state as an array of Trips -- since a lot of these operations are done by id, we could improve efficiency by using a Map or an object with tripID as keys, but users are not expected to have a lot of trips and they won't be doing a lot of these operations, and these operations are not performance-critical, so we'll do it this way for now.

// The above methods reuse logic quite a bit between functions, so we could refactor this to use a utility function to find the trip index and update it, but for now we'll keep it simple and just repeat the logic in each function.. TODO stretch
// _____________________________________________________
import { TripWithID } from "@/app/zod/schemas/trips/TripSchemas/TripSchemaForPatch";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: TripWithID[] = [];

const tripsSlice = createSlice({
	name: "trips",
	initialState,
	reducers: {
		// Zod should have already validated trip here in the create trip form component
		addTrip: (state, action: PayloadAction<TripWithID>) => {
			state.push(action.payload);
		},

		removeTripById: (state, action: PayloadAction<string>) => {
			const tripIndex = state.findIndex((t) => t.tripID === action.payload);

			if (tripIndex !== -1) {
				state.splice(tripIndex, 1);
			} else {
				console.error("Trip not found in state");
			}
		},

		setTrips: (state, action: PayloadAction<TripWithID[]>) => {
			state.length = 0; // Clear the current state
			state.push(...action.payload);
		},

		removeAllTrips: (state) => {
			state.length = 0;
		},

		editTripById: (state, action: PayloadAction<{ trip: TripWithID }>) => {
			const { trip } = action.payload;
			const tripIndex = state.findIndex((t) => t.tripID === trip.tripID);

			if (tripIndex !== -1) {
				state[tripIndex] = trip;
			} else {
				console.error("Trip not found in state");
			}
		},

		// Begin TripOptions-related reducers
		// See readme at top of this file for more info on TripOptions
		// For simplicity (and because I'm lazy), these reducers just pass in the updated Trip with the relevant TripOption added/edited/deleted etc

		/**
		 * This just takes in the updated Trip with the added TripOption
		 * All it does is edit the passed-in Trip in redux state.
		 */
		addNewTripOption: (state, action: PayloadAction<{ trip: TripWithID }>) => {
			const { trip } = action.payload;
			const tripIndex = state.findIndex((t) => t.tripID === trip.tripID);

			if (tripIndex !== -1) {
				// For simplicity this just updates the Trip in state with the passed-in Trip that has the new TripOption added
				state[tripIndex] = trip;
			} else {
				console.error("Trip not found in state");
			}
		},

		/**
		 * This just takes in the updated Trip with the edited TripOption
		 * All it does is edit the passed-in Trip in redux state.
		 */
		editTripOption: (state, action: PayloadAction<{ trip: TripWithID }>) => {
			const { trip } = action.payload;
			const tripIndex = state.findIndex((t) => t.tripID === trip.tripID);

			if (tripIndex !== -1) {
				// For simplicity this just updates the Trip in state with the passed-in Trip that has the edited TripOption
				state[tripIndex] = trip;
			} else {
				console.error("Trip not found in state");
			}
		},

		/**
		 * This just takes in the updated Trip with the deleted TripOption
		 * All it does is edit the passed-in Trip in redux state.
		 */
		deleteTripOption: (state, action: PayloadAction<{ trip: TripWithID }>) => {
			const { trip } = action.payload;
			const tripIndex = state.findIndex((t) => t.tripID === trip.tripID);
			if (tripIndex !== -1) {
				// For simplicity this just updates the Trip in state with the passed-in Trip that has the TripOption deleted
				state[tripIndex] = trip;
			} else {
				console.error("Trip not found in state");
			}
		},

		deleteAllTripOptionsForOneTrip: (
			state,
			action: PayloadAction<{ trip: TripWithID }>
		) => {
			const { trip } = action.payload;
			const tripIndex = state.findIndex((t) => t.tripID === trip.tripID);

			if (tripIndex !== -1) {
				state[tripIndex].tripOptions = [];
			} else {
				console.error("Trip not found in state");
			}
		},
	},
});

export const {
	addTrip,
	removeTripById,
	setTrips,
	removeAllTrips,
	editTripById,
	addNewTripOption,
	editTripOption,
	deleteTripOption,
	deleteAllTripOptionsForOneTrip,
} = tripsSlice.actions;

export default tripsSlice.reducer;
