// _______________________________________________________
// This is a generic button component for forms with optional confirmation dialog
// It can be used for submit, clear form, cancel, or any other form actions
// The confirmation dialog is optional and configurable
// _______________________________________________________

// TODO write tests for this

import { ButtonHTMLAttributes, useState } from "react";
import ConfirmationDialog from "./ConfirmationDialog";

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
 * Don't use this type. It's extended to make different config options. Use ButtonProps instead. This type would allow invalid states.
 */
type ButtonPropsBase = {
	// Don't use this type - see above
	onClick: () => void;
	/** Button text */
	text: string;
	variant?: ButtonVariant;
	isDisabled?: boolean;
	className?: string;
	ariaLabel?: string;
	type?: ButtonHTMLAttributes<HTMLButtonElement>["type"];
};

/**
 * Props for button with confirmation dialog required
 */
type ButtonPropsWithConfirmationDialog = ButtonPropsBase & {
	isConfirmationRequired: true;
	confirmationDialogOptions: ConfirmationDialogOptions;
};

/**
 * Props for button without confirmation dialog
 */
type ButtonPropsWithoutConfirmationDialog = ButtonPropsBase & {
	isConfirmationRequired: false;
	confirmationDialogOptions?: never;
};

/**
 * Union type representing all valid button configurations
 *
 * TS types should only/always represent valid states. So, if isConfirmationRequired is true, confirmationDialogOptions must be provided. If it's false, confirmationDialogOptions must not be provided.
 */
export type ButtonProps =
	| ButtonPropsWithConfirmationDialog
	| ButtonPropsWithoutConfirmationDialog;

/**
 * Generic form button component that can optionally show a confirmation dialog
 *
 * Can be used for submit, clear, cancel, or any other form actions
 */
const Button = ({
	onClick,
	text,
	isConfirmationRequired = false,
	// TODO not sure if this will make conf dialog show up when that's not intended
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
	type = "button",
}: ButtonProps) => {
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
				type={type || "button"}
				onClick={handleClick}
				className={`px-4 py-2 rounded-md transition-colors focus:outline-none focus:ring-2 
          text-sm sm:text-base ${buttonStyles[variant]} ${className}`}
				aria-label={ariaLabel || text}
				disabled={isDisabled}
			>
				{text}
			</button>

			{isConfirmationRequired && (
				<ConfirmationDialog
					title={confirmationDialogOptions.title || "Confirm Action"}
					message={
						confirmationDialogOptions.message ||
						"Are you sure you want to proceed?"
					}
					confirmButtonText={
						confirmationDialogOptions.confirmButtonText || "Confirm"
					}
					cancelButtonText={
						confirmationDialogOptions.cancelButtonText || "Cancel"
					}
					onConfirm={handleConfirm}
					onCancel={handleCancel}
					isOpen={showConfirmation}
				/>
			)}
		</>
	);
};

export default Button;
