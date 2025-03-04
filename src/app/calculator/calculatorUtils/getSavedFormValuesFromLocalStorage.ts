import { LOCAL_STORAGE_FORM_DATA_KEY } from "../page";

/**When the user navigates away, any in-progress form values are saved to local storage and retrieved when they come back
 * This function retrieves those values on page load
 */
const getSavedFormValuesFromLocalStorage = () => {
	const savedData = localStorage.getItem(LOCAL_STORAGE_FORM_DATA_KEY);
	if (savedData) {
		try {
			return JSON.parse(savedData);
		} catch (e) {
			console.error("Error parsing saved form data:", e);
		}
	}
	return {};
};

export default getSavedFormValuesFromLocalStorage;
