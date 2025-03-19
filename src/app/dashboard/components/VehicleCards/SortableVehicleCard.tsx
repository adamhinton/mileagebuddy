"use client";

// ________________________________
// This is a wrapper around VehicleCard that makes it responsive to Drag and Drop events
// ________________________________

import { CarCostCalculationResults } from "@/app/utils/CarCostAlgorithm/calculateCarCostMain";
import { Vehicle } from "@/app/utils/server/types/VehicleTypes/GetVehicleTypes";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import VehicleCard from "./VehicleCard";

type SortableVehicleCardProps = {
	vehicle: Vehicle;
	vehicleCost: CarCostCalculationResults;
	onEdit: () => void;
	onDelete: () => void;
};

// Sortable wrapper for VehicleCard
export const SortableVehicleCard = (props: SortableVehicleCardProps) => {
	const { vehicle, vehicleCost, onEdit, onDelete } = props;

	const { attributes, listeners, setNodeRef, transform, transition } =
		useSortable({ id: vehicle.id });

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
	};

	return (
		// Wrapper around VehicleCard to make it drag and droppable
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

export default SortableVehicleCard;
