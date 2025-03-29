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

// Added this because form submit logic uses router to push to /dashboard on success, and the test renders were getting errors without it
jest.mock("next/navigation", () => ({
	useRouter: jest.fn(() => ({
		push: jest.fn(),
		replace: jest.fn(),
		prefetch: jest.fn(),
		back: jest.fn(),
		forward: jest.fn(),
		refresh: jest.fn(),
		// Add other router properties or methods as needed for your tests
	})),
	usePathname: jest.fn(() => "/"),
	useSearchParams: jest.fn(() => new URLSearchParams()),
}));

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
