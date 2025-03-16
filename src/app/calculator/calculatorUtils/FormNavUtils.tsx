import {
	Electric_Vehicle_For_DB_POST,
	Gas_Vehicle_For_DB_POST,
} from "@/app/utils/server/types/VehicleTypes/POSTVehicleTypes";
import { useCallback } from "react";

/**The names of the sub-objects of type Vehicle (excluding the three strings below), each of which is also the title of its respective collapsible form section */
export type CollapsibleSectionTitles = Exclude<
	keyof Gas_Vehicle_For_DB_POST | keyof Electric_Vehicle_For_DB_POST,
	// Every key of type Vehicle except these three
	"userid" | "vehiclesOrder" | "type"
>;

/**
 * Custom hook to handle form section navigation.
 * @param formSectionOrder - The order of form sections.
 * @param setCollapsedSections - Updates which sections are/n't collapsed
 * @returns An object containing the navigation functions.
 */
export const useFormNavigation = (
	formSectionOrder: Readonly<CollapsibleSectionTitles[]>,
	setCollapsedSections: React.Dispatch<
		React.SetStateAction<
			Record<CollapsibleSectionTitles, "isCollapsed" | "isNotCollapsed">
		>
	>
) => {
	/**
	 * Function to navigate to the next section.
	 */
	const goToNextSection = useCallback(
		(currentSectionId: CollapsibleSectionTitles) => {
			const currentIndex = formSectionOrder.indexOf(currentSectionId);

			// If the current section is not the last section
			if (currentIndex < formSectionOrder.length - 1) {
				const nextSectionId = formSectionOrder[currentIndex + 1];
				// Expand next section and collapse current
				setCollapsedSections((prev) => {
					return {
						...prev,
						[currentSectionId]: "isCollapsed",
						[nextSectionId]: "isNotCollapsed",
					};
				});

				// Scroll to next section with better positioning
				setTimeout(() => {
					const element = document.getElementById(nextSectionId);
					if (element) {
						// Changed from "start" to "center" to ensure the section header is fully visible
						element.scrollIntoView({ behavior: "smooth", block: "center" });

						// For better user experience, ensure the section button gets focus
						const sectionButton = element.querySelector("button");
						if (sectionButton) {
							sectionButton.focus();
						}
					}
				}, 100);
			}
		},
		[formSectionOrder, setCollapsedSections]
	);

	/**
	 * Function to toggle the collapsed state of a section.
	 * @param sectionId - The ID of the section to toggle.
	 */
	const toggleSectionCollapse = useCallback(
		(sectionId: CollapsibleSectionTitles) => {
			// Collapse current section, and uncollapse next section
			setCollapsedSections((prev) => ({
				...prev,
				[sectionId]:
					prev[sectionId] === "isCollapsed" ? "isNotCollapsed" : "isCollapsed",
			}));
		},
		[setCollapsedSections]
	);

	return {
		goToNextSection,
		toggleSectionCollapse,
	};
};
