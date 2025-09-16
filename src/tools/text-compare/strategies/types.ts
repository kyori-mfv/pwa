export interface ComparisonResult {
  unified: string;
  additions: number;
  deletions: number;
  changes: number;
  identical: boolean;
}

export interface ComparisonStrategy {
  name: string;
  description: string;
  compare(textA: string, textB: string): ComparisonResult;
}
