import { LOCAL_STORAGE_FORM_DATA_KEY } from "../CalculatorFormComponents/VehicleCreationForm";

/**When the user navigates away, any in-progress form values are saved to local storage and retrieved when they come back
 * This function retrieves those values on page load
 */
const getSavedFormValuesFromLocalStorage = () => {
	const savedData = localStorage.getItem(LOCAL_STORAGE_FORM_DATA_KEY);
	if (savedData) {
		try {
			// Not doing Zod validation here because the form isn't complete yet, and the user could have saved invalid data
			// If the user tries to submit the form, the form will be validated then, so I don't believe this is a security risk
			return JSON.parse(savedData);
		} catch (e) {
			console.error("Error parsing saved form data:", e);
		}
	}
	return {};
};

export default getSavedFormValuesFromLocalStorage;
