export interface subNode {
  _id: string,
  data: { [key: string]: any }[],
  relatedNodes: [string],
  impact: string,
  message: string,
}
export interface A11yViolation {
  _id: string;
  impact: 'critical' | 'serious' | 'moderate' | 'minor';
  description: string;
  help: string;
  helpUrl: string;
  url: string;
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
  impactCounts: {
    critical: number;
    serious: number;
    moderate: number;
    minor: number;
  };
  totalViolations: number;
  violations?: A11yViolation[];
}

export interface Project {
  _id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}