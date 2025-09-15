import { Clock, Shield, User } from "lucide-react";
import type { JwtValidationResult } from "../types";

interface JwtClaimsInfoProps {
  validationResult: JwtValidationResult | null;
}

export function JwtClaimsInfo({ validationResult }: JwtClaimsInfoProps) {
  if (!validationResult) return null;

  const { expiresAt, issuedAt, issuer, subject, audience } = validationResult;

  return (
    <div className="space-y-3">
      {expiresAt && (
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4" />
          <span className="text-sm">Expires: {expiresAt.toLocaleString()}</span>
        </div>
      )}
      {issuedAt && (
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4" />
          <span className="text-sm">Issued: {issuedAt.toLocaleString()}</span>
        </div>
      )}
      {issuer && (
        <div className="flex items-center gap-2">
          <Shield className="h-4 w-4" />
          <span className="text-sm">Issuer: {issuer}</span>
        </div>
      )}
      {subject && (
        <div className="flex items-center gap-2">
          <User className="h-4 w-4" />
          <span className="text-sm">Subject: {subject}</span>
        </div>
      )}
      {audience && (
        <div className="flex items-center gap-2">
          <User className="h-4 w-4" />
          <span className="text-sm">
            Audience: {Array.isArray(audience) ? audience.join(", ") : audience}
          </span>
        </div>
      )}
    </div>
  );
}
