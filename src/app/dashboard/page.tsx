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
import { Dispatch } from "@reduxjs/toolkit";
import { deleteVehicleByIDClient } from "../utils/server/client/DBInteractions/VehiclesDBInteractions";
import VehicleCard from "./components/VehicleCard";

// TODO use the pre-existing Button component here instead of making our own

/**
 * Contains this key value pair for each vehicle
 */
type AllCarCosts = {
	[vehicleId: number]: CarCostCalculationResults;
};

const Dashboard = () => {
	const vehicles = useAppSelector((state) => state.vehicles);
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
						const cost = await calculateCarCostMain(vehicle);
						// Key is vehicle's id, value is cost calculation results
						costs[vehicle.id] = cost;
					} catch (vehicleError) {
						console.error(
							`Error calculating cost for vehicle ${vehicle.id}:`,
							vehicleError
						);
					}
				}

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
			// TODO Show confirmation modal before deleting

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
