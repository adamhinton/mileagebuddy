// _________________________________________________________________
// This is default form values for TripCreationOrEditForm.tsx
// Note that each Trip can have multiple TripOptions; TripOption default values are in defaultTripOptionValues.ts
// _________________________________________________________________

import type { DeepReadonly } from "@/app/utils/server/types/VehicleTypes/GetVehicleTypes";
import type { Trip_For_DB_POST } from "@/app/zod/schemas/trips/TripSchemas/TripSchemaPOST";
import type { Trip_For_DB_PATCH } from "@/app/zod/schemas/trips/TripSchemas/TripSchemaForPatch";
import { DeepPartial } from "react-hook-form";

/**
 * Base default values common to all trip types before specific fields like userid or tripID are added.
 */
const baseTripData: DeepPartial<
	DeepReadonly<Omit<Trip_For_DB_POST, "userid" | "tripType">> &
		Omit<Omit<Trip_For_DB_PATCH, "userid" | "tripID">, "tripType">
> = {
	name: "",
	destination: "",
	origin: null,
	notes: null,
	roundTripDrivingDistanceMiles: null,
	tripOptions: [],
};

// Default values for a Short Distance Trip
const defaultShortDistanceTripData: DeepPartial<
	DeepReadonly<
		Extract<
			Trip_For_DB_POST | Trip_For_DB_PATCH,
			{ tripType: "SHORT_DISTANCE" }
		>
	>
> = {
	...baseTripData,
	tripType: "SHORT_DISTANCE",
};

// Default values for a Long Distance Trip
const defaultLongDistanceTripData: DeepPartial<
	DeepReadonly<
		Extract<Trip_For_DB_POST | Trip_For_DB_PATCH, { tripType: "LONG_DISTANCE" }>
	>
> = {
	...baseTripData,
	tripType: "LONG_DISTANCE",
	departureDate: null,
	returnDate: null,
	localDrivingDistanceMiles: null,
};

/**
 * Provides default values for creating a new Trip (POST).
 * @param userId The ID of the user creating the trip.
 * @param tripType The type of the trip ("SHORT_DISTANCE" or "LONG_DISTANCE").
 * @returns Default values for a new Trip_For_DB_POST.
 */
export const defaultTripValuesPOST = (
	userId: string,
	tripType: "SHORT_DISTANCE" | "LONG_DISTANCE"
): DeepPartial<DeepReadonly<Trip_For_DB_POST>> => {
	if (tripType === "SHORT_DISTANCE") {
		return {
			...(defaultShortDistanceTripData as DeepPartial<
				Extract<Trip_For_DB_POST, { tripType: "SHORT_DISTANCE" }>
			>),
			userID: userId,
		};
	} else {
		return {
			...(defaultLongDistanceTripData as DeepPartial<
				Extract<Trip_For_DB_POST, { tripType: "LONG_DISTANCE" }>
			>),
			userID: userId,
		};
	}
};

/**
 * Provides default values for a Trip form in PATCH mode, typically when the user clears the form.
 * It uses the structure of Trip_For_DB_PATCH, including necessary IDs from the trip being edited.
 * @param tripToEdit The original trip object being edited.
 * @returns Default values suitable for resetting a Trip_For_DB_PATCH form.
 */
export const defaultTripValuesPATCH = (
	tripToEdit: Trip_For_DB_PATCH
): DeepPartial<Readonly<Trip_For_DB_PATCH>> => {
	if (tripToEdit.tripType === "SHORT_DISTANCE") {
		return {
			...(defaultShortDistanceTripData as DeepPartial<
				Extract<Trip_For_DB_PATCH, { tripType: "SHORT_DISTANCE" }>
			>),
			userID: tripToEdit.userID,
			tripID: tripToEdit.tripID,
		};
	} else {
		// Type assertion for LongDistanceTrip specific fields if any on tripToEdit are needed for defaults
		const longTripToEdit = tripToEdit as Extract<
			Trip_For_DB_PATCH,
			{ tripType: "LONG_DISTANCE" }
		>;
		return {
			...(defaultLongDistanceTripData as DeepPartial<
				Extract<Trip_For_DB_PATCH, { tripType: "LONG_DISTANCE" }>
			>),
			userID: longTripToEdit.userID,
			tripID: longTripToEdit.tripID,
		};
	}
};
