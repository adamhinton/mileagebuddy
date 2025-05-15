// __________________________________________________________________________________
// This is (obviously) the form where user can edit or create a trip.
// Will also have the logic to create multiple TripOptions for said trip.
// Validation: Zod
// Persistence: In-progress created Trips are saved to localStorage

// TODO: Instate default form values because Zod didn't play nice with defaults in-built to schemas
//__________________________________________________________________________________

import { Trip_For_DB_PATCH } from "@/app/zod/schemas/trips/TripSchemas/TripSchemaForPatch";
import { Trip_For_DB_POST } from "@/app/zod/schemas/trips/TripSchemas/TripSchemaPOST";
import { useAppSelector } from "@/redux/hooks";
import { ZodSchema } from "zod";

type FormPropsEditMode = {
	mode: "editTrip";
	tripToEdit: Trip_For_DB_PATCH;
	schema: ZodSchema<Trip_For_DB_PATCH>;
};

type FormPropsNewTripMode = {
	mode: "newTrip";
	schema: ZodSchema<Trip_For_DB_POST>;
};

type FormProps = FormPropsEditMode | FormPropsNewTripMode;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const TripCreationOrEditForm = (props: FormProps) => {
	const loggedInUser = useAppSelector((state) => state.user.value);
	// Should never be undefined bc this is a protected route
	const userId = loggedInUser ? loggedInUser.id : undefined;

	return <h1>Placeholder</h1>;
};

export default TripCreationOrEditForm;
