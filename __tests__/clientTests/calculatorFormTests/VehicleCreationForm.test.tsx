// ________________________________________________________________
// These tests are very simple because all of the smaller components within this bigger components have their own extensive tests,
// and I don't want to get too far out of the simple scope of a unit testing suite
// ________________________________________________________________

import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import VehicleCreationOrEditForm from "@/app/calculator/CalculatorFormComponents/VehicleCreationForm";
import TestReduxStore from "@/app/utils/unitTestUtils/dummyReduxStore";
import { VehicleSchemaForPATCH } from "@/app/utils/server/types/VehicleTypes/PATCHVehicleTypes";
import testVehicles from "@/app/utils/unitTestUtils/fakeTestVehicles";
import { VehicleToBePostedSchema } from "@/app/utils/server/types/VehicleTypes/POSTVehicleTypes";

describe("VehicleCreationOrEditForm", () => {
	it("renders without errors in edit mode", () => {
		renderVehicleForm("editVehicle");
	});

	it("renders without errors in new vehicle mode", () => {
		renderVehicleForm("newVehicle");
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
