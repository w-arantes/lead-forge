import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

interface TooltipProps {
	content: string;
	children: React.ReactNode;
	position?: "top" | "bottom" | "left" | "right";
	delay?: number;
	className?: string;
}

export function Tooltip({
	content,
	children,
	position = "top",
	delay = 500,
	className,
}: TooltipProps) {
	const [isVisible, setIsVisible] = useState(false);
	const [coords, setCoords] = useState({ x: 0, y: 0 });
	const triggerRef = useRef<HTMLButtonElement>(null);
	const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

	const showTooltip = () => {
		if (triggerRef.current) {
			const rect = triggerRef.current.getBoundingClientRect();
			let x = 0;
			let y = 0;

			switch (position) {
				case "top":
					x = rect.left + rect.width / 2;
					y = rect.top - 8;
					break;
				case "bottom":
					x = rect.left + rect.width / 2;
					y = rect.bottom + 8;
					break;
				case "left":
					x = rect.left - 8;
					y = rect.top + rect.height / 2;
					break;
				case "right":
					x = rect.right + 8;
					y = rect.top + rect.height / 2;
					break;
			}

			setCoords({ x, y });
			setIsVisible(true);
		}
	};

	const hideTooltip = () => {
		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current);
		}
		setIsVisible(false);
	};

	const handleMouseEnter = () => {
		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current);
		}
		timeoutRef.current = setTimeout(showTooltip, delay);
	};

	const handleMouseLeave = () => {
		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current);
		}
		hideTooltip();
	};

	const handleFocus = () => {
		showTooltip();
	};

	const handleBlur = () => {
		hideTooltip();
	};

	useEffect(() => {
		return () => {
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
			}
		};
	}, []);

	const positionClasses = {
		top: "bottom-full left-1/2 transform -translate-x-1/2 -translate-y-2",
		bottom: "top-full left-1/2 transform -translate-x-1/2 translate-y-2",
		left: "right-full top-1/2 transform -translate-x-2 -translate-y-1/2",
		right: "left-full top-1/2 transform translate-x-2 -translate-y-1/2",
	};

	const arrowClasses = {
		top: "top-full left-1/2 transform -translate-x-1/2 border-t-gray-900 dark:border-t-gray-100",
		bottom:
			"bottom-full left-1/2 transform -translate-x-1/2 border-b-gray-900 dark:border-b-gray-100",
		left: "left-full top-1/2 transform -translate-y-1/2 border-l-gray-900 dark:border-l-gray-100",
		right:
			"right-full top-1/2 transform -translate-y-1/2 border-r-gray-900 dark:border-r-gray-100",
	};

	return (
		<>
			<button
				ref={triggerRef as React.RefObject<HTMLButtonElement>}
				type="button"
				onMouseEnter={handleMouseEnter}
				onMouseLeave={handleMouseLeave}
				onFocus={handleFocus}
				onBlur={handleBlur}
				className={cn("inline-block", className)}
				aria-label={typeof content === "string" ? content : undefined}
			>
				{children}
			</button>

			{isVisible &&
				createPortal(
					<div
						className={cn(
							"fixed z-50 whitespace-nowrap rounded bg-gray-900 px-2 py-1 text-sm text-white shadow-lg transition-all duration-200 ease-out dark:bg-gray-100 dark:text-gray-900",
							positionClasses[position],
							isVisible ? "scale-100 opacity-100" : "scale-95 opacity-0",
						)}
						style={{
							left: coords.x,
							top: coords.y,
						}}
						role="tooltip"
						aria-hidden="true"
					>
						{content}
						<div
							className={cn(
								"absolute h-0 w-0 border-4 border-transparent",
								arrowClasses[position],
							)}
						/>
					</div>,
					document.body,
				)}
		</>
	);
}
