// README
// This is part of the mileage form calculator used to build a Vehicle
// Each sub-object of Vehicle (see GetVehicleTypes.ts) will have one of these FormSection's
// This is a collapsible section of the form
// You list this as an open tag and put the relevant inputs inside it. Mostly MileageCalcNumberInputs
// TODO unit tests once this is fully fleshed out

import tailWindClassNames from "@/app/utils/clientUtils/styling/tailwindClassNames";
import {
	Electric_Vehicle_For_DB_POST,
	Gas_Vehicle_For_DB_POST,
} from "@/app/utils/server/types/VehicleTypes/POSTVehicleTypes";
import { ReactNode } from "react";
import { type CollapsedOrNot } from "../page";

type FormSectionProps = {
	title: string;
	children: ReactNode;
	isCompleted?: boolean;
	isCollapsed: CollapsedOrNot;
	onToggleCollapse: () => void;
	id: keyof Gas_Vehicle_For_DB_POST | keyof Electric_Vehicle_For_DB_POST;
};

const FormSection = ({
	title,
	children,
	isCompleted = false,
	isCollapsed,
	onToggleCollapse,
	id,
}: FormSectionProps) => {
	return (
		<section
			className={`${tailWindClassNames.mileageCalcForm.FORM_SECTION}`}
			id={id}
		>
			<button
				type="button"
				onClick={onToggleCollapse}
				className="w-full flex items-center justify-between p-2 bg-background-elevated"
			>
				<div
					className={`${tailWindClassNames.mileageCalcForm.FORM_SECTION_HEADER}`}
				>
					<h3 className="text-lg font-medium text-neutral-text">{title}</h3>
					{isCompleted && <span className="ml-2 text-accent">✓</span>}
				</div>
				{/* TODO up/down chevron icons */}
			</button>

			{!isCollapsed ? <span>↑</span> : <span>↓</span>}

			{!isCollapsed && (
				<div
					className={`${tailWindClassNames.mileageCalcForm.FORM_SECTION_CONTENT}`}
				>
					{children}
				</div>
			)}
		</section>
	);
};

export default FormSection;
