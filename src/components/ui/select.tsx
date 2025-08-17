import { ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "./button";

interface SelectOption<T extends string | number = string | number> {
	value: T;
	label: string;
}

interface SelectProps<T extends string | number = string | number> {
	value: T;
	onChange: (value: T) => void;
	options: SelectOption<T>[];
	placeholder?: string;
	className?: string;
	disabled?: boolean;
	"aria-label"?: string;
}

export function Select<T extends string | number = string | number>({
	value,
	onChange,
	options,
	placeholder,
	className,
	disabled = false,
	"aria-label": ariaLabel,
}: SelectProps<T>) {
	const [isOpen, setIsOpen] = useState(false);
	const selectRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				selectRef.current &&
				!selectRef.current.contains(event.target as Node)
			) {
				setIsOpen(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	const selectedOption = options.find((option) => option.value === value);

	return (
		<div className="relative" ref={selectRef}>
			<Button
				variant="outline"
				onClick={() => !disabled && setIsOpen(!isOpen)}
				disabled={disabled}
				className={cn(
					"h-8 w-full justify-between px-3 py-1.5 font-normal text-sm",
					className,
				)}
				aria-label={ariaLabel}
				aria-expanded={isOpen}
				aria-haspopup="listbox"
			>
				<span className="truncate">
					{selectedOption?.label || placeholder || "Select option"}
				</span>
				<ChevronDown
					className={cn(
						"h-4 w-4 transition-transform duration-200",
						isOpen && "rotate-180",
					)}
				/>
			</Button>

			{isOpen && (
				<div className="absolute top-full left-0 z-50 mt-1 w-full rounded-md border bg-popover shadow-md">
					<div className="py-1">
						{options.map((option) => (
							<button
								type="button"
								key={option.value}
								className={cn(
									"w-full px-3 py-2 text-left text-sm hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none",
									option.value === value && "bg-accent text-accent-foreground",
								)}
								onClick={() => {
									onChange(option.value);
									setIsOpen(false);
								}}
							>
								{option.label}
							</button>
						))}
					</div>
				</div>
			)}
		</div>
	);
}
