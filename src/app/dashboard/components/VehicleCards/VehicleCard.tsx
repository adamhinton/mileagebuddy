"use client";

// ____________________________________________________________________________
// This is a component that displays a vehicle card with its calculated costs
// Also contains edit and delete buttons
// In the dashboard it's wrapped in a SortableVehicleCard component that makes it drag n'droppable
// TODO Drag and drop isn't working
// TODO tests
// ____________________________________________________________________________

import ConfirmationDialog from "@/app/components/ConfirmationDialog";
import { CarCostCalculationResults } from "@/app/utils/CarCostAlgorithm/calculateCarCostMain";
import { Vehicle } from "@/app/utils/server/types/VehicleTypes/GetVehicleTypes";
import { DraggableAttributes } from "@dnd-kit/core";
import { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";
import { useState } from "react";

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

	const [showEditConfirmation, setShowEditConfirmation] = useState(false);
	const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

	const costPerMile = vehicleCost?.costPerAverageDailyMile ?? 0;
	const costPerExtraMile = vehicleCost?.costPerExtraMile ?? 0;
	const vehicleType = vehicle.type;

	// Handlers for the edit button
	const handleEditClick = () => {
		setShowEditConfirmation(true);
	};

	const handleEditConfirm = () => {
		onEdit();
		setShowEditConfirmation(false);
	};

	const handleEditCancel = () => {
		setShowEditConfirmation(false);
	};

	const handleDeleteClick = () => {
		setShowDeleteConfirmation(true);
	};

	const handleDeleteConfirm = () => {
		onDelete();
		setShowDeleteConfirmation(false);
	};

	const handleDeleteCancel = () => {
		setShowDeleteConfirmation(false);
	};

	return (
		<article className="bg-background-elevated rounded-lg shadow-md overflow-hidden transition-all hover:shadow-lg border border-primary-50">
			{/* Drag handle */}
			<header
				className="bg-background-header p-2 cursor-move flex items-center justify-center"
				{...dragHandleProps}
				aria-label="Drag to reorder"
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
					<button
						onClick={handleEditClick}
						className="nav-link-outline flex items-center"
						aria-label={`Edit ${vehicle.vehicleData.vehicleName}`}
					>
						<svg
							className="w-4 h-4 mr-1"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
							/>
						</svg>
						Edit
					</button>

					<button
						onClick={handleDeleteClick}
						className="text-red-500 hover:text-red-700 flex items-center"
						aria-label={`Delete ${vehicle.vehicleData.vehicleName}`}
					>
						<svg
							className="w-4 h-4 mr-1"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
							/>
						</svg>
						Delete
					</button>

					<button
						className="text-primary hover:text-primary-200 flex items-center"
						aria-label={`View details for ${vehicle.vehicleData.vehicleName}`}
					>
						<svg
							className="w-4 h-4 mr-1"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
							/>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
							/>
						</svg>
						Details
					</button>
				</footer>

				{/* Only displays when user has clicked the edit button */}
				<ConfirmationDialog
					title="Edit Vehicle"
					message={`Are you sure you want to edit ${vehicle.vehicleData.vehicleName}?`}
					confirmButtonText="Edit"
					cancelButtonText="Cancel"
					onConfirm={handleEditConfirm}
					onCancel={handleEditCancel}
					isOpen={showEditConfirmation}
					confirmButtonClass="bg-primary text-white hover:bg-primary-600"
				/>

				{/* Only displays when user has clicked the delete button */}
				<ConfirmationDialog
					title="Delete Vehicle"
					message={`Are you sure you want to delete ${vehicle.vehicleData.vehicleName}? This action cannot be undone.`}
					confirmButtonText="Delete"
					cancelButtonText="Cancel"
					onConfirm={handleDeleteConfirm}
					onCancel={handleDeleteCancel}
					isOpen={showDeleteConfirmation}
					confirmButtonClass="bg-red-600 text-white hover:bg-red-700"
				/>
			</section>
		</article>
	);
};

export default VehicleCard;
