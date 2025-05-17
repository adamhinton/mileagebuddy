"use client";

// TRIPS TODO: Middleware route protection

import { TripSchemaForPOST } from "../zod/schemas/trips/TripSchemas/TripSchemaPOST";
import TripCreationOrEditForm from "./TripFormComponents/TripCreationOrEditForm";

// __________________________________________________________________________________
// This is the page the user goes to to create a new Trip.
// It houses TripCreationForm.tsx
// __________________________________________________________________________________

const TripCreationPage = () => {
	return <TripCreationOrEditForm mode="newTrip" schema={TripSchemaForPOST} />;
};

export default TripCreationPage;
