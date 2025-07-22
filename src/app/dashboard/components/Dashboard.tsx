"use client";

// _____________________________________________
// This is (obviously) the dashboard component. It lives in /src/app/dashboard/page.tsx
// It contains a list of user's Vehicles and their calculated costs per mile. Has Drag and drop and delete/edit buttons for each vehicle
// If user has no vehicles, it will display EmptyDashboardState.tsx
// _____________________________________________

import {
	deleteVehicleByIDClient,
	updateVehicleOrdersClient,
} from "@/app/utils/server/client/DBInteractions/VehiclesDBInteractions";
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
	useSensor,
	useSensors,
	MouseSensor,
	TouchSensor,
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
import Error from "next/error";
import { useRouter } from "next/navigation";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

/**
 * Contains this key value pair for each vehicle in state
 */
type AllCarCosts = {
	[vehicleId: number]: CarCostCalculationResults;
};

const Dashboard = () => {
	const vehicles = useAppSelector((state) => state.vehicles);
	const trips = useAppSelector((state) => state.trips);
	console.log("trips in Dashboard:", trips);
	const loggedInUser = useAppSelector((state) => state.user.value);
	/**Tracks the calculated costs per mile of each vehicle */
	const [vehicleCosts, setVehicleCosts] = useState<AllCarCosts>({});

	// Calculate costs for all vehicles
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
							`Error calculating cost for vehicle ${vehicle.vehicleData.vehicleName} with id ${vehicle.id}:`,
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

	// Configure more precise sensors for better drag detection
	const sensors = useSensors(
		useSensor(MouseSensor, {
			activationConstraint: {
				distance: 5, // 5px movement before drag starts
			},
		}),
		useSensor(TouchSensor, {
			// For mobile devices
			activationConstraint: {
				delay: 250, // Wait for 250ms before activating on touch
				tolerance: 5, // Allow slight movement before activating
			},
		}),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		})
	);

	/**When the user is done dragging the item */
	const handleDragEnd = (event: DragEndEvent) => {
		const { active, over } = event;

		if (over && active.id !== over.id && loggedInUser) {
			const oldIndex = vehicles.findIndex((v) => v.id === active.id);
			const newIndex = vehicles.findIndex((v) => v.id === over.id);

			const updatedVehicles = arrayMove(vehicles, oldIndex, newIndex).map(
				(vehicle, index) => ({ ...vehicle, vehiclesOrder: index + 1 })
			);

			dispatch(setVehicles(updatedVehicles));

			// Now persist new order in db
			const orderUpdates = updatedVehicles.map((vehicle) => ({
				id: vehicle.id,
				order: vehicle.vehiclesOrder,
			}));

			updateVehicleOrdersClient(loggedInUser.id, orderUpdates).catch(
				(error: Error) =>
					console.error("Failed to update vehicle orders:", error)
			);
		}
	};

	const onEditButtonClick = useCallback(
		(vehicleId: number, router: AppRouterInstance) => {
			router.push(`/calculator/edit/${vehicleId}`);
		},
		[]
	);

	// The component that calls this (Button.tsx) will show a confirmation dialog before calling onDeleteButtonClick
	const onDeleteButtonClick = useCallback(
		async (vehicleId: number, dispatch: Dispatch) => {
			const dbDeleteResults = await deleteVehicleByIDClient(vehicleId);
			if ("error" in dbDeleteResults) {
				console.error("Error deleting vehicle:", dbDeleteResults.error);
				return;
			}

			dispatch(removeVehicleById(vehicleId));
		},
		[]
	);

	const dispatch = useAppDispatch();

	const router = useRouter();

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
					autoScroll={true}
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
										onEdit={() => onEditButtonClick(vehicle.id, router)}
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
