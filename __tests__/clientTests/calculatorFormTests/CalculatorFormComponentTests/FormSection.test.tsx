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
	isCollapsed = "isCollapsed" as const,
	onToggleCollapse = jest.fn(),
	id = "vehicleData" as const,
	formNavOptions = {
		onNext: jest.fn(),
		isLastSection: false,
		sectionIndex: 0,
		totalSections: 1,
	},
}: Partial<FormSectionProps>) => {
	return render(
		<FormSection
			title={title}
			isCompleted={isCompleted}
			isCollapsed={isCollapsed}
			onToggleCollapse={onToggleCollapse}
			id={id}
			formNavOptions={formNavOptions}
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
			formNavOptions: {
				onNext: jest.fn(),
				isLastSection: false,
				sectionIndex: 1,
				totalSections: 3,
			},
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
			formNavOptions: {
				onNext: jest.fn(),
				isLastSection: false,
				sectionIndex: 0,
				totalSections: 1,
			},
		});
		expect(screen.getByText("Next Section")).toBeVisible();
	});

	it("does not display the Next button when it is the last section", () => {
		renderFormSection({
			isCollapsed: "isNotCollapsed",
			formNavOptions: {
				onNext: jest.fn(),
				isLastSection: true,
				sectionIndex: 0,
				totalSections: 1,
			},
		});
		expect(screen.queryByText("Next")).toBeNull();
	});

	// Not testing that the onNext actually does what it's supposed to because that is passed in from a parent component
	it("calls onNext when the Next button is clicked", () => {
		const onNext = jest.fn();
		renderFormSection({
			isCollapsed: "isNotCollapsed",
			formNavOptions: {
				onNext: onNext,
				isLastSection: false,
				sectionIndex: 0,
				totalSections: 1,
			},
		});
		fireEvent.click(screen.getByText("Next Section"));
		expect(onNext).toHaveBeenCalled();
	});
});
