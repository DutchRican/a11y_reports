export interface A11yViolation {
  id: string;
  impact: 'critical' | 'serious' | 'moderate' | 'minor';
  description: string;
  help: string;
  helpUrl: string;
  nodes: Array<{
    html: string;
    target: string[];
  }>;
}

export interface ScanResult {
  _id: string;
  specName: string;
  pageUrl: string;
  timestamp: string;
  violations: A11yViolation[];
}