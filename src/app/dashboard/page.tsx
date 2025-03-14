"use client";

import { useState, useCallback, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import {
	calculateCarCostMain,
	type CarCostCalculationResults,
} from "@/app/utils/CarCostAlgorithm/calculateCarCostMain";
import {
	removeVehicleById,
	setVehicles,
} from "@/redux/reducers/vehiclesReducer";
import {
	DndContext,
	closestCenter,
	KeyboardSensor,
	PointerSensor,
	useSensor,
	useSensors,
	DragEndEvent,
	DraggableAttributes,
} from "@dnd-kit/core";
import {
	arrayMove,
	SortableContext,
	sortableKeyboardCoordinates,
	verticalListSortingStrategy,
	useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Vehicle } from "../utils/server/types/VehicleTypes/GetVehicleTypes";
import { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";
import { Dispatch } from "@reduxjs/toolkit";
import { deleteVehicleByIDClient } from "../utils/server/client/DBInteractions/VehiclesDBInteractions";

/**
 * Contains this key value pair for each vehicle
 */
type AllCarCosts = {
	[vehicleId: number]: CarCostCalculationResults;
};

const Dashboard = () => {
	const vehicles = useAppSelector((state) => state.vehicles);
	console.log("Just got vehicles from redux");
	/**Tracks the calculated costs per mile of each vehicle */
	const [vehicleCosts, setVehicleCosts] = useState<AllCarCosts>({});

	// Calculate costs for all vehicles when the component loads
	useEffect(() => {
		console.log("UseEffect starting with vehicles:", vehicles);

		const calculateCosts = async () => {
			try {
				// Key is vehicle's id, value is cost calculation results
				const costs: AllCarCosts = {};

				if (!vehicles || vehicles.length === 0) {
					console.log("No vehicles available to calculate costs");
					return;
				}

				for (const vehicle of vehicles) {
					try {
						console.log(`Calculating cost for vehicle ${vehicle.id}`);
						const cost = await calculateCarCostMain(vehicle);
						console.log(`Calculated cost for vehicle ${vehicle.id}:`, cost);
						// Key is vehicle's id, value is cost calculation results
						costs[vehicle.id] = cost;
					} catch (vehicleError) {
						console.error(
							`Error calculating cost for vehicle ${vehicle.id}:`,
							vehicleError
						);
					}
				}

				console.log("Setting vehicle costs:", costs);
				setVehicleCosts(costs);
			} catch (error) {
				console.error("Error in calculateCosts:", error);
			}
		};

		calculateCosts();
	}, [vehicles]);

	const sensors = useSensors(
		useSensor(PointerSensor),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		})
	);

	/**When the user is done dragging the item */
	const handleDragEnd = (event: DragEndEvent) => {
		const { active, over } = event;

		if (over && active.id !== over.id) {
			const oldIndex = vehicles.findIndex((v) => v.id === active.id);
			const newIndex = vehicles.findIndex((v) => v.id === over.id);

			const updatedVehicles = arrayMove(vehicles, oldIndex, newIndex).map(
				(vehicle, index) => ({ ...vehicle, vehiclesOrder: index + 1 })
			);

			// Update Redux state with new order
			dispatch(setVehicles(updatedVehicles));
		}
	};

	// TODO flesh this out, just take user to edit form
	const onEditButtonClick = useCallback((vehicleId: number) => {
		console.log(`Edit vehicle with ID: ${vehicleId}`);
		// Navigate to edit page or open modal
	}, []);

	// TODO flesh out vehicle delete button. Show confirmation modal
	const onDeleteButtonClick = useCallback(
		async (vehicleId: number, dispatch: Dispatch) => {
			console.log(`Delete vehicle with ID: ${vehicleId}`);
			// Show confirmation modal before deleting

			// Remove vehicle from DB
			const dbDeleteResults = await deleteVehicleByIDClient(vehicleId);
			if ("error" in dbDeleteResults) {
				console.error("Error deleting vehicle:", dbDeleteResults.error);
				return;
			}

			// Remove vehicle from global Redux state
			dispatch(removeVehicleById(vehicleId));
		},
		[]
	);

	const dispatch = useAppDispatch();

	return (
		<div className="min-h-screen bg-background-base p-4 md:p-6 lg:p-8">
			<h1 className="text-3xl font-bold mb-6 text-center sm:text-left">
				Your Vehicles
			</h1>

			{vehicles.length > 0 ? (
				<DndContext
					sensors={sensors}
					collisionDetection={closestCenter}
					onDragEnd={handleDragEnd}
				>
					<SortableContext
						items={vehicles.map((v) => v.id)}
						strategy={verticalListSortingStrategy}
					>
						<div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
							{vehicles.map((vehicle) => {
								// console.log("vehicle:", vehicle);
								// console.log("vehicleCosts:", vehicleCosts);
								return (
									<SortableVehicleCard
										key={vehicle.id}
										vehicle={vehicle}
										vehicleCost={vehicleCosts[vehicle.id]}
										onEdit={() => onEditButtonClick(vehicle.id)}
										onDelete={() => onDeleteButtonClick(vehicle.id, dispatch)}
									/>
								);
							})}
						</div>
					</SortableContext>
				</DndContext>
			) : (
				<EmptyState />
			)}
		</div>
	);
};

