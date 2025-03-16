import tailWindClassNames from "@/app/utils/clientUtils/styling/tailwindClassNames";
import { Path } from "react-hook-form";
import { VehiclePATCHorPOST } from "./VehicleCreationForm";

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
			className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center"
			data-testid={`${path}-error`}
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				className="h-4 w-4 mr-1 inline-block flex-shrink-0"
				viewBox="0 0 20 20"
				fill="currentColor"
				aria-hidden="true"
			>
				<path
					fillRule="evenodd"
					d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
					clipRule="evenodd"
				/>
			</svg>
			{errorMessage}
		</p>
	);
};

export default FormErrorMessage;
