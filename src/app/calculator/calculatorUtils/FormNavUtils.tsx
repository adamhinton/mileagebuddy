// _______________________________________________________
// Form navigation utilities for the vehicle creation/edit form.
// It's divided in to sub-sections that are collapsible.
// _______________________________________________________

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
	 * Function to navigate to the next section when user hits "Next".
	 */
	const goToNextSection = (sectionId: CollapsibleSectionTitles) => {
		// Find the next section in order
		const currentIndex = formSectionOrder.indexOf(sectionId);
		const nextSectionId = formSectionOrder[currentIndex + 1];

		// If there's a next section, open it and scroll to it
		if (nextSectionId) {
			// Update sections: collapse current section, expand next section
			setCollapsedSections((prev) => ({
				...prev,
				[sectionId]: "isCollapsed", // Collapse the current section
				[nextSectionId]: "isNotCollapsed", // Expand the next section
			}));

			// Wait for the DOM to update before scrolling
			setTimeout(() => {
				const sectionElement = document.getElementById(nextSectionId);
				if (sectionElement) {
					// Adjust this value to position the section better in viewport
					const topOffset = 150; // Increased from 80 to push section higher
					const elementTop = sectionElement.getBoundingClientRect().top;
					const offsetPosition = elementTop + window.scrollY - topOffset;

					// Scroll to next form section
					window.scrollTo({
						top: offsetPosition,
						behavior: "smooth",
					});
				}
			}, 250); // Increased delay to ensure DOM update completes
		}
	};

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
