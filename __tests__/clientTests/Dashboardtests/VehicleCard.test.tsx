// __________________________________________________________
// This is (obviously) tests for VehicleCard.tsx
// This is a component that displays a vehicle card with its calculated costs
// Also contains edit and delete buttons
// It has drag and drop functionality, but that's handled by its parent component SortableVehicleCard.tsx, so that isn't tested here
// __________________________________________________________

import VehicleCard from "@/app/dashboard/components/VehicleCards/VehicleCard";
import { Vehicle } from "@/app/utils/server/types/VehicleTypes/GetVehicleTypes";
import testVehicles from "@/app/utils/unitTestUtils/fakeTestVehicles";
import { DraggableAttributes } from "@dnd-kit/core";
import { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

/**Standard vehicle costs object with no weird edge cases */
const mockVehicleCostBasic = {
	costPerAverageDailyMile: 0.45,
	costPerExtraMile: 0.28,
	costPerMileBreakdown: {
		fixedCostsPerMile: 0.15,
		variableCostsPerMile: 0.1,
		maintenanceCostPerMile: 0.08,
		averagefuelCostPerMileDollars: 0.12,
		netLossProfitPerMile: 0.0,
	},
	// This isn't actually needed here, the vehicle info is accesed another way
	vehicle: {} as Vehicle,
};

// Type assertion because TS doesn't know that there is for sure a gas vehicle in here
const basicGasVehicle = testVehicles.find(
	(v) => v.type === "gas"
) as unknown as Vehicle;

// Type assertion because TS doesn't know that there is for sure an EV in here
const basicElectricVehicle = testVehicles.find(
	(v) => v.type === "electric"
) as unknown as Vehicle;

const basicHybridVehicle = testVehicles.find(
	(v) => v.type === "hybrid"
) as unknown as Vehicle;

const mockDragHandleAttributes = {
	attributes: [] as unknown as DraggableAttributes,
	listeners: [] as unknown as SyntheticListenerMap,
};

// Additional setup for the Vehicle Information Display tests
const setupVehicleCardTest = (vehicle: Vehicle) => {
	return render(
		<VehicleCard
			vehicle={vehicle}
			vehicleCost={mockVehicleCostBasic}
			onEdit={jest.fn()}
			onDelete={jest.fn()}
			dragHandleProps={mockDragHandleAttributes}
		/>
	);
};

describe("VehicleCard.tsx", () => {
	describe("Basic Rendering", () => {
		it("renders without errors with gas vehicle", () => {
			setupVehicleCardTest(basicGasVehicle);
		});

		it("renders without errors with electric vehicle", () => {
			setupVehicleCardTest(basicElectricVehicle);
		});

		it("renders without errors with hybrid vehicle", () => {
			setupVehicleCardTest(basicHybridVehicle);
		});
	});

	describe("Vehicle Information Display", () => {
		it("displays the correct vehicle name", () => {
			setupVehicleCardTest(basicGasVehicle);

			const vehicleName = screen.getByText(
				basicGasVehicle.vehicleData.vehicleName
			);
			expect(vehicleName).toBeVisible();
		});

		it("displays correct year, make, model and trim", () => {
			setupVehicleCardTest(basicGasVehicle);

			const { year, make, model, trim } = basicGasVehicle.vehicleData;
			const vehicleInfoText = `${year} ${make} ${model} ${trim}`;
			expect(screen.getByText(vehicleInfoText)).toBeVisible();
		});
	});

	describe("Cost Display", () => {
		it("displays all vehicle details when complete data is provided", () => {
			setupVehicleCardTest(basicGasVehicle);

			const { year, make, model, trim } = basicGasVehicle.vehicleData;
			const vehicleInfoText = `${year} ${make} ${model} ${trim}`;
			expect(screen.getByText(vehicleInfoText)).toBeVisible();
		});

		it("displays cost per mile with correct formatting", () => {
			setupVehicleCardTest(basicGasVehicle);

			const costPerMileText = `$${mockVehicleCostBasic.costPerAverageDailyMile.toFixed(
				2
			)}`;
			expect(screen.getByText(costPerMileText)).toBeVisible();
		});

		it("displays extra mile cost with correct formatting", () => {
			setupVehicleCardTest(basicGasVehicle);

			const extraMileCostText = `$${mockVehicleCostBasic.costPerExtraMile.toFixed(
				2
			)}`;
			expect(screen.getByText(extraMileCostText)).toBeVisible();
		});
	});

	describe("Conditional Rendering", () => {
		it("should not display trim when trim is an empty string", () => {
			const vehicleWithEmptyTrim = {
				...basicGasVehicle,
				vehicleData: { ...basicGasVehicle.vehicleData, trim: "" },
			};

			setupVehicleCardTest(vehicleWithEmptyTrim);

			const vehicleInfoText = `${vehicleWithEmptyTrim.vehicleData.year} ${vehicleWithEmptyTrim.vehicleData.make} ${vehicleWithEmptyTrim.vehicleData.model}`;
			expect(screen.queryByText(vehicleInfoText)).toBeVisible();
		});

		it("displays all vehicle details when complete data is provided", () => {
			setupVehicleCardTest(basicGasVehicle);

			const { year, make, model, trim } = basicGasVehicle.vehicleData;
			const vehicleInfoText = `${year} ${make} ${model} ${trim}`;
			expect(screen.getByText(vehicleInfoText)).toBeVisible();
		});
	});

	describe("Snapshot tests", () => {
		it("matches snapshot for gas vehicle from 4.30.2025", () => {
			const { container } = setupVehicleCardTest(basicGasVehicle);
			expect(container).toMatchSnapshot();
		});
		
		it("matches snapshot for electric vehicle from 4.30.2025", () => {
			const { container } = setupVehicleCardTest(basicElectricVehicle);
			expect(container).toMatchSnapshot();
		});
		
		it("matches snapshot for hybrid vehicle from 4.30.2025", () => {
			const { container } = setupVehicleCardTest(basicHybridVehicle);
			expect(container).toMatchSnapshot();
		});
		
		it("matches snapshot for vehicle with empty trim from 4.30.2025", () => {
			const vehicleWithEmptyTrim = {
				...basicGasVehicle,
				vehicleData: { ...basicGasVehicle.vehicleData, trim: "" },
			};
			
			const { container } = setupVehicleCardTest(vehicleWithEmptyTrim);
			expect(container).toMatchSnapshot();
		});
	});
});
