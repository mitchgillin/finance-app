# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Commands

- `npm run dev` - Start development server with Turbopack (opens at http://localhost:3000)
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Architecture Overview

This is a Next.js 15 financial calculator application using the App Router with TypeScript and Tailwind CSS.

### Core Structure
- **App Router**: Uses Next.js App Router with pages in `src/app/`
- **Global Layout**: `src/app/layout.tsx` provides navigation and footer for all pages
- **Settings Context**: Global settings stored in localStorage via `src/contexts/SettingsContext.tsx`
- **Reusable Components**: Located in `src/components/`

### Key Features
- **Compound Interest Calculator**: `/compound-interest`
- **Retirement Simulator**: `/retirement-simulator`  
- **Risk Profile Quiz**: `/risk-profile`
- **Settings Page**: `/settings` for customizing interest rate presets

### Settings System
The app uses a centralized settings context that:
- Manages interest rate presets (conservative: 4%, average: 7%, optimistic: 10%)
- Stores risk profile data from the assessment quiz
- Provides recommended rates based on user's risk profile
- Persists all settings to localStorage

### Component Patterns
- **NumericInput**: Custom input component supporting shorthand notation (2.5k, 15M, 1B)
- **InterestRateSelector**: Specialized component for rate selection with presets
- Components use TypeScript interfaces for props
- Tailwind CSS for styling with consistent color scheme (blue, green, purple accents)

### Tech Stack
- Next.js 15 with App Router
- React 19
- TypeScript 5
- Tailwind CSS 4
- Lucide React icons
- Yarn package manager

### Path Aliases
- `@/*` maps to `./src/*` for cleaner imports

## Development Best Practices

- Remember to keep all global context in our React Context provider