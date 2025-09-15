export interface JwtDecodeResult {
  isValid: boolean;
  header?: Record<string, unknown>;
  payload?: Record<string, unknown>;
  signature?: string;
  error?: string;
}

export interface JwtValidationResult {
  isValidFormat: boolean;
  isExpired?: boolean;
  expiresAt?: Date;
  issuedAt?: Date;
  issuer?: string;
  subject?: string;
  audience?: string | string[];
  errors: string[];
}

export interface JwtDecoderState extends Record<string, unknown> {
  token: string;
  decodedResult: JwtDecodeResult | null;
  validationResult: JwtValidationResult | null;
}
