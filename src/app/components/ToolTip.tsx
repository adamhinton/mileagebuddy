import React from "react";

type ToolTipProps = {
	text: string;
	children: React.ReactNode;
};

const ToolTip: React.FC<ToolTipProps> = ({ text, children }) => {
	return (
		<div className="relative group inline-block">
			{/* Tooltip content */}
			<div
				className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:flex items-center justify-center bg-neutral-800 dark:bg-neutral-700 text-neutral-100 text-xs font-medium px-3 py-2 rounded-md shadow-lg whitespace-normal max-w-sm z-10"
				role="tooltip"
				aria-hidden="true"
			>
				{text}
				<svg
					className="absolute top-full left-1/2 transform -translate-x-1/2 text-neutral-700 dark:text-neutral-700"
					width="10"
					height="5"
					viewBox="0 0 10 5"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path d="M0 0L5 5L10 0H0Z" fill="currentColor" />
				</svg>
			</div>

			{/* Trigger element */}
			<span className="cursor-pointer">{children}</span>
		</div>
	);
};

export default ToolTip;
