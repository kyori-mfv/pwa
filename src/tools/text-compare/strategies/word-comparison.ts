import type { ComparisonResult, ComparisonStrategy } from "./types";

export class WordComparisonStrategy implements ComparisonStrategy {
  name = "Word-level";
  description = "Compare texts word by word with token-based highlighting";

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

    const result = this.generateWordDiff(textA, textB);
    return result;
  }

  private generateWordDiff(textA: string, textB: string): ComparisonResult {
    const wordsA = this.tokenize(textA);
    const wordsB = this.tokenize(textB);

    let unified = "";
    let additions = 0;
    let deletions = 0;

    const maxLen = Math.max(wordsA.length, wordsB.length);

    for (let i = 0; i < maxLen; i++) {
      const wordA = i < wordsA.length ? wordsA[i] : null;
      const wordB = i < wordsB.length ? wordsB[i] : null;

      if (wordA === wordB) {
        unified += wordA || "";
      } else if (wordA && wordB) {
        unified += `{-${wordA}-}{+${wordB}+}`;
        deletions++;
        additions++;
      } else if (wordA) {
        unified += `{-${wordA}-}`;
        deletions++;
      } else if (wordB) {
        unified += `{+${wordB}+}`;
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

  private tokenize(text: string): string[] {
    return text.split(/(\s+|[.,;:!?])/g).filter((token) => token.length > 0);
  }
}
