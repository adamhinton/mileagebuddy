"use client";

// ________________________________
// This is a wrapper around VehicleCard that makes it responsive to Drag and Drop events
// Using @dnd-kit library for drag-and-drop functionality
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
const SortableVehicleCard = (props: SortableVehicleCardProps) => {
	const { vehicle, vehicleCost, onEdit, onDelete } = props;

	// Using useClient from @dnd-kit/sortable to enable drag-and-drop functionality
	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging,
	} = useSortable({
		id: vehicle.id,
		data: { vehicle },
	});

	// Transform styles for drag animation
	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
		// Opacity change when dragging to provide visual feedback
		opacity: isDragging ? 0.8 : 1,
		zIndex: isDragging ? 999 : "auto",
	};

	return (
		<article ref={setNodeRef} style={style} className="touch-manipulation">
			<VehicleCard
				vehicle={vehicle}
				vehicleCost={vehicleCost}
				onEdit={onEdit}
				onDelete={onDelete}
				dragHandleProps={{ attributes, listeners }}
			/>
		</article>
	);
};

export default SortableVehicleCard;
