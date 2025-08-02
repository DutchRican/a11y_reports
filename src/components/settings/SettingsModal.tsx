import { useState } from "react";
import { useSettings } from "../../context/settingsContext";

interface SettingsModalProps {
	onClose: () => void;
	isOpen: boolean;
}
export default function SettingsModal({ onClose, isOpen }: SettingsModalProps) {
	const { theme, setTheme, earliestFetchDate, setEarliestFetchDate, isAdminMode, enableAdminMode, disableAdminMode } = useSettings();
	const [password, setPassword] = useState("");
	const [showPasswordField, setShowPasswordField] = useState(false);

	if (!isOpen) return null;

	const handleAdminToggle = () => {
		if (isAdminMode) {
			disableAdminMode();
			setShowPasswordField(false);
		} else {
			setShowPasswordField(true);
		}
	};

	const handlePasswordSubmit = () => {
		enableAdminMode(password);
		setPassword("");
		setShowPasswordField(false);
		onClose();
	};

	const onSave = () => {
		localStorage.setItem("earliestFetchDate", earliestFetchDate.toString());
		localStorage.setItem("theme", theme);
		onClose();
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-500 opacity-90">
			<div className="bg-white p-4 rounded shadow-md">
				<h2 className="text-lg font-semibold mb-4">Settings</h2>
				<div className="mb-4">
					<label htmlFor="theme-selector" className="block mb-2">Theme</label>
					<select id="theme-selector" value={theme} onChange={(e) => setTheme(e.target.value)} className="w-full p-2 border rounded">
						<option value="light">Light</option>
						<option value="dark">Dark</option>
						<option value="system">System</option>
					</select>
				</div>
				<div className="mb-4">
					<label htmlFor="fetch-date-selector" className="block mb-2">Earliest Fetch Date (days ago)</label>
					<input id="fetch-date-selector" type="number" value={earliestFetchDate} onChange={(e) => setEarliestFetchDate(parseInt(e.target.value, 10))} className="w-full p-2 border rounded" />
				</div>
				<div className="mb-4">
					<label htmlFor="admin-mode-toggle" className="flex items-center cursor-pointer" title="Toggle Admin Mode, setting a wrong password will still enable it, but transactions will fail">
						<div className="relative" >
							<input id="admin-mode-toggle" type="checkbox" className="sr-only" checked={isAdminMode} onChange={handleAdminToggle} />
							<div className="block bg-gray-600 w-14 h-8 rounded-full"></div>
							<div className="dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition"></div>
						</div>
						<div className="ml-3 text-gray-700 font-medium">Admin Mode</div>
					</label>
					{showPasswordField && (
						<div className="mt-2">
							<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-2 border rounded" placeholder="Enter admin key" />
							<button onClick={handlePasswordSubmit} className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md">Submit</button>
						</div>
					)}
				</div>
				<div className="flex justify-end">
					<button
						type="button"
						className="mr-2 px-4 py-2 bg-gray-300 rounded-md"
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