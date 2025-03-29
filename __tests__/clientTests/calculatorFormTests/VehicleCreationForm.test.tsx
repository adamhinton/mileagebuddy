// ________________________________________________________________
// These tests are very simple because all of the smaller components within this bigger components have their own extensive tests,
// and I don't want to get too far out of the simple scope of a unit testing suite
// ________________________________________________________________

import { fireEvent, render } from "@testing-library/react";
import "@testing-library/jest-dom";
import VehicleCreationOrEditForm from "@/app/calculator/CalculatorFormComponents/VehicleCreationForm";
import TestReduxStore from "@/app/utils/unitTestUtils/dummyReduxStore";
import { VehicleSchemaForPATCH } from "@/app/utils/server/types/VehicleTypes/PATCHVehicleTypes";
import testVehicles from "@/app/utils/unitTestUtils/fakeTestVehicles";
import { VehicleToBePostedSchema } from "@/app/utils/server/types/VehicleTypes/POSTVehicleTypes";

// Added this because form submit logic uses router to push to /dashboard on success, and the test renders were getting errors without it
jest.mock("next/navigation", () => ({
	useRouter: jest.fn(() => ({
		push: jest.fn(),
		replace: jest.fn(),
		prefetch: jest.fn(),
		back: jest.fn(),
		forward: jest.fn(),
		refresh: jest.fn(),
	})),
	usePathname: jest.fn(() => "/"),
	useSearchParams: jest.fn(() => new URLSearchParams()),
}));

describe("VehicleCreationOrEditForm", () => {
	it("renders without errors in edit mode", () => {
		renderVehicleForm("editVehicle");
	});

	it("renders without errors in new vehicle mode", () => {
		renderVehicleForm("newVehicle");
	});

	it("updates form section visibility when vehicle type changes", () => {
		const { getByLabelText, queryByText } = renderVehicleForm("newVehicle");

		// Select electric vehicle
		const electricRadio = getByLabelText("Electric Vehicle");
		fireEvent.click(electricRadio);

		// Verify electric vehicle form section is visible and gas is not
		expect(queryByText("Electric Vehicle Data")).toBeInTheDocument();
		expect(queryByText("Gas Vehicle Data")).not.toBeInTheDocument();
	});
});

/**Simple wrapper to pass in props and redux state */
const renderVehicleForm = (mode: "editVehicle" | "newVehicle") => {
	return render(
		<TestReduxStore>
			{mode === "editVehicle" ? (
				<VehicleCreationOrEditForm
					mode="editVehicle"
					schema={VehicleSchemaForPATCH}
					vehicleToEdit={testVehicles[0]}
				/>
			) : (
				<VehicleCreationOrEditForm
					mode="newVehicle"
					schema={VehicleToBePostedSchema}
				/>
			)}
		</TestReduxStore>
	);
};