type SortableVehicleCardProps = {
	vehicle: Vehicle;
	vehicleCost: CarCostCalculationResults;
	onEdit: () => void;
	onDelete: () => void;
};

// Sortable wrapper for VehicleCard
const SortableVehicleCard = (props: SortableVehicleCardProps) => {
	const { vehicle, vehicleCost, onEdit, onDelete } = props;

	const { attributes, listeners, setNodeRef, transform, transition } =
		useSortable({ id: vehicle.id });

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
	};

	return (
		<div ref={setNodeRef} style={style}>
			<VehicleCard
				vehicle={vehicle}
				vehicleCost={vehicleCost}
				onEdit={onEdit}
				onDelete={onDelete}
				dragHandleProps={{ attributes, listeners }}
			/>
		</div>
	);
};

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

	// ...rest of the component remains unchanged

	return (
		<div className="bg-background-elevated rounded-lg shadow-md overflow-hidden transition-all hover:shadow-lg border border-primary-50">
			{/* Drag handle */}
			<div
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
			</div>

			{/* Vehicle info */}
			<div className="p-5">
				<div className="flex justify-between items-start">
					<div>
						<h2 className="text-xl font-bold">
							{vehicle.vehicleData.vehicleName}
						</h2>
						<p className="text-neutral-text text-sm">
							{vehicle.vehicleData.year} {vehicle.vehicleData.make}{" "}
							{vehicle.vehicleData.model} {vehicle.vehicleData.trim}
						</p>
					</div>

					<div className="flex items-center">
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
					</div>
				</div>

				{/* Costs */}
				<div className="mt-5 mb-4">
					<div className="bg-primary-50 rounded-lg p-4 mb-3">
						<h3 className="text-sm font-medium text-neutral-text mb-1">
							Cost Per Mile
						</h3>
						<p className="text-3xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
							${costPerMile.toFixed(2)}
						</p>
					</div>

					<div className="bg-secondary-50 rounded-lg p-4">
						<h3 className="text-sm font-medium text-neutral-text mb-1">
							Extra Mile Cost
						</h3>
						<p className="text-2xl font-bold text-secondary">
							${costPerExtraMile.toFixed(2)}
						</p>
					</div>
				</div>

				{/* Action buttons */}
				<div className="flex justify-between mt-4">
					<button
						onClick={onEdit}
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
						onClick={onDelete}
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
				</div>
			</div>
		</div>
	);
};

const EmptyState = () => {
	return (
		<div className="flex flex-col items-center justify-center py-12 px-4 bg-background-elevated rounded-lg shadow-sm border border-primary-50">
			<svg
				className="w-20 h-20 text-primary-100 mb-4"
				fill="none"
				stroke="currentColor"
				viewBox="0 0 24 24"
			>
				<path
					strokeLinecap="round"
					strokeLinejoin="round"
					strokeWidth={1.5}
					d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z"
				/>
				<path
					strokeLinecap="round"
					strokeLinejoin="round"
					strokeWidth={1.5}
					d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"
				/>
			</svg>
			<h2 className="text-xl font-bold mb-2">No vehicles yet</h2>
			<p className="text-neutral-text text-center mb-6 max-w-md">
				Add your first vehicle to calculate its true cost per mile.
			</p>
			<a href="/calculator" className="nav-link-primary flex items-center">
				<svg
					className="w-5 h-5 mr-2"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M12 6v6m0 0v6m0-6h6m-6 0H6"
					/>
				</svg>
				Add Vehicle
			</a>
		</div>
	);
};

export default Dashboard;
