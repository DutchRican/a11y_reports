import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { getEarliestScanDate } from "../components/settings";

type SettingsContextType = {
	theme: string;
	setTheme: (theme: string) => void;
	isDarkMode: boolean;
	isAdminMode: boolean;
	enableAdminMode: (password: string) => void;
	disableAdminMode: () => void;
	earliestFetchDate: number;
	setEarliestFetchDate: (days: number) => void;
	password: string;
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
	const [theme, setTheme] = useState<string>(localStorage.getItem("theme") || "light");
	const [isAdminMode, setIsAdminMode] = useState<boolean>(false);
	const [earliestFetchDate, setEarliestFetchDate] = useState<number>(0);
	const [adminTimeout, setAdminTimeout] = useState<number | undefined>(undefined);
	const [password, setPassword] = useState<string>("");
	const isDarkMode = theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);

	useEffect(() => {
		const root = window.document.documentElement;
		if (isDarkMode) {
			root.classList.add("dark");
		}
		else {
			root.classList.remove("dark");
		}
	}, [isDarkMode, theme]);

	useEffect(() => {
		setEarliestFetchDate(getEarliestScanDate());
	}, []);

	useEffect(() => {
		return () => {
			if (adminTimeout) {
				clearTimeout(adminTimeout);
			}
		};
	}, [adminTimeout]);

	const enableAdminMode = (pwd: string) => {
		if (adminTimeout) {
			clearTimeout(adminTimeout);
		}
		setPassword(pwd);
		setIsAdminMode(true);
		const timeoutId = setTimeout(() => {
			setIsAdminMode(false);
			setPassword("");
		}, 2 * 60 * 1000); // 2 minutes
		setAdminTimeout(timeoutId as unknown as number);
	};

	const disableAdminMode = () => {
		setIsAdminMode(false);
		if (adminTimeout) {
			clearTimeout(adminTimeout);
		}
	};

	const contextValue: SettingsContextType = {
		theme,
		setTheme,
		isDarkMode,
		earliestFetchDate,
		setEarliestFetchDate,
		isAdminMode,
		enableAdminMode,
		disableAdminMode,
		password
	};

	return (
		<SettingsContext.Provider value={contextValue}>
			{children}
		</SettingsContext.Provider>
	);
};

export const useSettings = () => {
	const context = useContext(SettingsContext);
	if (context === undefined) {
		throw new Error("useSettings must be used within a SettingsProvider");
	}
	return context;
};
