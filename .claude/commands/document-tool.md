---
description: Generate comprehensive documentation for tool
argument-hint: [tool-name]
---

Generate comprehensive documentation for tool: **$1**

**Documentation to Generate:**
1. **README.md** - Main tool documentation
2. **API Documentation** - Component interfaces and props
3. **Usage Examples** - Code examples and common patterns
4. **Integration Guide** - How to connect with other tools
5. **Development Guide** - How to extend and modify the tool

**Documentation Structure:**
```
src/tools/$1/README.md
├── Overview
├── Features
├── Usage Instructions
├── Component API
├── Architecture Details
├── Integration Points
├── Testing Guide
└── Contributing Guidelines
```

**Content Requirements:**
- Clear feature descriptions with examples
- Component prop interfaces and usage
- Strategy pattern implementations
- Command pattern usage
- Event integration examples
- Testing approach and examples
- Troubleshooting guide

**Additional Documentation:**
- Update main project documentation
- Add tool to registry documentation
- Create usage examples in docs/examples/
- Update development workflow docs

**Output:**
- Complete README.md for the tool
- Updated project-level documentation
- Integration examples and guides
- Development workflow updates

Please analyze the specified tool and generate comprehensive, maintainable documentation following the project's documentation standards.