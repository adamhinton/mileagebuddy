// _________________________________________________________________
// This is (obviously) tests for ConfirmationDialog.tsx
// This component typically appears nested in Button.tsx
// _________________________________________________________________

import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import ConfirmationDialog from "@/app/components/ConfirmationDialog";

describe("ConfirmationDialog.tsx", () => {
	const defaultProps = {
		title: "Test Title",
		message: "Test Message",
		confirmButtonText: "Confirm",
		cancelButtonText: "Cancel",
		onConfirm: jest.fn(),
		onCancel: jest.fn(),
		isOpen: true,
	};

	describe("Rendering", () => {
		it("renders without errors when isOpen is true", () => {
			render(<ConfirmationDialog {...defaultProps} />);
			expect(screen.getByText("Test Title")).toBeInTheDocument();
			expect(screen.getByText("Test Message")).toBeInTheDocument();
		});

		it("does not render anything when isOpen is false", () => {
			const { container } = render(
				<ConfirmationDialog {...defaultProps} isOpen={false} />
			);
			expect(container).toBeEmptyDOMElement();
		});
	});

	describe("Content", () => {
		it("displays the correct title", () => {
			render(<ConfirmationDialog {...defaultProps} />);
			expect(screen.getByText("Test Title")).toBeInTheDocument();
		});

		it("displays the correct message", () => {
			render(<ConfirmationDialog {...defaultProps} />);
			expect(screen.getByText("Test Message")).toBeInTheDocument();
		});

		it("displays the correct button texts", () => {
			render(<ConfirmationDialog {...defaultProps} />);
			expect(screen.getByText("Confirm")).toBeInTheDocument();
			expect(screen.getByText("Cancel")).toBeInTheDocument();
		});
	});

	describe("Button functionality", () => {
		it("calls onConfirm when confirm button is clicked", () => {
			render(<ConfirmationDialog {...defaultProps} />);
			fireEvent.click(screen.getByText("Confirm"));
			expect(defaultProps.onConfirm).toHaveBeenCalledTimes(1);
		});

		it("calls onCancel when cancel button is clicked", () => {
			render(<ConfirmationDialog {...defaultProps} />);
			fireEvent.click(screen.getByText("Cancel"));
			expect(defaultProps.onCancel).toHaveBeenCalledTimes(1);
		});
	});

	describe("Styling", () => {
		it("applies default button class when no custom class provided", () => {
			render(<ConfirmationDialog {...defaultProps} />);
			const confirmButton = screen.getByText("Confirm");
			expect(confirmButton.className).toContain("bg-red-600");
			expect(confirmButton.className).toContain("text-white");
			expect(confirmButton.className).toContain("hover:bg-red-700");
		});

		it("applies custom button class when provided", () => {
			const customClass = "bg-blue-500 text-black";
			render(
				<ConfirmationDialog
					{...defaultProps}
					confirmButtonClass={customClass}
				/>
			);
			const confirmButton = screen.getByText("Confirm");
			expect(confirmButton.className).toContain(customClass);
			expect(confirmButton.className).not.toContain("bg-red-600");
		});
	});
});
