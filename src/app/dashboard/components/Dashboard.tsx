"use client";

// _____________________________________________
// This is (obviously) the dashboard component. It lives in /src/app/dashboard/page.tsx
// It contains a list of user's Vehicles and their calculated costs per mile. Has Drag and drop and delete/edit buttons for each vehicle
// If user has no vehicles, it displays EmptyDashboardState.tsx
// _____________________________________________

// TODO  sidebar
// TODO proper vehicle ordering

import { deleteVehicleByIDClient } from "@/app/utils/server/client/DBInteractions/VehiclesDBInteractions";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
	removeVehicleById,
	setVehicles,
} from "@/redux/reducers/vehiclesReducer";
import {
	closestCenter,
	DndContext,
	DragEndEvent,
	KeyboardSensor,
	PointerSensor,
	useSensor,
	useSensors,
} from "@dnd-kit/core";
import {
	arrayMove,
	SortableContext,
	sortableKeyboardCoordinates,
	verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Dispatch } from "@reduxjs/toolkit";
import { useCallback, useEffect, useState } from "react";
import {
	calculateCarCostMain,
	CarCostCalculationResults,
} from "@/app/utils/CarCostAlgorithm/calculateCarCostMain";
import EmptyDashboardState from "./EmptyDashboardState";
import SortableVehicleCard from "./VehicleCards/SortableVehicleCard";

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

	// The component that calls this will show a confirmation dialog before calling onDeleteButtonClick
	const onDeleteButtonClick = useCallback(
		async (vehicleId: number, dispatch: Dispatch) => {
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
					{/* DnD wrapper */}
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
				// User has no saved Vehicles
				<EmptyDashboardState />
			)}
		</div>
	);
};

export default Dashboard;
