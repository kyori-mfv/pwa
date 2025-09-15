# JWT Decoder

A comprehensive JWT (JSON Web Token) decoder and validator for inspecting token contents and validating claims.

## Features

- **JWT Decoding**: Decode header, payload, and signature sections
- **Token Validation**: Check expiration, issuer, audience, and other claims
- **Claims Inspection**: View formatted claims information with timestamps
- **Copy Functionality**: Copy individual sections or formatted JSON
- **State Persistence**: Maintains token and results across navigation
- **Error Handling**: Clear validation messages and error reporting

## Quick Start

```typescript
import { JwtDecoder } from './components';

// Component usage
<JwtDecoder instanceId="jwt-decoder-1" />
```

### Example JWT Token

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
```

## Architecture

### Design Patterns

- **Plugin Architecture**: Self-contained tool with auto-registration
- **Composite Pattern**: UI split into focused, reusable components
- **State Management**: Persistent state with `useToolState` hook
- **Separation of Concerns**: Clear division between UI, logic, and types

### Component Structure

```
jwt-decoder/
├── index.ts                     # Plugin registration
├── types/index.ts               # TypeScript interfaces
├── utils/                       # Business logic
│   ├── index.ts                # Exports
│   └── jwt-decoder.ts          # Decode & validation logic
└── components/                  # UI components
    ├── index.ts                # Component exports
    ├── jwt-decoder.tsx         # Main orchestrator
    ├── jwt-token-input.tsx     # Input form
    ├── jwt-validation-status.tsx # Status alerts
    ├── jwt-claims-info.tsx     # Claims display
    └── jwt-decoded-display.tsx # Output sections
```

## Usage Examples

### Basic JWT Decoding

```typescript
import { decodeJwt } from './utils';

const token = "eyJ...";
const result = decodeJwt(token);

if (result.isValid) {
  console.log('Header:', result.header);
  console.log('Payload:', result.payload);
  console.log('Signature:', result.signature);
}
```

### Token Validation

```typescript
import { validateJwt } from './utils';

const validation = validateJwt(decodedResult);

if (validation.isValidFormat) {
  console.log('Expires:', validation.expiresAt);
  console.log('Issuer:', validation.issuer);
  console.log('Errors:', validation.errors);
}
```

### State Management

```typescript
import { useToolState } from '@/shared/hooks/use-tool-state';

const [state, setState] = useToolState(instanceId, {
  token: "",
  decodedResult: null,
  validationResult: null
});
```

## Interface Definitions

### Core Types

```typescript
interface JwtDecodeResult {
  isValid: boolean;
  header?: Record<string, unknown>;
  payload?: Record<string, unknown>;
  signature?: string;
  error?: string;
}

interface JwtValidationResult {
  isValidFormat: boolean;
  isExpired?: boolean;
  expiresAt?: Date;
  issuedAt?: Date;
  issuer?: string;
  subject?: string;
  audience?: string | string[];
  errors: string[];
}
```

## Extending the Tool

### Adding New Validation Rules

```typescript
// In utils/jwt-decoder.ts
export function validateJwt(decoded: JwtDecodeResult): JwtValidationResult {
  const errors: string[] = [];
  
  // Add custom validation
  if (payload.customClaim && !isValidCustomClaim(payload.customClaim)) {
    errors.push('Invalid custom claim format');
  }
  
  return { /* validation result */ };
}
```

### Custom UI Components

```typescript
// Create new component
export function JwtCustomSection({ decodedResult }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Custom Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Custom logic */}
      </CardContent>
    </Card>
  );
}

// Add to main component
import { JwtCustomSection } from './jwt-custom-section';
```

## Integration

### Plugin Registration

```typescript
import { toolRegistry } from '@/core/registry/tool-registry';

const JwtDecoderPlugin: ToolPlugin = {
  id: "jwt-decoder",
  metadata: {
    name: "JWT Decoder",
    category: "utility",
    description: "Decode and validate JSON Web Tokens",
    version: "1.0.0",
    icon: "🔐"
  },
  component: JwtDecoder
};

toolRegistry.register(JwtDecoderPlugin);
```

### Dependencies

- `@/shared/hooks/use-tool-state` - State persistence
- `@/shared/components/ui/*` - UI components (shadcn/ui)
- `lucide-react` - Icons
- `React` - Framework

## Technical Notes

- **Base64URL Decoding**: Handles JWT-specific Base64URL encoding
- **No Signature Verification**: Tool only decodes - no cryptographic verification
- **Client-Side Only**: All processing happens in the browser
- **Responsive Design**: Mobile-first with left/right layout on desktop

## Security Considerations

- Tokens are processed locally - never sent to servers
- Tool displays decoded content but doesn't validate signatures
- Users should verify tokens with proper secret keys separately
- Claims validation checks format but not cryptographic integrity