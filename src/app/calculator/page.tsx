// _______________________________________________________
// In this form, the user creates or edits a Vehicle based on the mode props passed in
// The form is validated using zod and the schema is passed in as a prop
// See VehicleCreationOrEditForm for more details

// _______________________________________________________

"use client";

import { useAppSelector } from "@/redux/hooks";
import {
	Vehicle_For_db_PATCH,
	VehicleSchemaForPATCH,
} from "../utils/server/types/VehicleTypes/PATCHVehicleTypes";
import VehicleCreationOrEditForm from "./CalculatorFormComponents/VehicleCreationForm";
import { VehicleToBePostedSchema } from "../utils/server/types/VehicleTypes/POSTVehicleTypes";

// TYPES/VALIDATION
// Vehicle is DeepReadOnly right now, need to make mutable version for this which will be easy
// Use VehicleToBePostedSchema from zod and the ts type Vehicle_For_DB_POST here. That will be the object which guides the zod validation. It omits things like vehicleID etc.
// Use Vehicle_For_DB_PATCH and VehicleSchemaForPATCH when editing a vehicle using this form
// Note: VehicleToBePostedSchema is a union of GasVehicleSchemaForPOST and ElectricVehicleSchemaForPOST. Will have to do validation on one or the other based on user input, you can't do zod validation on a union type. but that shouldn't be too hard.

// TODO:
// TODO IMPORTANT Get userid from logged in user - right now it's hardcoded for testing
// Figure out how/where in the UI to toggle between testing and vehicle creation
// Let non-authenticated users save vehicles to localStorage
// Default values:
// // Figure out where to save these
// // Make input default values actually save to form values; right now user has to tab over input
// General styling improvements. Animations, transitions etc
// Make CollapsibleSectionTitles type a tuple of literals so as to be the one source of truth for the order

// Stretch: optimistic UI updates

const CalculatorPage = () => {
	const usersVehicles = useAppSelector((state) => state.vehicles);
	const firstVehicle = usersVehicles[0];
	console.log("firstVehicle:", firstVehicle);

	return (
		<section className="h-screen p-4 sm:p-6 md:p-8">
			<h1 className="text-2xl sm:text-3xl md:text-4xl">Calculator Page</h1>
			<VehicleCreationOrEditForm
				mode="newVehicle"
				schema={VehicleToBePostedSchema}
			/>
		</section>
	);
};

export default CalculatorPage;
