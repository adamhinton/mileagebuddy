import tailWindClassNames from "@/app/utils/clientUtils/styling/tailwindClassNames";
import { Path } from "react-hook-form";
import { VehiclePATCHorPOST } from "../page";

/**
 * This component goes in two places:
 * 1. At the top of the form, where it's used to display the error messages for the whole form
 * 2. Inside the form, where it's used to display the error messages for individual inputs
 */
type ErrorMessageProps = {
	errorMessage: string;
	// To make testid. Only passed in if it's in the actual component; not needed when it's at top of main form
	path?: Path<VehiclePATCHorPOST>;
};

const FormErrorMessage = (props: ErrorMessageProps) => {
	const { errorMessage, path } = props;

	// This should never happen
	if (errorMessage === "") {
		return null;
	}

	return (
		<p
			className={`${tailWindClassNames.mileageCalcForm.FORM_ERROR_MESSAGE}`}
			data-testid={`${path}-error`}
		>
			{errorMessage}
		</p>
	);
};

export default FormErrorMessage;
