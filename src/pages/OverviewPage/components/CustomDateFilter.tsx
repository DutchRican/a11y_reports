import { DoesFilterPassParams, FilterDisplayParams } from 'ag-grid-community';
import { useGridFilter } from 'ag-grid-react';
import { useCallback, useEffect, useState } from 'react';

interface DateRangeModel {
	from?: string;
	to?: string;
}

interface CustomDateFilterProps extends FilterDisplayParams<DateRangeModel> {
	onFilterChanged: (key: string, value: string | DateRangeModel) => void;
}

const CustomDateFilter = (props: CustomDateFilterProps) => {
	const { onModelChange, getValue, model, api, onFilterChanged } = props;
	const [fromDate, setFromDate] = useState('');
	const [toDate, setToDate] = useState('');

	useEffect(() => {
		setFromDate(model?.from || '');
		setToDate(model?.to || '')
	}, [model]);

	const applyFilter = useCallback(() => {
		let filterValue = {};
		if (fromDate && toDate) {
			if (fromDate === toDate) {
				filterValue = { from: fromDate };
			} else {
				filterValue = { from: fromDate, to: toDate };
			}
		} else if (fromDate) {
			filterValue = { from: fromDate };
		} else if (toDate) {
			filterValue = { to: toDate };
		}

		onFilterChanged?.('date', filterValue);

		if (!fromDate && !toDate) {
			onModelChange(null); // clears filter
		} else {
			onModelChange({ from: fromDate || undefined, to: toDate || undefined });
		}
		api?.hidePopupMenu();
	}, [fromDate, toDate, onModelChange, api, onFilterChanged]);

	const resetFilter = useCallback(() => {
		setFromDate('');
		setToDate('');
		onModelChange(null);
		onFilterChanged?.('date', '');
		api?.hidePopupMenu();
	}, [onModelChange, onFilterChanged, api]);

	const doesFilterPass = useCallback(
		({ node }: DoesFilterPassParams) => {
			const value = getValue(node); // raw value from the grid cell
			if (!value) return false;

			const cellDate = new Date(value);
			if (isNaN(cellDate.getTime())) return false;

			let fromCheck = true;
			let toCheck = true;

			if (model?.from) {
				const from = new Date(model.from);
				fromCheck = cellDate >= from;
			}

			if (model?.to) {
				const to = new Date(model.to);
				to.setDate(to.getDate() + 1);
				toCheck = cellDate <= to;
			}

			return fromCheck && toCheck;
		},
		[getValue, model]
	);

	useGridFilter({ doesFilterPass });

	return (
		<div className="flex flex-col gap-2 p-4">
			<div>
				<label htmlFor="from-date-filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
					From
				</label>
				<input
					type="date"
					id="from-date-filter"
					value={fromDate}
					onChange={(e) => setFromDate(e.target.value)}
					className="mt-1 w-full border-gray-300 rounded-md shadow-sm p-2 dark:bg-gray-700 dark:text-white dark:border-gray-600"
				/>
			</div>
			<div>
				<label htmlFor="to-date-filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
					To
				</label>
				<input
					type="date"
					id="to-date-filter"
					value={toDate}
					onChange={(e) => setToDate(e.target.value)}
					className="mt-1 w-full border-gray-300 rounded-md shadow-sm p-2 dark:bg-gray-700 dark:text-white dark:border-gray-600"
				/>
			</div>
			<div className="flex gap-2 mt-2 ag-filter-apply-panel">
				<button
					type="button"
					onClick={applyFilter}
					className="ag-standard-button ag-filter-apply-panel-button"
				>
					Apply
				</button>
				<button
					type="button"
					onClick={resetFilter}
					className="ag-standard-button ag-filter-apply-panel-button"
				>
					Reset
				</button>
			</div>
		</div>
	);
};

export default CustomDateFilter;