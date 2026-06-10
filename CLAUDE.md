# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Walnut Admin is a Vue 3 admin template using TypeScript, Vite, Naive UI, and UnoCSS. It requires a NestJS backend (walnut-admin-server) with MongoDB.

- Demo: https://www.walnut-admin.com
- Docs: https://walnut-admin-doc.netlify.app

## Development Commands

```bash
# Install dependencies (pnpm required)
pnpm install

# Development server (runs predev script to generate paths/schemas)
pnpm dev

# Build for production (runs prebuild script)
pnpm build

# Build for staging
pnpm build:stage

# Preview production build
pnpm preview

# Lint
pnpm lint

# Lint with auto-fix
pnpm lint:fix

# Type checking
pnpm types:check
```

## Environment Configuration

Environment files are in `env-local/` directory (not `env/`):
- `.env.development` - Development config
- `.env.staging` - Staging config
- `.env.production` - Production config

Default dev server: http://127.0.0.1:3100

Proxy configuration in VITE_PROXY:
- `/api` → backend at http://127.0.0.1:3000/w/v1
- `/socket` → WebSocket connections

## Architecture

### Directory Structure

- `src/App/` - Root app component, theme providers, Naive UI setup, hooks
- `src/api/` - API client layer organized by domain (auth, system, security, shared)
- `src/components/` - Reusable components:
  - `Advanced/` - Complex components (CRUD, ApiSelect, RoleSelect)
  - `App/` - App-level components (DarkMode, LocalePicker, Lock, etc.)
  - `Business/` - Domain-specific components
  - `Global/` - Global modal/dialog components
  - `UI/` - Basic UI components
  - `HOC/` - Higher-order components
  - `Vendor/` - Third-party integrations
- `src/router/` - Vue Router with guards and route definitions
- `src/store/` - Pinia stores in `modules/` (app, user, setting, component)
- `src/views/` - Page components (auth, system, features, demo, etc.)
- `src/layout/` - Layout components
- `src/hooks/` - Composables
- `src/utils/` - Utility functions
- `src/locales/` - i18n translations
- `src/plugins/` - Vue plugins
- `src/const/` - Constants
- `src/core/` - Core functionality
- `build/` - Build scripts and Vite configuration
- `build/generate/` - Code generation scripts (paths, JSON schemas)

### Key Technologies

- **Vue 3** with Composition API and `<script setup>`
- **TypeScript** with strict mode
- **Naive UI** for component library
- **UnoCSS** for utility-first CSS (Tailwind-compatible with custom theme)
- **Pinia** for state management
- **Vue Router** for routing
- **Vue I18n** for internationalization
- **Axios** for HTTP requests
- **Vite** for build tooling

### Path Aliases

- `@/*` → `src/*`
- `~/*` → `types/*`

### Auto-imports

The project uses `unplugin-auto-import` and `unplugin-vue-components` for automatic imports of Vue APIs, composables, and components.

### Pre-build Generation

Before dev/build, scripts generate:
- Path constants from routes
- JSON schemas for type validation

### State Management

Pinia stores are modular in `src/store/modules/`:
- `app` - App-level state
- `user` - User authentication and profile
- `setting` - User preferences and backend settings
- `component` - Component-specific state

### Routing

Router uses:
- Web history mode
- Built-in routes in `src/router/routes/builtin`
- Route guards in `src/router/guard`
- Custom query string parsing

### Styling

- UnoCSS with Wind preset (Tailwind v3 compatible)
- Custom theme extends Naive UI CSS variables
- SCSS in `src/assets/styles/`
- Dark mode via class strategy
- Custom shortcuts: `hstack`, `vstack`

### Security Features

The codebase includes advanced security:
- OPAQUE protocol for password authentication
- WebAuthn/FIDO2 support
- MFA/OTP
- RSA encryption
- Signature verification
- Device fingerprinting

### Build Configuration

Build outputs to directory specified in `VITE_BUILD_OUT_DIR` env var.

Optional build features (via env vars):
- Code obfuscation
- Console dropping
- Compression
- Bundle analysis
- CDN externalization
- Sentry integration
- CSP (Content Security Policy)
- PWA support

### Git Hooks

- Pre-commit: Runs `pnpm lint-staged` (ESLint auto-fix on staged files)
- Commit-msg: Validates commit messages with commitlint (conventional commits)

## Notes

- Node.js >=20.0.0 required
- pnpm >=8.0.0 required (enforced by preinstall script)
- Backend server must be running for full functionality
- The project uses ESM modules (`"type": "module"`)
