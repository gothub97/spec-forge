# Contributing to SpecForge

Thank you for your interest in contributing to SpecForge! This project is open source from day one and we welcome contributions.

## Project Structure

SpecForge is a monorepo with three packages:

- `packages/cli` — The `specforge` CLI tool
- `packages/skills` — Claude Code skill files and hooks
- `packages/vscode` — VS Code extension

## Getting Started

```bash
# Clone the repo
git clone https://github.com/<your-org>/specforge.git
cd specforge

# Install dependencies
npm install

# Build all packages
npm run build
```

## Development

### CLI

```bash
cd packages/cli
npm run dev        # Watch mode
npm run build      # Production build
npm run test       # Run tests
npm link           # Link globally for local testing
```

### Skills

Skills are Markdown files — edit them directly. Test by using them in Claude Code on a sample project.

### VS Code Extension

```bash
cd packages/vscode
npm run dev        # Watch + launch Extension Development Host
npm run test       # Run extension tests
npm run package    # Create .vsix
```

## Pull Request Process

1. Fork the repo and create a feature branch
2. Make your changes with clear commit messages
3. Add tests if applicable
4. Ensure all existing tests pass
5. Submit a PR with a description of what and why

## Skill Contributions

If you want to improve or add Claude Code skills:

- Test the skill with Claude Code on a real project
- Include before/after examples in your PR
- Ensure the skill reads and respects the constitution
- Follow the existing skill structure and naming

## Code of Conduct

Be kind, be constructive, be respectful. We're building tools to make development better — let's make the community better too.
