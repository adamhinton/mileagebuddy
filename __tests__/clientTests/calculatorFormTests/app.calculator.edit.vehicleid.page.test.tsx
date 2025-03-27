//  _______________________________________________________________
// This is (obviously) tests for app/calculator/edit/[vehicleId]/page.tsx
// All it does is display VehicleCreationOrEditForm, which is thoroughly tested already
// So this is just a sanity check to make sure the page renders without errors
//  _______________________________________________________________

import EditVehiclePage from "@/app/calculator/edit/[vehicleId]/page";
import TestReduxStore from "@/app/utils/unitTestUtils/dummyReduxStore";
import testVehicles from "@/app/utils/unitTestUtils/fakeTestVehicles";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

describe("calculator/edit/vehicleId", () => {
	const vehicleForTesting = testVehicles[0];
	const vehicleId = vehicleForTesting.id.toString();

	const vehicleIdPromise = Promise.resolve({ vehicleId });

	it("Renders without errors", () => {
		render(
			<TestReduxStore>
				<EditVehiclePage params={vehicleIdPromise} />
			</TestReduxStore>
		);
	});

	it("Displays the correct vehicle name to be edited", () => {
		render(
			<TestReduxStore>
				<EditVehiclePage params={vehicleIdPromise} />
			</TestReduxStore>
		);

		const vehicleName = screen.getByText(
			`Edit ${vehicleForTesting.vehicleData.vehicleName}`
		);

		expect(vehicleName).toBeVisible();
	});
});
