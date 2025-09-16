import type { ComparisonResult, ComparisonStrategy } from "./types";

export class LineComparisonStrategy implements ComparisonStrategy {
  name = "Line-by-line";
  description = "Compare texts line by line with unified diff format";

  compare(textA: string, textB: string): ComparisonResult {
    const linesA = textA.split("\n");
    const linesB = textB.split("\n");

    if (textA === textB) {
      return {
        unified: "Texts are identical",
        additions: 0,
        deletions: 0,
        changes: 0,
        identical: true,
      };
    }

    const result = this.generateUnifiedDiff(linesA, linesB);
    return result;
  }

  private generateUnifiedDiff(linesA: string[], linesB: string[]): ComparisonResult {
    const diff = this.calculateLCS(linesA, linesB);
    let unified = "";
    let additions = 0;
    let deletions = 0;
    let changes = 0;

    let i = 0;
    let j = 0;
    while (i < linesA.length || j < linesB.length) {
      if (i < linesA.length && j < linesB.length && linesA[i] === linesB[j]) {
        unified += `  ${linesA[i]}\n`;
        i++;
        j++;
      } else if (i < linesA.length && (j >= linesB.length || !diff[i][j])) {
        unified += `- ${linesA[i]}\n`;
        deletions++;
        i++;
      } else {
        unified += `+ ${linesB[j]}\n`;
        additions++;
        j++;
      }
    }

    changes = Math.max(additions, deletions);

    return {
      unified: unified.trim(),
      additions,
      deletions,
      changes,
      identical: false,
    };
  }

  private calculateLCS(a: string[], b: string[]): boolean[][] {
    const dp: number[][] = Array(a.length + 1)
      .fill(null)
      .map(() => Array(b.length + 1).fill(0));

    for (let i = 1; i <= a.length; i++) {
      for (let j = 1; j <= b.length; j++) {
        if (a[i - 1] === b[j - 1]) {
          dp[i][j] = dp[i - 1][j - 1] + 1;
        } else {
          dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
        }
      }
    }

    const lcs: boolean[][] = Array(a.length)
      .fill(null)
      .map(() => Array(b.length).fill(false));
    let i = a.length;
    let j = b.length;

    while (i > 0 && j > 0) {
      if (a[i - 1] === b[j - 1]) {
        lcs[i - 1][j - 1] = true;
        i--;
        j--;
      } else if (dp[i - 1][j] > dp[i][j - 1]) {
        i--;
      } else {
        j--;
      }
    }

    return lcs;
  }
}
