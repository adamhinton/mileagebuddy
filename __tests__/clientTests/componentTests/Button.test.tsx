import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import Button from "@/app/components/Button";

const mockOnClick = jest.fn();

const testConfirmationDialogOptions = {
	title: "Test Confirmation",
	message: "Are you sure?",
	confirmButtonText: "Yes",
	cancelButtonText: "No",
};

describe("Button.tsx", () => {
	describe("Basic rendering tests", () => {
		it("renders without errors when confirmation isn't required", () => {
			render(
				<Button
					text="Test Button"
					onClick={mockOnClick}
					isConfirmationRequired={false}
				/>
			);

			const button = screen.getByRole("button", { name: /test button/i });
			expect(button).toBeInTheDocument();
		});

		it("renders without errors when confirmation is required", () => {
			render(
				<Button
					text="Test Button"
					onClick={mockOnClick}
					isConfirmationRequired={true}
					confirmationDialogOptions={testConfirmationDialogOptions}
				/>
			);

			const button = screen.getByRole("button", { name: /test button/i });
			expect(button).toBeInTheDocument();
		});

		it("displays the provided text", () => {
			const buttonText = "Click Me";
			render(
				<Button
					text={buttonText}
					onClick={mockOnClick}
					isConfirmationRequired={false}
				/>
			);

			const button = screen.getByRole("button", { name: /click me/i });
			expect(button).toHaveTextContent(buttonText);
		});
	});

	describe("Button variants", () => {
		it("renders primary variant without errors", () => {
			render(
				<Button
					text="Primary Button"
					onClick={mockOnClick}
					variant="primary"
					isConfirmationRequired={false}
				/>
			);

			const button = screen.getByRole("button", { name: /primary button/i });
			expect(button).toHaveClass("bg-primary");
			expect(button).toHaveClass("text-white");
		});

		it("renders danger variant without errors", () => {
			render(
				<Button
					text="Danger Button"
					onClick={mockOnClick}
					variant="danger"
					isConfirmationRequired={false}
				/>
			);

			const button = screen.getByRole("button", { name: /danger button/i });
			expect(button).toHaveClass("bg-red-600");
			expect(button).toHaveClass("text-white");
		});

		it("renders secondary variant without errors", () => {
			render(
				<Button
					text="Secondary Button"
					onClick={mockOnClick}
					variant="secondary"
					isConfirmationRequired={false}
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
			render(
				<Button
					text="Click Me"
					onClick={mockOnClick}
					isConfirmationRequired={false}
				/>
			);

			const button = screen.getByRole("button", {
				name: /click me/i,
			});
			fireEvent.click(button);

			expect(mockOnClick).toHaveBeenCalledTimes(1);
		});

		it("is disabled when isDisabled prop is true", () => {
			render(
				<Button
					text="Disabled Button"
					onClick={mockOnClick}
					isDisabled={true}
					isConfirmationRequired={false}
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
			const customClass = "test-custom-class";
			render(
				<Button
					text="Custom Class"
					onClick={mockOnClick}
					className={customClass}
					isConfirmationRequired={false}
				/>
			);

			const button = screen.getByRole("button", {
				name: /custom class/i,
			});
			expect(button).toHaveClass(customClass);
		});

		it("uses provided type attribute", () => {
			render(
				<Button
					text="Submit Button"
					onClick={mockOnClick}
					type="submit"
					isConfirmationRequired={false}
				/>
			);

			const button = screen.getByRole("button", {
				name: /submit button/i,
			});
			expect(button).toHaveAttribute("type", "submit");
		});

		it("uses provided aria-label or falls back to text", () => {
			// With custom aria-label
			render(
				<Button
					text="Button Text"
					onClick={mockOnClick}
					ariaLabel="Custom Aria Label"
					isConfirmationRequired={false}
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
			render(
				<Button
					text="Fallback Text"
					onClick={mockOnClick}
					isConfirmationRequired={false}
				/>
			);
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

			// "Confirm Action" is the default text for the confirmation dialog title
			expect(screen.queryByText("Confirm Action")).not.toBeInTheDocument();
		});

		it("calls onClick handler after confirming in dialog", () => {
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

			expect(mockOnClick).not.toHaveBeenCalled();

			fireEvent.click(confirmButton);

			expect(mockOnClick).toHaveBeenCalledTimes(1);
		});

		it("does not call onClick handler when canceling in dialog", () => {
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
