# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

BoxHero Desktop is an Electron app for inventory management. It wraps the BoxHero web app (https://app.boxhero.io) with native features like auto-updates, custom title bar, and system integration.

## Commands

```bash
npm install          # Install dependencies
npm run start        # Start development server
npm run package      # Create app bundle (no installer)
npm run make         # Create installer
npm run publish-app  # Publish to GitHub Releases + R2
npm run lint         # Run ESLint
```

### Code Signing

- **Skip signing (dev):** Set `DEV_SKIP_SIGN=t` environment variable
- **Beta builds:** Set `DEV_USE_BETA_LANE=t` environment variable
- Copy `.env.example` to `.env` and configure required variables

## Architecture

### Process Model

```
Main Process (src/main.ts)
├── Window management (src/window.ts, src/windowState.ts)
├── Auto-updater (src/updater.ts)
├── App menu (src/menu.ts)
└── Initialization modules (src/initialize/*.ts)

Preload Script (src/preload.ts)
└── Exposes electronAPI to renderer via contextBridge

Renderer Process (src/renderers/main/)
├── React 19 app with custom title bar
├── styled-components for styling
└── i18next for localization
```

### IPC Communication

The preload script exposes `window.electronAPI` with these namespaces:

- `navigation` - Browser history (back, forward, reload)
- `window` - Window controls (minimize, maximize, close)
- `loading` - Loading state synchronization
- `app` - Menu, external links, locale

IPC handlers are registered in `src/initialize/` modules:

- `initWindowIPC.ts` - Window control handlers
- `initNavigationIPC.ts` - Navigation handlers
- `initAppIPC.ts` - App-level handlers
- `initGoogleAuth.ts` - Google OAuth flow
- `initDesktopAuth.ts` - Desktop auth via custom protocol
- `initLocale.ts` - System locale detection
- `initMenu.ts` - Application menu setup
- `initUpdater.ts` - Auto-update configuration

### Custom Protocol

The app registers `boxhero://` as a custom protocol for handling desktop authentication callbacks (e.g., `boxhero://desktop-login?token=...`).

### Window Management

`WindowManager` class tracks open windows by type. `BoxHeroWindow` is the main window implementation with:

- Persistent window state (bounds, maximized state)
- Debounced state saving
- Bounds validation for multi-monitor setups

### Localization

Dual i18next setup - separate instances for main process and renderer:

- Main: `src/locales/`
- Renderer: `src/renderers/main/locales/`
- Languages: Korean (ko), English (en)

## Build Configuration

- **Build tool:** Electron Forge 7.x with Vite plugin
- **Vite configs:** `vite.main.config.ts`, `vite.preload.config.ts`, `vite.renderer-main.config.ts`
- **Forge config:** `forge.config.ts`

### Platform-Specific

- **macOS:** Developer ID signing + notarization via App Store Connect API
- **Windows:** Azure Trusted Signing (EV certificate alternative)
- **Distribution:** GitHub Releases + Cloudflare R2

## Tech Stack

- Electron 39, React 19, TypeScript 5.9
- Vite 6.4, styled-components 6.1
- ESLint 9 (flat config), Prettier, Husky + lint-staged
