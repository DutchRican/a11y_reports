import { useMemo } from "react";
import { useLocation } from "react-router-dom";

export function useProjectIdFromUrl() {
	const { pathname } = useLocation();
	return useMemo(() => {
		const match = /\/project\/(\w+)/.exec(pathname);
		return match?.[1] || null;
	}, [pathname]);
}