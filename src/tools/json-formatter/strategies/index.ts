export interface FormattingStrategy {
  name: string;
  description: string;
  format(json: string): string;
}

export class PrettyFormatStrategy implements FormattingStrategy {
  name = "Pretty";
  description = "Standard 2-space indentation";

  format(json: string): string {
    try {
      const parsed = JSON.parse(json);
      return JSON.stringify(parsed, null, 2);
    } catch (error) {
      throw new Error(`Invalid JSON: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  }
}

export class CompactFormatStrategy implements FormattingStrategy {
  name = "Compact";
  description = "Minimal spacing, 1-space indentation";

  format(json: string): string {
    try {
      const parsed = JSON.parse(json);
      return JSON.stringify(parsed, null, 1);
    } catch (error) {
      throw new Error(`Invalid JSON: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  }
}

export class MinifiedFormatStrategy implements FormattingStrategy {
  name = "Minified";
  description = "Remove all whitespace";

  format(json: string): string {
    try {
      const parsed = JSON.parse(json);
      return JSON.stringify(parsed);
    } catch (error) {
      throw new Error(`Invalid JSON: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  }
}

export class TabFormatStrategy implements FormattingStrategy {
  name = "Tabs";
  description = "Tab-based indentation";

  format(json: string): string {
    try {
      const parsed = JSON.parse(json);
      return JSON.stringify(parsed, null, "\t");
    } catch (error) {
      throw new Error(`Invalid JSON: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  }
}
