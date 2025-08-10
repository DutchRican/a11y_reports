export type DateFilter = { to?: string, from?: string };
export type ScanResultFilter = { testName: { filter?: string, type?: 'contains' }, created: DateFilter }