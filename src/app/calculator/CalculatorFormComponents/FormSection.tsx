// README
// This is part of the mileage form calculator used to build a Vehicle
// Each sub-object of Vehicle (see GetVehicleTypes.ts) will have one of these FormSection's
// This is a collapsible section of the form
// You list this as an open tag and put the relevant inputs inside it. Mostly MileageCalcNumberInputs
// TODO unit tests once this is fully fleshed out

import tailWindClassNames from "@/app/utils/clientUtils/styling/tailwindClassNames";
import { ReactNode, useState } from "react";

type FormSectionProps = {
	title: string;
	children: ReactNode;
	isCompleted?: boolean;
	isActive?: boolean;
	onComplete?: () => void;
};

const FormSection = ({
	title,
	children,
	isCompleted = false,
	isActive = false,
	// TODO onComplete. Just a "Next" button?
}: FormSectionProps) => {
	const [isExpanded, setIsExpanded] = useState(isActive);

	return (
		<section className={`${tailWindClassNames.mileageCalcForm.FORM_SECTION}`}>
			<button
				type="button"
				onClick={() => setIsExpanded(!isExpanded)}
				className="w-full flex items-center justify-between p-4 bg-background-elevated"
			>
				<div
					className={`${tailWindClassNames.mileageCalcForm.FORM_SECTION_HEADER}`}
				>
					<h3 className="text-lg font-medium text-neutral-text">{title}</h3>
					{isCompleted && <span className="ml-2 text-accent">✓</span>}
				</div>
				{/* TODO up/down chevron icons */}
				{isExpanded ? <span>Up</span> : <span>Down</span>}
			</button>

			{isExpanded && (
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
