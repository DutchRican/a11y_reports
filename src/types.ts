export interface subNode {
  id: String,
  data: { [key: string]: any }[],
  relatedNodes: [String],
  impact: String,
  message: String,
}
export interface A11yViolation {
  id: string;
  impact: 'critical' | 'serious' | 'moderate' | 'minor';
  description: string;
  help: string;
  helpUrl: string;
  nodes: Array<{
    html: string;
    target: string[];
    failureSummary: string;
    any: Array<subNode>;
    all: Array<subNode>;
    none: Array<subNode>;
  }>;
  tags: string[];
}

export interface ScanResult {
  _id: string;
  testName: string;
  url: string;
  created: string;
  violations: A11yViolation[];
}