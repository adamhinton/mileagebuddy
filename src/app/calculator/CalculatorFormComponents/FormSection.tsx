// README
// This is part of the mileage form calculator used to build a Vehicle
// Each sub-object of Vehicle (see GetVehicleTypes.ts) will have one of these FormSection's
// This is a collapsible section of the form
// You list this as an open tag and put the relevant inputs inside it. Mostly MileageCalcNumberInputs
// TODO unit tests once this is fully fleshed out

import tailWindClassNames from "@/app/utils/clientUtils/styling/tailwindClassNames";
import {
	Electric_Vehicle_For_DB_POST,
	Gas_Vehicle_For_DB_POST,
} from "@/app/utils/server/types/VehicleTypes/POSTVehicleTypes";
import { ReactNode } from "react";
import { type CollapsedOrNot } from "../page";

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
			className={`${tailWindClassNames.mileageCalcForm.FORM_SECTION}`}
			id={id}
		>
			<button
				type="button"
				onClick={onToggleCollapse}
				className="w-full flex items-center justify-between p-2 bg-background-elevated"
			>
				<div
					className={`${tailWindClassNames.mileageCalcForm.FORM_SECTION_HEADER}`}
				>
					<h3 className="text-lg font-medium text-neutral-text">{title}</h3>
					{sectionIndex !== undefined && totalSections && (
						<span className="text-sm text-neutral-text ml-2">
							{sectionIndex + 1} of {totalSections}
						</span>
					)}
					{isCompleted && <span className="ml-2 text-accent">✓</span>}
					{isCollapsed === "isCollapsed" ? <span>↓</span> : <span>↑</span>}
				</div>
				{/* TODO up/down chevron icons */}
			</button>

			{isCollapsed === "isNotCollapsed" && (
				<div>
					{children}

					{/* Navigation controls at bottom */}
					<div className="flex justify-end mt-4 space-x-2">
						{/* Optional Previous button if needed */}
						{onNext && !isLastSection && (
							<button
								type="button"
								onClick={onNext}
								className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-600 focus:ring-2 focus:ring-primary focus:outline-none"
							>
								Next
							</button>
						)}
					</div>
				</div>
			)}
		</section>
	);
};

export default FormSection;
