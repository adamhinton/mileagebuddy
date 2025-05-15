import { DeepPartial } from "react-hook-form";
import { TripPATCHOrPOST } from "../TripFormComponents/TripCreationOrEditForm";

export const LOCAL_STORAGE_TRIP_FORM_DATA_KEY = "tripFormData";

/**When the user navigates away, any in-progress form values are saved to local storage and retrieved when they come back
 * This function retrieves those values on page load
 */
const getSavedTripFormValuesFromLocalStorage = ():
	| DeepPartial<TripPATCHOrPOST>
	| undefined => {
	const savedData = localStorage.getItem(LOCAL_STORAGE_TRIP_FORM_DATA_KEY);
	if (savedData) {
		try {
			// Not doing Zod validation here because the form isn't complete yet, and the user could have saved invalid data
			// If the user tries to submit the form, the form will be validated then, so I don't believe this is a security risk
			return JSON.parse(savedData);
		} catch (e) {
			console.error("Error parsing saved trip form data:", e);
		}
	}
	return {}; // Return empty object if no data or error, form will use defaults
};

export default getSavedTripFormValuesFromLocalStorage;
