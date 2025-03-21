// ____________________________________________
// This is (obviously) the logic taht runs when user hits Submit
// react-hook-form validates the form data against the zod schema before this can run, so we can safely assume all data is valid
// The middleware also validates the data on the server using zod before sending to the db, so form data is validated on both server and client
// ____________________________________________

"use client";

import { VehiclePATCHorPOST } from "../CalculatorFormComponents/VehicleCreationForm";
import {
	insertVehicleClient,
	updateVehicleInDBClient,
} from "@/app/utils/server/client/DBInteractions/VehiclesDBInteractions";
import { addVehicle, editVehicleById } from "@/redux/reducers/vehiclesReducer";
import { Action, ThunkDispatch } from "@reduxjs/toolkit";
import { RootState } from "@/redux/store";

// Note: r-h-f does Zod validation automatically so we don't need to instate that manually. The patch/post endpoints also do zod validation on the server before sending to db.
// This runs after form validation has succeeded so we're safe to clear form values
// Will either edit ane xisting Vehicle in the DB or create a new one, depending on mode
const formSubmitLogic = async (
	formData: VehiclePATCHorPOST,
	dispatch: ThunkDispatch<RootState, unknown, Action>,
	clearAllFormValues: () => void
) => {
	console.log("Submitting");

	// type is Vehicle_For_db_PATCH
	// It has an id because it has already been assigned an id in the db
	if ("id" in formData) {
		try {
			const updatedVehicle = await updateVehicleInDBClient(formData);
			console.log("updatedVehicle:", updatedVehicle);

			// Set to redux state
			dispatch(editVehicleById({ vehicle: updatedVehicle }));

			clearAllFormValues();
		} catch (error) {
			console.error("Error updating vehicle:", error);
		}
	}

	// type is Vehicle_For_db_POST
	// Doesn't have an id because it hasn't been assigned one in the db yet
	else if (!("id" in formData)) {
		// TODO flesh this out
		try {
			console.log("new vehicle mode submitting");
			const newVehicle = await insertVehicleClient(formData);
			console.log("newVehicle:", newVehicle);

			// Set to redux state
			dispatch(addVehicle(newVehicle));

			clearAllFormValues();
		} catch (error) {
			console.error("Error inserting vehicle:", error);
		}

		// Mode is neither edit nor creation, or the type of vehicle passed in doesn't match the mode. TS should always prevent this so hopefully it never happens
	} else {
		console.error(
			"Invalid mode passed to form submit. How did you even do that?"
		);
	}

	// Note to self: When you write the code to send the form data to the server, make sure to call clearAllFormValues() AFTER the server responds with a success
	// Commenting this out for now because it's annoying to have to re-enter all the form data every time I want to test the form submission
	// clearAllFormValues();
};

export default formSubmitLogic;
