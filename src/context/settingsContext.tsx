import { createContext, ReactNode, useState } from "react";

type SettingsContextType = {
	theme: string;
	setTheme: (theme: string) => void;
	isAdminMode: boolean;
	toggleAdminMode: () => void;
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
	const [theme, setTheme] = useState<string>("light");
	const [isAdminMode, setIsAdminMode] = useState<boolean>(false);

	const toggleAdminMode = () => {
		setIsAdminMode(prev => !prev);
	};

	const contextValue: SettingsContextType = {
		theme,
		setTheme,
		isAdminMode,
		toggleAdminMode,
	};

	return (
		<SettingsContext.Provider value={contextValue}>
			{children}
		</SettingsContext.Provider>
	);
};