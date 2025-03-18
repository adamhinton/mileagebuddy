// _______________________________________________________
// This is a reusable confirmation dialog that can be shown in buttons, modals, or anywhere else in the app.
// Tested in ConfirmationDialog.test.tsx
// _______________________________________________________

import { ReactNode } from "react";

export type ConfirmationDialogProps = {
	title: string;
	/** Dialog message/content */
	message: string | ReactNode;
	confirmButtonText: string;
	cancelButtonText: string;
	onConfirm: () => void;
	onCancel: () => void;
	/** Whether the dialog is visible */
	isOpen: boolean;
	/** Optional CSS class for the confirmation button */
	confirmButtonClass?: string;
};

// TODO write tests for this

/**
 * Reusable confirmation dialog component
 *
 * Displays a modal dialog with title, message, and confirm/cancel buttons
 */
const ConfirmationDialog = ({
	title,
	message,
	confirmButtonText,
	cancelButtonText,
	onConfirm,
	onCancel,
	isOpen,
	confirmButtonClass = "bg-red-600 text-white hover:bg-red-700",
}: ConfirmationDialogProps) => {
	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
			<div className="bg-white dark:bg-gray-800 p-6 rounded-md shadow-lg max-w-sm w-full">
				<h3 className="text-lg font-medium mb-3">{title}</h3>
				<div className="mb-4">{message}</div>
				<div className="flex justify-end space-x-3">
					<button
						type="button"
						onClick={onCancel}
						className="px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700"
					>
						{cancelButtonText}
					</button>
					<button
						type="button"
						onClick={onConfirm}
						className={`px-4 py-2 rounded-md ${confirmButtonClass}`}
					>
						{confirmButtonText}
					</button>
				</div>
			</div>
		</div>
	);
};

export default ConfirmationDialog;
