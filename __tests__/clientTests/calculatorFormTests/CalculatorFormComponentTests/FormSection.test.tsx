//_________________________________________
// This is (obviously) tests for FormSection.tsx
//_________________________________________

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import FormSection, {
	FormSectionProps,
} from "@/app/calculator/CalculatorFormComponents/FormSection";

/**Wrapper that abstracts as much parent stuff as possible so we can purely test this component */
const renderFormSection = ({
	title = "Test Section",
	children = <div>Test Content</div>,
	isCompleted = false,
	// This is a union type that can be either "isCollapsed" or "isNotCollapsed"
	isCollapsed = "isNotCollapsed" as const,
	onToggleCollapse = jest.fn(),
	id = "vehicleData" as const,
	onNext = jest.fn(),
	isLastSection = false,
	sectionIndex = 0,
	totalSections = 1,
	// Partial because we have default values for all props, so we only need to pass in things we're changing
}: Partial<FormSectionProps>) => {
	return render(
		<FormSection
			title={title}
			isCompleted={isCompleted}
			isCollapsed={isCollapsed}
			onToggleCollapse={onToggleCollapse}
			id={id}
			onNext={onNext}
			isLastSection={isLastSection}
			sectionIndex={sectionIndex}
			totalSections={totalSections}
		>
			{children}
		</FormSection>
	);
};

describe("FormSection.tsx", () => {
	it("renders without crashing when not collapsed", () => {
		renderFormSection({});
		expect(screen.getByText("Test Section")).toBeInTheDocument();
	});

	it("renders without crashing when collapsed", () => {
		renderFormSection({
			isCollapsed: "isCollapsed",
		});
		expect(screen.getByText("Test Section")).toBeInTheDocument();
	});
});
