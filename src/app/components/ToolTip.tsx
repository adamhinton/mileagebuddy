// _______________________________________________________________________
// This is (obviously) a tooltip component. It's used in Dashboard to further explain cost per mile breakdown.
// If it runs in to the top of its parent element, it automatically moves itself down to be fully visible.
// _______________________________________________________________________

import React, { useState, useRef, useEffect } from "react";

type ToolTipProps = {
	text: string;
	children: React.ReactNode;
};

const ToolTip: React.FC<ToolTipProps> = ({ text, children }) => {
	const [isTop, setIsTop] = useState(false);
	const triggerRef = useRef<HTMLSpanElement>(null);
	const tooltipRef = useRef<HTMLDivElement>(null);

	// Tooltip component was running off the top of its parent element, this function adjusts its position to prevent this.
	const checkPosition = () => {
		if (triggerRef.current) {
			const rect = triggerRef.current.getBoundingClientRect();
			const topSpace = rect.top;

			// If there's less than 100px above the trigger element, position below
			setIsTop(topSpace < 100);
		}
	};

	// Adjust position on scroll and resize
	useEffect(() => {
		checkPosition();
		window.addEventListener("scroll", checkPosition);
		window.addEventListener("resize", checkPosition);

		return () => {
			window.removeEventListener("scroll", checkPosition);
			window.removeEventListener("resize", checkPosition);
		};
	}, []);

	return (
		<div className="relative group inline-block">
			{/* Tooltip content */}
			<div
				className={`
          absolute hidden group-hover:block z-10
          ${isTop ? "top-full mt-2" : "bottom-full mb-8"}
          left-1/2 transform -translate-x-1/2
          bg-neutral-800 dark:bg-neutral-500 
          text-neutral-100 text-xs font-medium 
          px-3 py-2 rounded-md shadow-lg max-w-[200px] w-max
        `}
				role="tooltip"
				aria-hidden="true"
				ref={tooltipRef}
			>
				{text}
				<svg
					className={`
            absolute ${isTop ? "top-0 -translate-y-full rotate-180" : "bottom-0 translate-y-full"} 
            left-1/2 -translate-x-1/2 text-neutral-800 dark:text-neutral-500
          `}
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
			<span className="cursor-pointer" ref={triggerRef}>
				{children}
			</span>
		</div>
	);
};

export default ToolTip;
