import type { JwtDecodeResult, JwtValidationResult } from "../types";

function base64UrlDecode(str: string): string {
  try {
    // Add padding if needed
    let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
    while (base64.length % 4) {
      base64 += "=";
    }
    return atob(base64);
  } catch {
    throw new Error("Invalid Base64URL encoding");
  }
}

export function decodeJwt(token: string): JwtDecodeResult {
  if (!token || typeof token !== "string") {
    return {
      isValid: false,
      error: "Token is required and must be a string",
    };
  }

  const parts = token.split(".");
  if (parts.length !== 3) {
    return {
      isValid: false,
      error: "Invalid JWT format. Expected 3 parts separated by dots.",
    };
  }

  try {
    const [headerPart, payloadPart, signaturePart] = parts;

    // Decode header
    const headerJson = base64UrlDecode(headerPart);
    const header = JSON.parse(headerJson);

    // Decode payload
    const payloadJson = base64UrlDecode(payloadPart);
    const payload = JSON.parse(payloadJson);

    return {
      isValid: true,
      header,
      payload,
      signature: signaturePart,
    };
  } catch (error) {
    return {
      isValid: false,
      error: error instanceof Error ? error.message : "Failed to decode JWT",
    };
  }
}

export function validateJwt(decoded: JwtDecodeResult): JwtValidationResult {
  const errors: string[] = [];

  if (!decoded.isValid || !decoded.payload) {
    return {
      isValidFormat: false,
      errors: [decoded.error || "Invalid JWT format"],
    };
  }

  const payload = decoded.payload;
  const now = Math.floor(Date.now() / 1000);

  // Check expiration
  let isExpired = false;
  let expiresAt: Date | undefined;
  if (typeof payload.exp === "number") {
    expiresAt = new Date(payload.exp * 1000);
    isExpired = payload.exp < now;
    if (isExpired) {
      errors.push(`Token expired at ${expiresAt.toISOString()}`);
    }
  }

  // Check not before
  if (typeof payload.nbf === "number" && payload.nbf > now) {
    const notBeforeDate = new Date(payload.nbf * 1000);
    errors.push(`Token not valid before ${notBeforeDate.toISOString()}`);
  }

  // Check issued at
  let issuedAt: Date | undefined;
  if (typeof payload.iat === "number") {
    issuedAt = new Date(payload.iat * 1000);
    if (payload.iat > now) {
      errors.push("Token issued in the future");
    }
  }

  return {
    isValidFormat: true,
    isExpired,
    expiresAt,
    issuedAt,
    issuer: typeof payload.iss === "string" ? payload.iss : undefined,
    subject: typeof payload.sub === "string" ? payload.sub : undefined,
    audience:
      typeof payload.aud === "string" || Array.isArray(payload.aud) ? payload.aud : undefined,
    errors,
  };
}

export function formatJwtSection(section: Record<string, unknown>): string {
  return JSON.stringify(section, null, 2);
}
