"use client";

// __________________________________________________________________________________
// This is (obviously) the form where user can edit or create a trip.
// Will also have the logic to create multiple TripOptions for said trip.
// Validation: Zod
// Persistence: In-progress created Trips are saved to localStorage

// TODO: Instate default form values because Zod didn't play nice with defaults in-built to schemas

// TODO error summary

// TODO STRETCH tripoptions ordering and DnD
//__________________________________________________________________________________

import { Trip_For_DB_PATCH } from "@/app/zod/schemas/trips/TripSchemas/TripSchemaForPatch";
import { Trip_For_DB_POST } from "@/app/zod/schemas/trips/TripSchemas/TripSchemaPOST";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { useAppSelector } from "@/redux/hooks";
import {
	defaultTripValuesPATCH,
	defaultTripValuesPOST,
} from "../tripPlannerUtils/defaultValues/trip/defaultTripValues";
import { ZodSchema } from "zod";
import getSavedTripFormValuesFromLocalStorage, {
	LOCAL_STORAGE_TRIP_FORM_DATA_KEY,
} from "../tripPlannerUtils/getSavedTripFormValuesFromLocalStorage";

type FormPropsEditMode = {
	mode: "editTrip";
	tripToEdit: Trip_For_DB_PATCH;
	schema: ZodSchema<Trip_For_DB_PATCH>;
};

type FormPropsNewTripMode = {
	mode: "newTrip";
	schema: ZodSchema<Trip_For_DB_POST>;
};

/**Form schema will be one of these based off whether it's edit or creation mode */
export type TripPATCHOrPOST = Trip_For_DB_PATCH | Trip_For_DB_POST;

type FormProps = FormPropsEditMode | FormPropsNewTripMode;

// LocalStorage stuff
const savedLocalStorageValues = getSavedTripFormValuesFromLocalStorage();
// TODO insert this to defaultValues when we have defaultValues at all

const TripCreationOrEditForm = (props: FormProps) => {
	const loggedInUser = useAppSelector((state) => state.user.value);
	// Should never be undefined bc this is a protected route
	const userId = loggedInUser ? loggedInUser.id : "testid"; // TODO: Handle case where userId might not be available more gracefully

	const { mode, schema } = props;
	const tripToEdit = "tripToEdit" in props ? props.tripToEdit : undefined;

	// Determine default values based on mode and potentially localStorage
	let initialFormValues: TripPATCHOrPOST;
	if (savedLocalStorageValues) {
		initialFormValues = savedLocalStorageValues as unknown as TripPATCHOrPOST;
	} else if (mode === "newTrip") {
		// For a new trip, we need to decide on a default tripType or make it selectable by the user first.
		// For now, let's assume a default or that this will be set by user interaction before form init.
		// Defaulting to SHORT_DISTANCE for now, this might need adjustment based on UX flow.
		// TODO after setting up Trip endpoints^
		// Notes: Not sure if the db will require all fields even if they're type `never`
		// Like for a shrot distance trip, we don't need departureDate or returnDate but the db may need them
		// Will need to look at this after we have endpoints set up
		initialFormValues = defaultTripValuesPOST(
			userId,
			"SHORT_DISTANCE"
		) as Trip_For_DB_POST;
	} else if (tripToEdit) {
		initialFormValues = defaultTripValuesPATCH(tripToEdit) as Trip_For_DB_PATCH;
	} else {
		// Fallback, should ideally not happen if props are correctly passed
		// Defaulting to SHORT_DISTANCE for now
		initialFormValues = defaultTripValuesPOST(
			userId,
			"SHORT_DISTANCE"
		) as Trip_For_DB_POST;
	}

	const form = useForm<TripPATCHOrPOST>({
		resolver: zodResolver(schema),
		defaultValues: initialFormValues,
	});

	const { watch } = form;

	// Every time user changes a form value, save it to localStorage
	// This will be loaded back into the form if user navigates away and comes back
	useEffect(() => {
		const subscription = watch((value) => {
			// Only persist if we have values
			if (Object.keys(value).length > 0) {
				localStorage.setItem(
					LOCAL_STORAGE_TRIP_FORM_DATA_KEY,
					JSON.stringify(value)
				);
			}
		});

		// Cleanup subscription on unmount
		return () => subscription.unsubscribe();
	}, [watch]);

	return <h1>Placeholder</h1>;
};

export default TripCreationOrEditForm;
