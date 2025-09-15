import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Textarea } from "@/shared/components/ui/textarea";

interface JwtTokenInputProps {
  token: string;
  onTokenChange: (token: string) => void;
  onClear: () => void;
  copyStatus: string;
}

export function JwtTokenInput({ token, onTokenChange, onClear, copyStatus }: JwtTokenInputProps) {
  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle>JWT Decoder</CardTitle>
        <CardDescription>
          Decode and validate JSON Web Tokens (JWT) to inspect their contents and claims
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="jwt-input" className="text-sm font-medium">
            JWT Token
          </label>
          <Textarea
            id="jwt-input"
            placeholder="Paste your JWT token here...

Example JWT format:
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
            value={token}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => onTokenChange(e.target.value)}
            className="min-h-[300px] font-mono text-sm resize-none"
          />
        </div>

        <div className="flex gap-2">
          <Button onClick={onClear} variant="outline" size="sm">
            Clear
          </Button>
          {copyStatus && (
            <Badge variant="secondary" className="ml-auto">
              {copyStatus}
            </Badge>
          )}
        </div>

        <div className="text-xs text-muted-foreground space-y-1">
          <p>• JWT tokens consist of three parts: header.payload.signature</p>
          <p>• Each part is Base64URL encoded</p>
          <p>• This tool only decodes tokens - no verification with secret keys</p>
        </div>
      </CardContent>
    </Card>
  );
}
