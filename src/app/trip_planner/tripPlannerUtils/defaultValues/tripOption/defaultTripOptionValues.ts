// ___________________________________________________________________
// This is default form values for the TripOption sub-section of TripCreationOrEditForm
// Each Trip has multiple TripOptions
// The default values for Trip are in defaultTripValues.ts
// ___________________________________________________________________

import type { DeepReadonly } from "@/app/utils/server/types/VehicleTypes/GetVehicleTypes";
import type { TripOption_For_DB_POST } from "@/app/zod/schemas/trips/TripSchemas/TripOptionSchemas/TripOptionSchemaForPost";
import type { TripOption_For_DB_PATCH } from "@/app/zod/schemas/trips/TripSchemas/TripOptionSchemas/TripOptionSchemaForPatch";
import { DeepPartial } from "react-hook-form";

/**
 * Base default values common to all trip option types before specific fields like id or tripId are added.
 *
 * The type declaration on this is a little funky; hover over it in your IDE and it'll appear much more simple.
 */
const baseTripOptionData: DeepPartial<
	Omit<TripOption_For_DB_POST, "transportMode"> &
		Omit<Omit<TripOption_For_DB_PATCH, "id" | "tripId">, "transportMode">
> = {
	name: "",
	notes: null,
	parkingCosts: 0,
	tollCosts: 0,
	additionalCosts: 0,
};

// Default values for an "Own Vehicle" Trip Option
const defaultOwnVehicleTripOptionData: DeepPartial<
	DeepReadonly<
		Extract<
			TripOption_For_DB_POST | TripOption_For_DB_PATCH,
			{ transportMode: "OWN_VEHICLE" }
		>
	>
> = {
	...baseTripOptionData,
	transportMode: "OWN_VEHICLE",
	vehicleId: 0,
};

// Default values for an "Other" Transportation Trip Option
const defaultOtherTripOptionData: DeepPartial<
	Extract<
		TripOption_For_DB_POST | TripOption_For_DB_PATCH,
		{ transportMode: "OTHER" }
	>
> = {
	...baseTripOptionData,
	transportMode: "OTHER",
	transportationType: "Other", // Default to 'Other'
	transportationCostToDestination: 0,
	transportationCostAtDestination: 0,
};

/**
 * Provides default values for creating a new TripOption (POST).
 * @param transportMode The transport mode ("OWN_VEHICLE" or "OTHER").
 * @returns Default values for a new TripOption_For_DB_POST.
 */
export const defaultTripOptionValuesPOST = (
	transportMode: "OWN_VEHICLE" | "OTHER"
): DeepPartial<DeepReadonly<TripOption_For_DB_POST>> => {
	if (transportMode === "OWN_VEHICLE") {
		return defaultOwnVehicleTripOptionData;
	} else {
		return defaultOtherTripOptionData;
	}
};

/**
 * Provides default values for a TripOption form in PATCH mode, typically when the user clears the form.
 * @param tripOptionToEdit The original trip option object being edited.
 * @returns Default values suitable for resetting a TripOption_For_DB_PATCH form.
 */
export const defaultTripOptionValuesPATCH = (
	tripOptionToEdit: TripOption_For_DB_PATCH
): DeepPartial<Readonly<TripOption_For_DB_PATCH>> => {
	if (tripOptionToEdit.transportMode === "OWN_VEHICLE") {
		return {
			...defaultOwnVehicleTripOptionData,
			id: tripOptionToEdit.id,
			tripId: tripOptionToEdit.tripId,
		};
	} else {
		const otherTripOptionToEdit = tripOptionToEdit;
		return {
			...defaultOtherTripOptionData,
			id: otherTripOptionToEdit.id,
			tripId: otherTripOptionToEdit.tripId,
		};
	}
};
