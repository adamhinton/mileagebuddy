import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import FormErrorSummary from "@/app/calculator/CalculatorFormComponents/FormErrorSummary";
import { FieldErrors } from "react-hook-form";
import { VehiclePATCHorPOST } from "@/app/calculator/CalculatorFormComponents/VehicleCreationForm";

/**
 * Helper render function for testing FormErrorSummary component
 * This provides default values and allows for customizing props
 */
const renderFormErrorSummary = (customProps?: {
	errors?: FieldErrors<VehiclePATCHorPOST>;
}) => {
	const defaultProps = {
		errors: {} as FieldErrors<VehiclePATCHorPOST>,
		...customProps,
	};

	return render(<FormErrorSummary {...defaultProps} />);
};

describe("FormErrorSummary", () => {
	it("renders without crashing", () => {
		const { container } = renderFormErrorSummary();
		expect(container).toBeInTheDocument();
	});

	it("does not render if there are no errors", () => {
		const { container } = renderFormErrorSummary({ errors: {} });
		expect(container).toBeEmptyDOMElement();
	});

	it("displays error message for a single section with error", () => {
		const mockErrors: FieldErrors<VehiclePATCHorPOST> = {
			vehicleData: { message: "Vehicle data error" },
		};

		renderFormErrorSummary({ errors: mockErrors });

		expect(screen.getByText("Vehicle Data")).toBeInTheDocument();
		expect(screen.getByText("section has errors")).toBeInTheDocument();
	});

	it("displays error messages for multiple sections with errors", () => {
		const mockErrors: FieldErrors<VehiclePATCHorPOST> = {
			vehicleData: { message: "Vehicle data error" },
			fixedCosts: { message: "Fixed costs error" },
		};

		renderFormErrorSummary({ errors: mockErrors });

		expect(screen.getByText("Vehicle Data")).toBeInTheDocument();
		expect(screen.getByText("Fixed Costs")).toBeInTheDocument();
	});

	it("limits to showing a maximum of three errors", () => {
		const mockErrors: FieldErrors<VehiclePATCHorPOST> = {
			vehicleData: { message: "Error 1" },
			fixedCosts: { message: "Error 2" },
			usage: { message: "Error 3" },
			yearlyMaintenanceCosts: { message: "Error 4" },
			variableCosts: { message: "Error 5" },
		};

		renderFormErrorSummary({ errors: mockErrors });

		// Check that we have exactly 3 list items
		const listItems = screen.getAllByRole("listitem");
		expect(listItems).toHaveLength(3);
	});

	it("skips ignored fields", () => {
		const mockErrors = {
			userid: { message: "Userid error" },
			root: { message: "Root error" },
			type: { message: "Type error" },
			vehicleData: { message: "Vehicle data error" },
		} as FieldErrors<VehiclePATCHorPOST>;

		renderFormErrorSummary({ errors: mockErrors });

		// Should only show the vehicleData error, not the skipped fields
		expect(screen.getByText("Vehicle Data")).toBeInTheDocument();
		expect(screen.queryByText("userid")).not.toBeInTheDocument();
		expect(screen.queryByText("root")).not.toBeInTheDocument();
		expect(screen.queryByText("type")).not.toBeInTheDocument();
	});
});
