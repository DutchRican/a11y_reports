export interface subNode {
  _id: string,
  data: { [key: string]: any }[],
  relatedNodes: [string],
  impact: string,
  message: string,
}

type impact = 'critical' | 'serious' | 'moderate' | 'minor';
export interface A11yViolation {
  _id: string;
  impact: impact;
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
  pageUrl: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

export interface ViolationReport {
  count: number;
  url: string;
  help: string;
  impact: impact;
}