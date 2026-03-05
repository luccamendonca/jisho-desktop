# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## About

Jisho Desktop is a lightweight Electron wrapper around [jisho.org](https://jisho.org/) providing a native desktop experience for Japanese dictionary lookups. There is no frontend build step — the app loads jisho.org in a webview.

## Commands

```bash
npm install       # Install dependencies
npm start         # Run the app in development mode

npm run build       # Build for current platform (output: dist/)
npm run build:mac   # macOS: .dmg + .zip (x64 + arm64)
npm run build:win   # Windows: NSIS installer + .zip (x64 + arm64)
npm run build:linux # Linux: .AppImage + .deb + .tar.gz (x64 + arm64)
npm run release     # Build and publish to GitHub Releases (requires GITHUB_TOKEN)
```

There are no tests or linting configured.

## Architecture

Two files form the entire app:

- **`main.js`** — Electron main process. Creates the `BrowserWindow`, loads `https://jisho.org/`, handles platform-specific window chrome (hidden title bar on macOS, vibrancy), manages keyboard shortcuts, and enforces navigation rules (non-jisho.org links open in the system browser).

- **`preload.js`** — Injected into the renderer with context isolation. Adds UX enhancements: auto-focuses the search bar on load and after SPA navigation (via `MutationObserver`), binds `/` to focus the search bar, `Escape` to blur it. On macOS, injects CSS to account for the hidden title bar and make the drag region work correctly.

Security model: context isolation is on, node integration is off. The preload script only does DOM manipulation — no Node.js APIs are exposed to the renderer.

## CI/CD

Builds trigger on version tag pushes (e.g., `v1.0.5`). GitHub Actions builds for all four targets in parallel (macOS arm64, macOS x64, Windows, Linux) and publishes artifacts to GitHub Releases.

To release: bump the version in `package.json`, commit, tag, and push the tag.
