"use client";

// ____________________________________________________________________________
// This is a component that displays a vehicle card with its calculated costs
// Also contains edit and delete buttons
// In the dashboard it's wrapped in a SortableVehicleCard component that makes it drag n'droppable
// ____________________________________________________________________________

import Button from "@/app/components/Button";
import { CarCostCalculationResults } from "@/app/utils/CarCostAlgorithm/calculateCarCostMain";
import { Vehicle } from "@/app/utils/server/types/VehicleTypes/GetVehicleTypes";
import { DraggableAttributes } from "@dnd-kit/core";
import { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";

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
	const { vehicle, vehicleCost, onEdit, onDelete, dragHandleProps } = props;

	const costPerMile = vehicleCost?.costPerAverageDailyMile ?? 0;
	const costPerExtraMile = vehicleCost?.costPerExtraMile ?? 0;
	const vehicleType = vehicle.type;

	const handleEditClick = () => {
		// Use the onEdit prop passed from parent
		onEdit();
	};

	return (
		<article className="bg-background-elevated rounded-lg shadow-md overflow-hidden transition-all hover:shadow-lg border border-primary-50">
			{/* Drag handle  */}
			<header
				className="bg-background-header p-2 cursor-move flex items-center justify-center touch-manipulation"
				{...dragHandleProps.attributes}
				{...dragHandleProps.listeners}
				aria-label="Drag to reorder"
				role="button"
				tabIndex={0}
			>
				<svg
					className="w-6 h-6 text-primary-100"
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
								className="text-accent p-1 bg-accent-50 rounded-md"
								title="Electric Vehicle"
							>
								<svg
									className="w-5 h-5"
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
								className="text-secondary p-1 bg-secondary-50 rounded-md"
								title="Gas Vehicle"
							>
								<svg
									className="w-5 h-5"
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
					<figure className="bg-primary-50 rounded-lg p-4 mb-3">
						<figcaption className="text-sm font-medium text-neutral-text mb-1">
							Cost Per Mile
						</figcaption>
						<p className="text-3xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
							${costPerMile.toFixed(2)}
						</p>
					</figure>

					<figure className="bg-secondary-50 rounded-lg p-4">
						<figcaption className="text-sm font-medium text-neutral-text mb-1">
							Extra Mile Cost
						</figcaption>
						<p className="text-2xl font-bold text-secondary">
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
