export type TestNameFilterModel = { filter?: string };
export type DateOptionsFilterModel = {
	dateFrom?: string,
	dateTo?: string,
	filterType: "date",
	type: "after" | "before" | "greaterThan" | "lessThan"
};
export type DateFilterModel = {
	filterType?: "date",
	operator?: 'AND' | 'OR',
	type?: "after" | "before" | "inRange" | "greaterThan" | "lessThan",
	conditions?: [DateOptionsFilterModel],
	dateFrom?: string,
	dateTo?: string,
}
export type FilterModel = { created?: any; testName?: TestNameFilterModel };