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

	const styles = tailWindClassNames.mileageCalcForm.SECTION;
	const isActive = isCollapsed === "isNotCollapsed";

	return (
		<section
			className={`${styles.CONTAINER} 
				${isActive ? styles.CONTAINER_ACTIVE : styles.CONTAINER_INACTIVE}
				${sectionIndex === 0 && isActive ? styles.CONTAINER_FIRST_ACTIVE : ""}`}
			id={id}
		>
			<h3>
				{/* Clicking anywhere on this element expands/collapses this form section */}
				<button
					type="button"
					onClick={onToggleCollapse}
					className={`${styles.BUTTON} 
						${isActive ? styles.BUTTON_ACTIVE : styles.BUTTON_INACTIVE}`}
					aria-expanded={isActive}
					aria-controls={`${id}-content`}
				>
					<div className="flex items-center flex-grow">
						<span
							className={`${styles.TITLE} 
								${isActive ? styles.TITLE_ACTIVE : styles.TITLE_INACTIVE}`}
						>
							{title}
						</span>
						{isCompleted && (
							<span
								className="ml-2 flex-shrink-0 text-green-500 dark:text-green-400"
								aria-label="Section completed"
							>
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
								className={`${styles.BADGE} 
									${isActive ? styles.BADGE_ACTIVE : styles.BADGE_INACTIVE}`}
							>
								{sectionIndex + 1} of {totalSections}
							</span>
						)}
					</div>
					<div className="ml-4 flex-shrink-0">
						{/* Up/down chevron */}
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className={`${styles.CHEVRON} ${isActive ? styles.CHEVRON_ACTIVE : ""}`}
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
				className={`${styles.CONTENT_WRAPPER} ${
					isActive
						? styles.CONTENT_WRAPPER_ACTIVE
						: styles.CONTENT_WRAPPER_INACTIVE
				}`}
			>
				<div className={styles.CONTENT_INNER}>{children}</div>

				{/* Navigation controls at bottom */}
				{isActive && (
					<div className={styles.FOOTER}>
						{onNext && !isLastSection && (
							<button
								type="button"
								onClick={onNext}
								className={styles.NEXT_BUTTON}
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
