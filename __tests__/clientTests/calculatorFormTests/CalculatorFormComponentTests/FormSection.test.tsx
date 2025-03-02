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
	it("renders without errors when not collapsed", () => {
		renderFormSection({});
		expect(screen.getByText("Test Section")).toBeVisible();
	});

	it("renders without errors when collapsed", () => {
		renderFormSection({
			isCollapsed: "isCollapsed",
		});
		expect(screen.getByText("Test Section")).toBeVisible();
	});

	it("displays the correct title and section index", () => {
		renderFormSection({
			title: "Custom Title",
			sectionIndex: 1,
			totalSections: 3,
		});
		expect(screen.getByText("Custom Title")).toBeInTheDocument();
		expect(screen.getByText("2 of 3")).toBeInTheDocument();
	});

	it("calls onToggleCollapse when the header is clicked", () => {
		const onToggleCollapse = jest.fn();
		renderFormSection({ onToggleCollapse });
		fireEvent.click(screen.getByText("Test Section"));
		expect(onToggleCollapse).toHaveBeenCalled();
	});

	it("displays children when not collapsed", () => {
		renderFormSection({ isCollapsed: "isNotCollapsed" });
		expect(screen.getByText("Test Content")).toBeInTheDocument();
	});

	it("does not display children when collapsed", () => {
		renderFormSection({ isCollapsed: "isCollapsed" });
		expect(screen.queryByText("Test Content")).toBeNull();
	});

	// Not testing that it actually collapses here because that's dependent on a function passed in from the parent component
	it("Calls onToggleCollapse when header is clicked", () => {
		const onToggleCollapse = jest.fn();

		renderFormSection({ onToggleCollapse });
		fireEvent.click(screen.getByText("Test Section"));
		expect(onToggleCollapse).toHaveBeenCalled();
	});

	it("displays the Next button when not the last section", () => {
		renderFormSection({
			isCollapsed: "isNotCollapsed",
			isLastSection: false,
		});
		expect(screen.getByText("Next")).toBeVisible();
	});

	it("does not display the Next button when it is the last section", () => {
		renderFormSection({
			isCollapsed: "isNotCollapsed",
			isLastSection: true,
		});
		expect(screen.queryByText("Next")).toBeNull();
	});

	// Not testing that the onNext actually does what it's supposed to because that is passed in from a parent component
	it("calls onNext when the Next button is clicked", () => {
		const onNext = jest.fn();
		renderFormSection({
			isCollapsed: "isNotCollapsed",
			isLastSection: false,
			onNext,
		});
		fireEvent.click(screen.getByText("Next"));
		expect(onNext).toHaveBeenCalled();
	});
});
