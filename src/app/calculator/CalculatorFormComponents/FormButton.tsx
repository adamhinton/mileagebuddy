// _______________________________________________________
// This is a generic button component for forms with optional confirmation dialog
// It can be used for submit, clear form, cancel, or any other form actions
// The confirmation dialog is optional and configurable
// _______________________________________________________

import { useState } from "react";

type ButtonVariant = "primary" | "danger" | "secondary";

/**
 * Configuration options for the confirmation dialog. All fields optional because they have default values
 */
type ConfirmationDialogOptions = {
	title?: string;
	message?: string;
	confirmButtonText?: string;
	cancelButtonText?: string;
};

/**
 * Base props shared by all button configurations
 *
 * Don't use this type. It's extended to make different config options. Use FormButtonProps instead. This type would allow invalid states.
 */
type FormButtonPropsBase = {
	// Don't use this type - see above
	onClick: () => void;
	/** Button text */
	text: string;
	variant?: ButtonVariant;
	isDisabled?: boolean;
	className?: string;
	ariaLabel?: string;
	type?: "submit";
};

/**
 * Props for button with confirmation dialog required
 */
type FormButtonPropsWithConfirmationDialog = FormButtonPropsBase & {
	isConfirmationRequired: true;
	confirmationDialogOptions: ConfirmationDialogOptions;
};

/**
 * Props for button without confirmation dialog
 */
type FormButtonPropsWithoutConfirmationDialog = FormButtonPropsBase & {
	isConfirmationRequired: false;
	confirmationDialogOptions?: never;
};

/**
 * Union type representing all valid button configurations
 *
 * TS types should always represent valid states. So, if isConfirmationRequired is true, confirmationDialogOptions must be provided. If it's false, confirmationDialogOptions must not be provided.
 */
type FormButtonProps =
	| FormButtonPropsWithConfirmationDialog
	| FormButtonPropsWithoutConfirmationDialog;

/**
 * Generic form button component that can optionally show a confirmation dialog
 *
 * Can be used for submit, clear, cancel, or any other form actions
 */
const FormButton = ({
	onClick,
	text,
	isConfirmationRequired = false,
	confirmationDialogOptions = {
		title: "Confirm Action",
		message: "Are you sure you want to proceed? This action cannot be undone.",
		confirmButtonText: "Confirm",
		cancelButtonText: "Cancel",
	},
	variant = "primary",
	isDisabled = false,
	className = "",
	ariaLabel,
}: FormButtonProps) => {
	// Show confirmation dialog when user clicks the button
	const [showConfirmation, setShowConfirmation] = useState(false);

	const handleClick = () => {
		if (isConfirmationRequired) {
			setShowConfirmation(true);
		} else {
			onClick();
		}
	};

	// When user confirms the action
	const handleConfirm = () => {
		onClick();
		setShowConfirmation(false);
	};

	// When user cancels the action
	const handleCancel = () => {
		setShowConfirmation(false);
	};

	// Determine button style based on variant
	const buttonStyles = {
		primary:
			"bg-primary text-white hover:bg-primary-600 focus:ring-primary-200",
		danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-200",
		secondary:
			"bg-background-elevated text-neutral-text border border-primary-100 hover:bg-background-highlight focus:ring-primary-200 dark:border-primary-200",
	};

	return (
		<>
			<button
				type="button"
				onClick={handleClick}
				className={`px-4 py-2 rounded-md transition-colors focus:outline-none focus:ring-2 
          text-sm sm:text-base ${buttonStyles[variant]} ${className}`}
				aria-label={ariaLabel || text}
				disabled={isDisabled}
			>
				{text}
			</button>

			{isConfirmationRequired && showConfirmation && (
				<div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
					<div className="bg-white dark:bg-gray-800 p-6 rounded-md shadow-lg max-w-sm w-full">
						<h3 className="text-lg font-medium mb-3">
							{confirmationDialogOptions.title}
						</h3>
						<p className="mb-4">{confirmationDialogOptions.message}</p>
						<div className="flex justify-end space-x-3">
							<button
								type="button"
								onClick={handleCancel}
								className="px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700"
							>
								{confirmationDialogOptions.cancelButtonText}
							</button>
							<button
								type="button"
								onClick={handleConfirm}
								className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700"
							>
								{confirmationDialogOptions.confirmButtonText}
							</button>
						</div>
					</div>
				</div>
			)}
		</>
	);
};

export default FormButton;
