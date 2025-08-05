import { useEffect, useState } from "react";
import { useSettings } from "../../context/settingsContext";

interface SettingsModalProps {
	onClose: () => void;
	isOpen: boolean;
}
export default function SettingsModal({ onClose, isOpen }: SettingsModalProps) {
	const { theme, setTheme, earliestFetchDate, setEarliestFetchDate, isAdminMode, enableAdminMode, disableAdminMode } = useSettings();
	const [password, setPassword] = useState("");
	const [showPasswordField, setShowPasswordField] = useState(false);

	useEffect(() => {
		setShowPasswordField(isAdminMode);
	}, [isAdminMode]);

	if (!isOpen) return null;
	const handleAdminToggle = () => {
		setShowPasswordField((prev) => {
			if (isAdminMode && prev) {
				disableAdminMode();
			}
			return !prev
		});
	};

	const onSave = () => {
		localStorage.setItem("earliestFetchDate", earliestFetchDate.toString());
		localStorage.setItem("theme", theme);
		if (showPasswordField && password) {
			enableAdminMode(password);
		}
		onCloseModal();
	};

	const onCloseModal = () => {
		setPassword("");
		setShowPasswordField(false);
		onClose();
	};
	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-500 bg-opacity-50">
			<div className="bg-white dark:bg-gray-800 p-4 rounded shadow-md w-full max-w-md">
				<h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Settings</h2>
				<div className="mb-4">
					<label htmlFor="theme-selector" className="block mb-2 text-gray-700 dark:text-gray-300">Theme</label>
					<select id="theme-selector" value={theme} onChange={(e) => setTheme(e.target.value)} className="w-full p-2 border rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600">
						<option value="light">Light</option>
						<option value="dark">Dark</option>
						<option value="system">System</option>
					</select>
				</div>
				<div className="mb-4">
					<label htmlFor="fetch-date-selector" className="block mb-2 text-gray-700 dark:text-gray-300">Earliest Fetch Date (days ago)</label>
					<input id="fetch-date-selector" type="number" value={earliestFetchDate} onChange={(e) => setEarliestFetchDate(parseInt(e.target.value, 10))} className="w-full p-2 border rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600" />
				</div>
				<div className="mb-4">
					<label htmlFor="admin-mode-toggle" className="flex items-center cursor-pointer" title="Toggle Admin Mode, setting a wrong password will still enable it, but transactions will fail">
						<div className="relative">
							<input
								id="admin-mode-toggle"
								type="checkbox"
								className="sr-only"
								checked={showPasswordField}
								onChange={handleAdminToggle}
							/>
							<div className={`block ${showPasswordField ? "bg-blue-300 dark:bg-blue-700" : "bg-gray-300 dark:bg-gray-700"}  w-14 h-8 rounded-full`}></div>
							<div
								className={`dot absolute left-1 top-1 bg-white dark:bg-gray-300 w-6 h-6 rounded-full transition transform ${showPasswordField ? "translate-x-6" : ""
									}`}
							></div>
						</div>
						<div className="ml-3 text-gray-700 dark:text-gray-300 font-medium">Admin Mode</div>
					</label>
					{showPasswordField && (
						<div className="mt-2">
							<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-2 border rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600" placeholder={`${isAdminMode ? "*********" : "Enter admin key"} `} />
						</div>
					)}
				</div>
				<div className="flex justify-end">
					<button
						type="button"
						className="mr-2 px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-gray-300 rounded-md"
						onClick={onClose}
					>
						Cancel
					</button>
					<button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md" onClick={onSave}>
						Save
					</button>
				</div>
			</div>
		</div>
	);
}