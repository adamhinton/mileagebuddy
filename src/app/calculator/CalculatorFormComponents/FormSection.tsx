// README
// This is part of the mileage form calculator used to build a Vehicle
// Each sub-object of Vehicle (see GetVehicleTypes.ts) will have one of these FormSection's
// This is a collapsible section of the form
// You list this as an open tag and put the relevant inputs inside it. Mostly MileageCalcNumberInputs
// TODO unit tests once this is fully fleshed out

import tailWindClassNames from "@/app/utils/clientUtils/styling/tailwindClassNames";
import {
	type Electric_Vehicle_For_DB_POST,
	type Gas_Vehicle_For_DB_POST,
} from "@/app/utils/server/types/VehicleTypes/POSTVehicleTypes";
import { type ReactNode } from "react";
import { type CollapsedOrNot } from "./VehicleCreationForm";

// exporting to use in test file
export type FormSectionProps = {
	title: string;
	children: ReactNode;
	isCompleted?: boolean;
	isCollapsed: CollapsedOrNot;
	onToggleCollapse: () => void;
	id: keyof Gas_Vehicle_For_DB_POST | keyof Electric_Vehicle_For_DB_POST;
	formNavOptions: FormNavigationOptions;
};

/**Utils passed in to relevant form sections for form UI navigation
 *
 * I put these all in one object to make it clear what they're for.
 */
export type FormNavigationOptions = {
	// onNext is what happens when user clicks 'Next` to navigate to next form section
	onNext: () => void;
	// Is this the last section in the form. If it is, don't show "Next" button
	isLastSection: boolean;
	// Which number section is it in the form (see formSectionOrder in page.tsx)
	sectionIndex: number; // which section is this in the form. 0 indexed. Uses this to display e.g. "1 of 5"
	totalSections: number; // how many form sections are there in total. Uses this to display e.g. "1 of 5"
};

const FormSection = ({
	title,
	children,
	isCompleted = false,
	isCollapsed,
	onToggleCollapse,
	id,
	formNavOptions,
}: FormSectionProps) => {
	const { onNext, isLastSection, sectionIndex, totalSections } = formNavOptions;

	return (
		<section
			className={`mb-6 rounded-lg border transition-all duration-300 overflow-hidden bg-white dark:bg-neutral-800 shadow-sm
			${isCollapsed === "isNotCollapsed" ? "border-primary-400 dark:border-primary-600 shadow-md" : "border-neutral-200 dark:border-neutral-700"}
			${sectionIndex === 0 && isCollapsed === "isNotCollapsed" ? "ring-2 ring-primary-100 dark:ring-primary-900/30" : ""}`}
			id={id}
		>
			<h3>
				<button
					type="button"
					onClick={onToggleCollapse}
					className={`w-full flex items-center justify-between p-4
					${isCollapsed === "isNotCollapsed" ? "bg-primary-50 dark:bg-primary-900/20 hover:bg-primary-100 dark:hover:bg-primary-900/30" : "bg-neutral-50 dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-700"}
					transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-inset text-left`}
					aria-expanded={isCollapsed === "isNotCollapsed"}
					aria-controls={`${id}-content`}
				>
					<div className="flex items-center flex-grow">
						<span
							className={`text-lg font-semibold ${isCollapsed === "isNotCollapsed" ? "text-primary-700 dark:text-primary-300" : "text-neutral-800 dark:text-neutral-100"}`}
						>
							{title}
						</span>
						{isCompleted && (
							<span
								className="ml-2 flex-shrink-0 text-green-500 dark:text-green-400"
								aria-label="Section completed"
							>
								{/* Up/down chevron */}
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-5 w-5"
									viewBox="0 0 20 20"
									fill="currentColor"
								>
									<path
										fillRule="evenodd"
										d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
										clipRule="evenodd"
									/>
								</svg>
							</span>
						)}

						{sectionIndex !== undefined && totalSections && (
							<span
								className={`ml-3 px-2 py-1 text-xs rounded-full ${isCollapsed === "isNotCollapsed" ? "bg-primary-100 dark:bg-primary-800 text-primary-700 dark:text-primary-200" : "bg-neutral-200 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300"}`}
							>
								{sectionIndex + 1} of {totalSections}
							</span>
						)}
					</div>
					<div className="ml-4 flex-shrink-0">
						{/* Up/down chevron */}
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className={`h-5 w-5 transform transition-transform duration-200 ${isCollapsed === "isNotCollapsed" ? "rotate-180" : ""}`}
							viewBox="0 0 20 20"
							fill="currentColor"
						>
							<path
								fillRule="evenodd"
								d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 011.414 1.414l-4 4a1 1 01-1.414 0l-4-4a1 1 010-1.414z"
								clipRule="evenodd"
							/>
						</svg>
					</div>
				</button>
			</h3>

			<div
				id={`${id}-content`}
				className={`transition-all duration-300 ease-in-out ${
					isCollapsed === "isNotCollapsed"
						? "max-h-[2000px] opacity-100"
						: "max-h-0 opacity-0 overflow-hidden"
				}`}
			>
				<div className="p-4 pt-5 space-y-4 bg-white dark:bg-neutral-800 border-t border-neutral-100 dark:border-neutral-700">
					{children}
				</div>

				{/* Navigation controls at bottom */}
				{isCollapsed === "isNotCollapsed" && (
					<div className="flex justify-end bg-neutral-50 dark:bg-neutral-700/30 p-4 border-t border-neutral-200 dark:border-neutral-700">
						{onNext && !isLastSection && (
							<button
								type="button"
								onClick={onNext}
								className="px-4 py-2 rounded-md bg-primary hover:bg-primary-600 text-white font-medium shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-neutral-900"
							>
								<span className="flex items-center">
									<span>Next Section</span>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="h-5 w-5 ml-1"
										viewBox="0 0 20 20"
										fill="currentColor"
										aria-hidden="true"
									>
										<path
											fillRule="evenodd"
											d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 010 1.414l-4 4a1 1 01-1.414-1.414L12.586 11H5a1 1 110-2h7.586l-2.293-2.293a1 1 010-1.414z"
											clipRule="evenodd"
										/>
									</svg>
								</span>
							</button>
						)}
					</div>
				)}
			</div>
		</section>
	);
};

export default FormSection;
