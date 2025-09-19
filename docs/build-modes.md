# Build Modes Documentation

## Overview

The Developer Tools PWA supports two distinct deployment modes:

1. **Multi-App Mode (Default)**: Full PWA with all tools in a tabbed interface
2. **Individual App Mode**: Single-tool deployment for specific apps with optimized bundle sizes

## Architecture

### Mode Detection

The application uses environment variables and build-time constants for mode detection:

```typescript
// Build-time constants injected by Vite
declare global {
  const __BUILD_MODE__: boolean;
  const __BUILD_APP_ID__: string | undefined;
}

const isBuildMode = __BUILD_MODE__;
const buildAppId = __BUILD_APP_ID__;
```

### Configuration (vite.config.ts)

```typescript
const buildAppId = process.env.VITE_BUILD_APP_ID;
const isBuildMode = !!buildAppId;

export default defineConfig({
  define: {
    __BUILD_APP_ID__: JSON.stringify(buildAppId),
    __BUILD_MODE__: JSON.stringify(isBuildMode),
  },
  // PWA manifest customization based on build mode
  plugins: [
    VitePWA({
      manifest: isBuildMode ? getIndividualManifest(buildAppId) : getMultiAppManifest(),
    }),
  ],
});
```

## Multi-App Mode (Default)

### Features
- All tools available in tabbed interface
- Full PWA functionality
- Tool switching without page reload
- Shared state management across tools

### Build Commands
```bash
pnpm dev          # Development server
pnpm build        # Production build
pnpm preview      # Preview production build
```

### File Structure
```
src/
├── app/multi.tsx                    # Multi-app bootstrap
├── shared/components/layout/
│   ├── app-layout.tsx              # Main layout with sidebar
│   └── app-body.tsx                # Content area with tabs
└── tools/                          # All tools loaded
```

### Layout Components

#### AppLayout (`app-layout.tsx`)
- Main application shell
- Sidebar with tool navigation
- Theme toggle
- Header with application branding

#### AppBody (`app-body.tsx`)
- Renders current active tool
- Supports tool headers when available
- Fallback welcome screen when no tool selected

## Individual App Mode

### Features
- Single tool deployment
- Optimized bundle size (only loads target tool)
- Dedicated layout for individual tool
- Environment-specific PWA manifest
- Full theme support

### Build Commands
```bash
# Development
pnpm dev:json-formatter
pnpm dev:text-compare
pnpm dev:indexeddb-crud
pnpm dev:expense-manager
pnpm dev:jwt-decoder

# Production Build
pnpm build:json-formatter
pnpm build:text-compare
pnpm build:indexeddb-crud
pnpm build:expense-manager
pnpm build:jwt-decoder

# Preview
pnpm preview:json-formatter
pnpm preview:text-compare
pnpm preview:indexeddb-crud
pnpm preview:expense-manager
pnpm preview:jwt-decoder
```

### File Structure
```
src/
├── app/individual.tsx                         # Individual app bootstrap
├── shared/components/layout/
│   └── individual-app-layout.tsx             # Individual app layout
└── tools/[target-tool]/                      # Only target tool loaded
```

### Layout Components

#### IndividualAppLayout (`individual-app-layout.tsx`)
- Dedicated layout for single tool
- Tool-specific header with title and description
- Theme toggle support
- Automatic tool initialization
- Uses tool's header component when available

```typescript
const HeaderComponent = selectedApp?.header;

{HeaderComponent ? (
  <HeaderComponent />
) : (
  // Fallback to metadata rendering
  <>
    <div className="text-xl">{selectedApp?.metadata.icon}</div>
    <div>
      <h1 className="text-lg font-semibold">{selectedApp?.metadata.name}</h1>
      <p className="text-sm text-muted-foreground">
        {selectedApp?.metadata.description}
      </p>
    </div>
  </>
)}
```

## Bundle Optimization

### Dynamic Tool Loading

Individual mode only loads the target tool, significantly reducing bundle size:

