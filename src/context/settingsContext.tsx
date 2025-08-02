import { createContext, ReactNode, useContext, useEffect, useState } from "react";

type SettingsContextType = {
	theme: string;
	setTheme: (theme: string) => void;
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
	const [earliestFetchDate, setEarliestFetchDate] = useState<number>(
		localStorage.getItem("earliestFetchDate") ? parseInt(localStorage.getItem("earliestFetchDate")!, 10) : 21
	);
	const [adminTimeout, setAdminTimeout] = useState<number | undefined>(undefined);
	const [password, setPassword] = useState<string>("");

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
