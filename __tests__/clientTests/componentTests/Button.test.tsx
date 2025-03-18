import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import Button from "@/app/components/Button";

describe("Button.tsx", () => {
	describe("Basic rendering tests", () => {
		it("renders without errors", () => {
			const mockOnClick = jest.fn();
			render(<Button text="Test Button" onClick={mockOnClick} />);

			const button = screen.getByRole("button", { name: /test button/i });
			expect(button).toBeInTheDocument();
		});

		it("displays the provided text", () => {
			const mockOnClick = jest.fn();
			const buttonText = "Click Me";
			render(<Button text={buttonText} onClick={mockOnClick} />);

			const button = screen.getByRole("button", { name: /click me/i });
			expect(button).toHaveTextContent(buttonText);
		});
	});

	describe("Button variants", () => {
		it("renders primary variant", () => {
			const mockOnClick = jest.fn();
			render(
				<Button text="Primary Button" onClick={mockOnClick} variant="primary" />
			);

			const button = screen.getByRole("button", { name: /primary button/i });
			expect(button).toHaveClass("bg-primary");
			expect(button).toHaveClass("text-white");
		});

		it("renders danger variant", () => {
			const mockOnClick = jest.fn();
			render(
				<Button text="Danger Button" onClick={mockOnClick} variant="danger" />
			);

			const button = screen.getByRole("button", { name: /danger button/i });
			expect(button).toHaveClass("bg-red-600");
			expect(button).toHaveClass("text-white");
		});

		it("renders secondary variant", () => {
			const mockOnClick = jest.fn();
			render(
				<Button
					text="Secondary Button"
					onClick={mockOnClick}
					variant="secondary"
				/>
			);

			const button = screen.getByRole("button", { name: /secondary button/i });
			expect(button).toHaveClass("bg-background-elevated");
			expect(button).toHaveClass("text-neutral-text");
			expect(button).toHaveClass("border-primary-100");
		});
	});

	describe("Button functionality", () => {
		it("calls onClick handler when clicked", () => {
			const mockOnClick = jest.fn();
			render(<Button text="Click Me" onClick={mockOnClick} />);

			const button = screen.getByRole("button", {
				name: /click me/i,
			});
			fireEvent.click(button);

			expect(mockOnClick).toHaveBeenCalledTimes(1);
		});

		it("is disabled when isDisabled prop is true", () => {
			const mockOnClick = jest.fn();
			render(
				<Button
					text="Disabled Button"
					onClick={mockOnClick}
					isDisabled={true}
				/>
			);

			const button = screen.getByRole("button", {
				name: /disabled button/i,
			});
			expect(button).toBeDisabled();

			// Verify clicking doesn't trigger the onClick handler when disabled
			fireEvent.click(button);
			expect(mockOnClick).not.toHaveBeenCalled();
		});

		it("applies custom className when provided", () => {
			const mockOnClick = jest.fn();
			const customClass = "test-custom-class";
			render(
				<Button
					text="Custom Class"
					onClick={mockOnClick}
					className={customClass}
				/>
			);

			const button = screen.getByRole("button", {
				name: /custom class/i,
			});
			expect(button).toHaveClass(customClass);
		});

		it("uses provided type attribute", () => {
			const mockOnClick = jest.fn();
			render(
				<Button text="Submit Button" onClick={mockOnClick} type="submit" />
			);

			const button = screen.getByRole("button", {
				name: /submit button/i,
			});
			expect(button).toHaveAttribute("type", "submit");
		});

		it("uses provided aria-label or falls back to text", () => {
			const mockOnClick = jest.fn();

			// With custom aria-label
			render(
				<Button
					text="Button Text"
					onClick={mockOnClick}
					ariaLabel="Custom Aria Label"
				/>
			);
			const buttonWithAriaLabel = screen.getByRole("button", {
				name: /custom aria label/i,
			});
			expect(buttonWithAriaLabel).toHaveAttribute(
				"aria-label",
				"Custom Aria Label"
			);

			// Fallback to text when no aria-label provided
			render(<Button text="Fallback Text" onClick={mockOnClick} />);
			const buttonWithoutAriaLabel = screen.getByRole("button", {
				name: /fallback text/i,
			});
			expect(buttonWithoutAriaLabel).toHaveAttribute(
				"aria-label",
				"Fallback Text"
			);
		});
	});

	// The actual confirmation dialog component is tested in ConfirmationDialog.test.tsx
	describe("Confirmation dialog", () => {
		it("shows confirmation dialog when isConfirmationRequired is true", () => {
			const mockOnClick = jest.fn();
			render(
				<Button
					text="Delete Item"
					onClick={mockOnClick}
					isConfirmationRequired={true}
					confirmationDialogOptions={{
						title: "Confirm Delete",
						message: "Are you sure you want to delete this item?",
						confirmButtonText: "Delete",
						cancelButtonText: "Cancel",
					}}
				/>
			);

			const button = screen.getByRole("button", { name: /delete item/i });
			fireEvent.click(button);

			expect(screen.getByText("Confirm Delete")).toBeInTheDocument();
			expect(
				screen.getByText("Are you sure you want to delete this item?")
			).toBeInTheDocument();

			expect(mockOnClick).not.toHaveBeenCalled();
		});

		it("does not show confirmation dialog when isConfirmationRequired is false", () => {
			const mockOnClick = jest.fn();
			render(
				<Button
					text="Save Item"
					onClick={mockOnClick}
					isConfirmationRequired={false}
				/>
			);

			const button = screen.getByRole("button", { name: /save item/i });
			fireEvent.click(button);

			expect(mockOnClick).toHaveBeenCalledTimes(1);

			expect(screen.queryByText("Confirm Action")).not.toBeInTheDocument();
		});

		it("calls onClick handler after confirming in dialog", () => {
			const mockOnClick = jest.fn();
			render(
				<Button
					text="Delete Item"
					onClick={mockOnClick}
					isConfirmationRequired={true}
					confirmationDialogOptions={{
						title: "Confirm Delete",
						message: "Are you sure?",
						confirmButtonText: "Yes, Delete",
						cancelButtonText: "No, Cancel",
					}}
				/>
			);

			const button = screen.getByRole("button", { name: /delete item/i });
			fireEvent.click(button);

			const confirmButton = screen.getByRole("button", {
				name: /yes, delete/i,
			});
			fireEvent.click(confirmButton);

			expect(mockOnClick).toHaveBeenCalledTimes(1);
		});

		it("does not call onClick handler when canceling in dialog", () => {
			const mockOnClick = jest.fn();
			render(
				<Button
					text="Delete Item"
					onClick={mockOnClick}
					isConfirmationRequired={true}
					confirmationDialogOptions={{
						title: "Confirm Delete",
						message: "Are you sure?",
						confirmButtonText: "Yes, Delete",
						cancelButtonText: "No, Cancel",
					}}
				/>
			);

			const button = screen.getByRole("button", { name: /delete item/i });
			fireEvent.click(button);

			const cancelButton = screen.getByRole("button", {
				name: /no, cancel/i,
			});
			fireEvent.click(cancelButton);

			expect(mockOnClick).not.toHaveBeenCalled();
		});

		it("shows custom dialog text when confirmationDialogOptions are provided", () => {
			const mockOnClick = jest.fn();
			const customTitle = "Custom Dialog Title";
			const customMessage = "This is a custom confirmation message";
			const customConfirmText = "Proceed";
			const customCancelText = "Go Back";

			render(
				<Button
					text="Action Button"
					onClick={mockOnClick}
					isConfirmationRequired={true}
					confirmationDialogOptions={{
						title: customTitle,
						message: customMessage,
						confirmButtonText: customConfirmText,
						cancelButtonText: customCancelText,
					}}
				/>
			);

			const button = screen.getByRole("button", { name: /action button/i });
			fireEvent.click(button);

			expect(screen.getByText(customTitle)).toBeInTheDocument();
			expect(screen.getByText(customMessage)).toBeInTheDocument();
			expect(screen.getByText(customConfirmText)).toBeInTheDocument();
			expect(screen.getByText(customCancelText)).toBeInTheDocument();
		});
	});
});
