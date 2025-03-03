// _______________________________________________________
// This is a button the user can hit to clear all form values and start over
// It shows a confirmation dialog to make sure the user really wants to clear the form
// Right now it's only used in the calculator form, but it could be used in other forms
// _______________________________________________________

import { useState } from "react";

/** User hits this button to clear all form values and start over
 *
 * Shows a popup asking user to confirm they want to clear the form
 */
const ClearFormButton = ({ onClick }: { onClick: () => void }) => {
	// Show confirmation dialog when user clicks the button
	const [showConfirmation, setShowConfirmation] = useState(false);

	const handleClearClick = () => {
		setShowConfirmation(true);
	};

	// When user confirms they want to clear the form
	const handleConfirm = () => {
		onClick();
		setShowConfirmation(false);
	};

	// When user cancels clearing the form
	const handleCancel = () => {
		setShowConfirmation(false);
	};

	return (
		<>
			<button
				type="button"
				onClick={handleClearClick}
				className="px-4 py-2 mr-3 rounded-md 
          bg-background-elevated text-neutral-text 
          border border-primary-100 hover:bg-background-highlight
          transition-colors focus:outline-none focus:ring-2 
          focus:ring-primary-200 dark:border-primary-200
          text-sm sm:text-base mb-3"
				aria-label="Clear form values"
			>
				Clear Form
			</button>

			{showConfirmation && (
				<div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
					<div className="bg-white dark:bg-gray-800 p-6 rounded-md shadow-lg max-w-sm w-full">
						<h3 className="text-lg font-medium mb-3">Confirm Clear Form</h3>
						<p className="mb-4">
							Are you sure you want to clear all form values? This cannot be
							undone.
						</p>
						<div className="flex justify-end space-x-3">
							<button
								type="button"
								onClick={handleCancel}
								className="px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700"
							>
								Cancel
							</button>
							<button
								type="button"
								onClick={handleConfirm}
								className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700"
							>
								Clear Form
							</button>
						</div>
					</div>
				</div>
			)}
		</>
	);
};

export default ClearFormButton;
