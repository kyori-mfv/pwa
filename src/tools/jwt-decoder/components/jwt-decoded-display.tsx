import { Alert, AlertDescription, AlertTitle } from "@/shared/components/ui/alert";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { AlertCircle, Copy } from "lucide-react";
import type { JwtDecodeResult, JwtValidationResult } from "../types";
import { formatJwtSection } from "../utils";
import { JwtClaimsInfo } from "./jwt-claims-info";

interface JwtDecodedDisplayProps {
  decodedResult: JwtDecodeResult | null;
  validationResult: JwtValidationResult | null;
  onCopy: (text: string, label: string) => void;
}

export function JwtDecodedDisplay({
  decodedResult,
  validationResult,
  onCopy,
}: JwtDecodedDisplayProps) {
  if (!decodedResult?.isValid) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Decoded Output</CardTitle>
          <CardDescription>
            JWT sections will appear here after entering a valid token
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center text-muted-foreground">
            <div className="text-4xl mb-4">🔐</div>
            <p className="text-lg font-medium mb-2">No JWT Token</p>
            <p className="text-sm">Enter a JWT token on the left to see its decoded contents</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Payload Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">Payload (Claims)</CardTitle>
              <CardDescription>JWT payload containing claims and user data</CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                decodedResult?.payload && onCopy(formatJwtSection(decodedResult.payload), "Payload")
              }
            >
              <Copy className="h-4 w-4 mr-2" />
              Copy
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="h-[200px] overflow-y-auto">
            <pre className="text-sm bg-muted p-4 rounded">
              {decodedResult?.payload && formatJwtSection(decodedResult.payload)}
            </pre>
          </div>
          <div className="pt-4 border-t">
            <h4 className="text-sm font-medium mb-3">Claims Information</h4>
            <JwtClaimsInfo validationResult={validationResult} />
          </div>
        </CardContent>
      </Card>

      {/* Header Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">Header</CardTitle>
              <CardDescription>JWT header containing algorithm and token type</CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                decodedResult?.header && onCopy(formatJwtSection(decodedResult.header), "Header")
              }
            >
              <Copy className="h-4 w-4 mr-2" />
              Copy
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[150px] overflow-y-auto">
            <pre className="text-sm bg-muted p-4 rounded">
              {decodedResult?.header && formatJwtSection(decodedResult.header)}
            </pre>
          </div>
        </CardContent>
      </Card>

      {/* Signature Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">Signature</CardTitle>
              <CardDescription>JWT signature for token verification</CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                decodedResult?.signature && onCopy(decodedResult.signature, "Signature")
              }
            >
              <Copy className="h-4 w-4 mr-2" />
              Copy
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm bg-muted p-4 rounded font-mono break-all">
            {decodedResult?.signature}
          </div>
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Signature Verification</AlertTitle>
            <AlertDescription>
              This tool only decodes JWT tokens. To verify the signature, you need the secret key or
              public key used to sign the token.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
}
