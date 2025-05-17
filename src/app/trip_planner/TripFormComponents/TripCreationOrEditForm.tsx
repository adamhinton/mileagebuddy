"use client";

/* eslint-disable @typescript-eslint/no-unused-vars */
// __________________________________________________________________________________
// This is (obviously) the form where user can edit or create a trip.
// Will also have the logic to create multiple TripOptions for said trip.
// Validation: Zod
// Persistence: In-progress created Trips are saved to localStorage

// TODO: tripsOrder and tripOptionOrder in db and frontend. Sigh
// Make sure to add this to the defaultValues

// TODO: Instate default form values because Zod didn't play nice with defaults in-built to schemas

// TODO error summary

// TODO tripoptions ordering and DnD
//__________________________________________________________________________________

import { Trip_For_DB_PATCH } from "@/app/zod/schemas/trips/TripSchemas/TripSchemaForPatch";
import { Trip_For_DB_POST } from "@/app/zod/schemas/trips/TripSchemas/TripSchemaPOST";
import { useAppSelector } from "@/redux/hooks";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ZodSchema } from "zod";
import getSavedTripFormValuesFromLocalStorage, {
	LOCAL_STORAGE_TRIP_FORM_DATA_KEY,
} from "../tripPlannerUtils/getSavedTripFormValuesFromLocalStorage";
import { useEffect } from "react";

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
	const userId = loggedInUser ? loggedInUser.id : "testid";

	const { mode, schema } = props;
	const tripToEdit = "tripToEdit" in props ? props.tripToEdit : undefined;

	const form = useForm<TripPATCHOrPOST>({
		resolver: zodResolver(schema),
		// TODO default values
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