```typescript
// src/index.tsx
async function bootstrapApp() {
  if (isBuildMode && buildAppId) {
    // Load only the target tool
    switch (buildAppId) {
      case "json-formatter":
        await import("@/tools/json-formatter");
        break;
      case "text-compare":
        await import("@/tools/text-compare");
        break;
      // ... other cases
    }
  } else {
    // Multi-app mode - load all tools
    await import("@/tools/json-formatter");
    await import("@/tools/text-compare");
    // ... load all
  }
}
```

### Build Optimization Benefits
- **Reduced Bundle Size**: Only target tool code included
- **Faster Load Times**: Less JavaScript to parse and execute
- **Better Performance**: Optimized for single-tool usage
- **PWA Optimization**: Tool-specific manifest and caching

## Tool Interface Refactor

### Updated Tool Plugin Interface

```typescript
export interface ToolPlugin {
  id: string;
  metadata: ToolMetadata;
  body: React.ComponentType<ToolComponentProps>;  // Renamed from 'component'
  header?: React.ComponentType;                    // Renamed from 'headerComponent'
}
```

### Header System

Tools can define custom header components that work in both modes:

```typescript
// Tool definition
const MyToolPlugin: ToolPlugin = {
  id: "my-tool",
  metadata: { /* ... */ },
  body: MyTool,
  header: MyToolHeader,  // Optional custom header
};
```

**Multi-App Mode**: Headers render above tool content in the main content area
**Individual Mode**: Headers render in the application header or fall back to metadata

## Environment Variables

### Development
```bash
# Multi-app mode (default)
pnpm dev

# Individual app mode
VITE_BUILD_APP_ID=json-formatter pnpm dev
```

### Production Build
```bash
# Multi-app mode (default)
pnpm build

# Individual app mode
VITE_BUILD_APP_ID=json-formatter pnpm build
```

## Deployment Strategies

### Multi-App Deployment
- Single deployment serves all tools
- Users access all functionality from one URL
- Suitable for internal tools or comprehensive tool suites

### Individual App Deployment
- Multiple deployments, one per tool
- Each tool has its own URL and optimized bundle
- Suitable for:
  - Public tool deployments
  - Performance-critical applications
  - Tool-specific branding requirements
  - Microservice architectures

## Migration Guide

### From Single Mode to Dual Mode

1. **Tool Registration**: Ensure all tools follow the new plugin interface
2. **Header Components**: Extract inline headers to separate components if needed
3. **Build Scripts**: Add individual app commands to package.json
4. **Testing**: Verify both modes work correctly

### Tool Interface Updates

```typescript
// Before
const MyToolPlugin: ToolPlugin = {
  component: MyTool,
  headerComponent: MyHeader,
  // ...
};

// After
const MyToolPlugin: ToolPlugin = {
  body: MyTool,      // Renamed for clarity
  header: MyHeader,  // Renamed for consistency
  // ...
};
```

## Best Practices

### Tool Development
1. **Self-Contained**: Each tool should be fully self-contained
2. **Header Support**: Consider providing a custom header component
3. **Responsive Design**: Ensure tools work well in both layout modes
4. **State Management**: Use provided state persistence hooks

### Build Configuration
1. **Environment Detection**: Always check build mode in conditional logic
2. **Bundle Analysis**: Monitor bundle sizes in individual mode
3. **PWA Manifests**: Customize manifests per deployment mode
4. **Testing**: Test both modes during development

### Performance Considerations
1. **Code Splitting**: Leverage dynamic imports for large dependencies
2. **Lazy Loading**: Use React.lazy for component-level code splitting
3. **Bundle Optimization**: Monitor and optimize individual app bundles
4. **Caching**: Implement appropriate caching strategies per mode

## Troubleshooting

### Common Issues

1. **Wrong Mode Loading**: Check VITE_BUILD_APP_ID environment variable
2. **Missing Tool**: Ensure tool is registered and imported correctly
3. **Header Not Showing**: Verify header component is properly exported
4. **Bundle Size**: Check for unnecessary imports in individual mode

### Debug Commands
```bash
# Check build mode
echo $VITE_BUILD_APP_ID

# Verify build output
pnpm build:json-formatter && ls dist/

# Test individual mode
pnpm dev:json-formatter --port 3001
```