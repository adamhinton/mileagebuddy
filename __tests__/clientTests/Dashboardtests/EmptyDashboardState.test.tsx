// _______________________________________________________________
// This is (obviously) tests for EmptyDashboardState.tsx
// This component is fairly simple so there isn't too much to test
// ______________________________________________________________

import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import EmptyDashboardState from "@/app/dashboard/components/EmptyDashboardState";

describe("EmptyDashboardState", () => {
	it("renders without errors", () => {
		render(<EmptyDashboardState />);
	});

	it("displays the correct heading", () => {
		render(<EmptyDashboardState />);

		const heading = screen.getByText(/No vehicles yet/i);
		expect(heading).toBeVisible();
	});

	it("displays the correct paragraph text", () => {
		render(<EmptyDashboardState />);
		const paragraph = screen.getByText(
			/Add your first vehicle to calculate its true cost per mile/i
		);
		expect(paragraph).toBeVisible();
	});

	it("contains a link to the calculator page", () => {
		render(<EmptyDashboardState />);

		const link = screen.getByRole("link", { name: /Add Vehicle/i });
		expect(link).toBeVisible();
	});
	
	it("matches snapshot from 4.30.2025", () => {
		const { container } = render(<EmptyDashboardState />);
		expect(container).toMatchSnapshot();
	});
});
