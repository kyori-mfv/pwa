import type { ComparisonResult, ComparisonStrategy } from "./types";

export class CharacterComparisonStrategy implements ComparisonStrategy {
  name = "Character-level";
  description = "Compare texts character by character with inline highlighting";

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

    const result = this.generateCharDiff(textA, textB);
    return result;
  }

  private generateCharDiff(textA: string, textB: string): ComparisonResult {
    let unified = "";
    let additions = 0;
    let deletions = 0;

    const maxLen = Math.max(textA.length, textB.length);

    for (let i = 0; i < maxLen; i++) {
      const charA = i < textA.length ? textA[i] : null;
      const charB = i < textB.length ? textB[i] : null;

      if (charA === charB) {
        unified += charA || "";
      } else if (charA && charB) {
        unified += `[-${charA}-][+${charB}+]`;
        deletions++;
        additions++;
      } else if (charA) {
        unified += `[-${charA}-]`;
        deletions++;
      } else if (charB) {
        unified += `[+${charB}+]`;
        additions++;
      }
    }

    return {
      unified,
      additions,
      deletions,
      changes: additions + deletions,
      identical: false,
    };
  }
}
