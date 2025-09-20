import { v4 as uuidv4 } from "uuid";

/**
 * Cross-platform UUID generation utility
 * Uses the uuid library which provides reliable UUID generation across all platforms
 */
export function generateUUID(): string {
  return uuidv4();
}
