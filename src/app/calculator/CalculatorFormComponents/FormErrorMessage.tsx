import tailWindClassNames from "@/app/utils/clientUtils/styling/tailwindClassNames";
import { Vehicle_For_db_POST } from "@/app/utils/server/types/VehicleTypes/POSTVehicleTypes";
import { Path } from "react-hook-form";

/**
 * This component goes in two places:
 * 1. At the top of the form, where it's used to display the error messages for the whole form
 * 2. Inside the form, where it's used to display the error messages for individual inputs
 */
type ErrorMessageProps = {
	errorMessage: string;
	// To make testid. Only passed in if it's in the actual component; not needed when it's at top of main form
	path?: Path<Vehicle_For_db_POST>;
};

const FormErrorMessage = (props: ErrorMessageProps) => {
	const { errorMessage, path } = props;

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
