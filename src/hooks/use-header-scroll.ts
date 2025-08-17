import { useEffect } from "react";
import { useAppActions } from "@/domain/infra/store";

export function useHeaderScroll() {
	const { setHeaderHidden } = useAppActions();

	useEffect(() => {
		let lastScrollY = window.scrollY;
		let ticking = false;

		const updateHeaderVisibility = () => {
			const currentScrollY = window.scrollY;

			if (currentScrollY > lastScrollY && currentScrollY > 100) {
				setHeaderHidden(true);
			} else {
				setHeaderHidden(false);
			}

			lastScrollY = currentScrollY;
			ticking = false;
		};

		const handleScroll = () => {
			if (!ticking) {
				requestAnimationFrame(updateHeaderVisibility);
				ticking = true;
			}
		};

		window.addEventListener("scroll", handleScroll, { passive: true });

		return () => {
			window.removeEventListener("scroll", handleScroll);
		};
	}, [setHeaderHidden]);
}
