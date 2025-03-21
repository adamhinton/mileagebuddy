import React from "react";
import tailWindClassNames from "@/app/utils/clientUtils/styling/tailwindClassNames";

type FormErrorMessageProps = {
	errorMessage: string;
	// Path is only needed when it's attached to an input, not when it's in FormErrrorSummary at top of form
	path?: string;
};

const FormErrorMessage = (props: FormErrorMessageProps) => {
	const { errorMessage } = props;

	const id = props.path ? `${props.path}-error` : undefined;
	const styles = tailWindClassNames.mileageCalcForm;

	return (
		<p id={id} data-testid={id} className={styles.FORM_ERROR_MESSAGE}>
			{/* Aria stuff */}
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 20 20"
				fill="currentColor"
				className={styles.FORM_ERROR_ICON}
			>
				<path
					fillRule="evenodd"
					d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
					clipRule="evenodd"
				/>
			</svg>
			{errorMessage}
		</p>
	);
};

export default FormErrorMessage;
