import type { ComparisonResult, ComparisonStrategy } from "./types";

export class SideBySideComparisonStrategy implements ComparisonStrategy {
  name = "Side-by-side";
  description = "Split view comparison with aligned lines";

  compare(textA: string, textB: string): ComparisonResult {
    if (textA === textB) {
      return {
        unified: "Texts are identical",
        additions: 0,
        deletions: 0,
        changes: 0,
        identical: true,
      };
    }

    const result = this.generateSideBySide(textA, textB);
    return result;
  }

  private generateSideBySide(textA: string, textB: string): ComparisonResult {
    const linesA = textA.split("\n");
    const linesB = textB.split("\n");

    let unified = "LEFT SIDE | RIGHT SIDE\n";
    unified += "---------|----------\n";

    const maxLines = Math.max(linesA.length, linesB.length);
    let additions = 0;
    let deletions = 0;

    for (let i = 0; i < maxLines; i++) {
      const lineA = i < linesA.length ? linesA[i] : "";
      const lineB = i < linesB.length ? linesB[i] : "";

      const leftPadded = lineA.padEnd(30);

      if (lineA === lineB) {
        unified += `${leftPadded} | ${lineB}\n`;
      } else {
        if (lineA && lineB) {
          unified += `${leftPadded} | ${lineB} [CHANGED]\n`;
          deletions++;
          additions++;
        } else if (lineA) {
          unified += `${leftPadded} | [DELETED]\n`;
          deletions++;
        } else {
          unified += `${"".padEnd(30)} | ${lineB} [ADDED]\n`;
          additions++;
        }
      }
    }

    return {
      unified,
      additions,
      deletions,
      changes: Math.max(additions, deletions),
      identical: false,
    };
  }
}
