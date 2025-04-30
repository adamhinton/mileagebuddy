"use client";

// ____________________________________________________________________________
// This is a component that displays a vehicle card with its calculated costs
// Also contains edit and delete buttons
// In the dashboard it's wrapped in a SortableVehicleCard component that makes it drag n'droppable
// ____________________________________________________________________________

import Button from "@/app/components/Button";
import ToolTip from "@/app/components/ToolTip";
import { CarCostCalculationResults } from "@/app/utils/CarCostAlgorithm/calculateCarCostMain";
import { Vehicle } from "@/app/utils/server/types/VehicleTypes/GetVehicleTypes";
import { DraggableAttributes } from "@dnd-kit/core";
import { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";
import tailwindClassNames from "@/app/utils/clientUtils/styling/tailwindClassNames"; // Import the class names

type VehicleCardProps = {
	vehicle: Vehicle;
	vehicleCost: CarCostCalculationResults;
	onEdit: () => void;
	onDelete: () => void;
	dragHandleProps: {
		attributes: DraggableAttributes;
		listeners: SyntheticListenerMap | undefined;
	};
};

const VehicleCard = (props: VehicleCardProps) => {
	const averageDailyMiles = props.vehicle.usage.averageDailyMiles;

	const { vehicle, vehicleCost, onEdit, onDelete, dragHandleProps } = props;

	const costPerMile = vehicleCost?.costPerAverageDailyMile ?? 0;
	const costPerExtraMile = vehicleCost?.costPerExtraMile ?? 0;
	const vehicleType = vehicle.type;

	const handleEditClick = () => {
		// Use the onEdit prop passed from parent
		onEdit();
	};

	// Use class names from tailwindClassNames
	const layoutClasses = tailwindClassNames.layout;
	const componentClasses = tailwindClassNames.components;

	return (
		<article className={layoutClasses.CARD}>
			{/* Drag handle  */}
			<header
				className={componentClasses.DRAG_HANDLE}
				{...dragHandleProps.attributes}
				{...dragHandleProps.listeners}
				aria-label="Drag to reorder"
				role="button"
				tabIndex={0}
			>
				<svg
					className={componentClasses.DRAG_HANDLE_ICON}
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M8 9h8M8 15h8"
					/>
				</svg>
			</header>

			{/* Vehicle info */}
			<section className="p-5">
				<header className="flex justify-between items-start">
					<hgroup>
						<h2 className="text-xl font-bold">
							{vehicle.vehicleData.vehicleName}
						</h2>
						<p className="text-neutral-text text-sm">
							{vehicle.vehicleData.year} {vehicle.vehicleData.make}{" "}
							{vehicle.vehicleData.model} {vehicle.vehicleData.trim}
						</p>
					</hgroup>

					<figure className="flex items-center">
						{/* Type icon */}
						{vehicleType === "electric" ? (
							<span
								className={`${componentClasses.VEHICLE_ICON} ${componentClasses.VEHICLE_ICON_ELECTRIC}`}
								title="Electric Vehicle"
							>
								<svg
									className={componentClasses.VEHICLE_ICON_SVG}
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M13 10V3L4 14h7v7l9-11h-7z"
									/>
								</svg>
							</span>
						) : (
							<span
								className={`${componentClasses.VEHICLE_ICON} ${componentClasses.VEHICLE_ICON_GAS}`}
								title="Gas Vehicle"
							>
								<svg
									className={componentClasses.VEHICLE_ICON_SVG}
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
									/>
								</svg>
							</span>
						)}
					</figure>
				</header>

				{/* Costs */}
				<section className="mt-5 mb-4">
					<figure
						className={`${componentClasses.COST_FIGURE} ${componentClasses.COST_FIGURE_PRIMARY}`}
					>
						<figcaption className={componentClasses.COST_CAPTION}>
							{`Cost Per Mile: ${averageDailyMiles} miles/day`}
							<ToolTip
								text={`Includes maintenance, fuel, depreciation, fixed costs like insurance, loan payments, and more.`}
							>
								<svg
									className={componentClasses.TOOLTIP_ICON}
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20 10 10 0 000-20z"
									/>
								</svg>
							</ToolTip>
						</figcaption>
						<p
							className={`${componentClasses.COST_VALUE} ${componentClasses.COST_VALUE_PRIMARY}`}
						>
							${costPerMile.toFixed(2)}
						</p>
					</figure>

					<figure
						className={`${componentClasses.COST_FIGURE} ${componentClasses.COST_FIGURE_SECONDARY}`}
					>
						<figcaption className={componentClasses.COST_CAPTION}>
							Cost Per Additional Mile
							<ToolTip
								text={`Includes maintenance, depreciation, fuel, and other variable costs, but not fixed costs like insurance.`}
							>
								<svg
									className={componentClasses.TOOLTIP_ICON}
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20 10 10 0 000-20z"
									/>
								</svg>
							</ToolTip>
						</figcaption>
						<p
							className={`${componentClasses.COST_VALUE} ${componentClasses.COST_VALUE_SECONDARY}`}
						>
							${costPerExtraMile.toFixed(2)}
						</p>
					</figure>
				</section>

				{/* Action buttons */}
				<footer className="flex justify-between mt-4">
					<Button
						onClick={handleEditClick}
						text="Edit"
						variant="secondary"
						className="flex items-center"
						ariaLabel={`Edit ${vehicle.vehicleData.vehicleName}`}
						isConfirmationRequired={true}
						confirmationDialogOptions={{
							title: "Edit Vehicle",
							message: `Are you sure you want to edit ${vehicle.vehicleData.vehicleName}?`,
							confirmButtonText: "Edit",
							cancelButtonText: "Cancel",
						}}
					/>

					<Button
						onClick={onDelete}
						text="Delete"
						variant="danger"
						className="flex items-center"
						ariaLabel={`Delete ${vehicle.vehicleData.vehicleName}`}
						isConfirmationRequired={true}
						confirmationDialogOptions={{
							title: "Delete Vehicle",
							message: `Are you sure you want to delete ${vehicle.vehicleData.vehicleName}? This action cannot be undone.`,
							confirmButtonText: "Delete",
							cancelButtonText: "Cancel",
						}}
					/>

					{/* TODO STRETCH: button to show further cost breakdown */}
				</footer>

				{/* We can remove these dialogs as they're now handled by the Button component */}
			</section>
		</article>
	);
};

export default VehicleCard;
