# Blackjack Royal

## Overview

Blackjack Royal is a full-stack web-based Blackjack card game with user accounts, betting mechanics, game statistics tracking, and achievements. The application features a casino-themed UI with sound effects, animations, and a chip-based betting system. Players can create accounts, play Blackjack against a dealer, track their game history, and earn achievements based on their performance.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight client-side routing)
- **State Management**: TanStack React Query for server state, React Context for auth state
- **Styling**: Tailwind CSS with shadcn/ui component library (New York style variant)
- **Animations**: Framer Motion for card animations and UI transitions
- **Build Tool**: Vite with custom plugins for Replit integration

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **API Design**: RESTful endpoints defined in `shared/routes.ts` with Zod validation schemas
- **Database ORM**: Drizzle ORM with PostgreSQL dialect
- **File Uploads**: Multer for avatar image uploads stored in `uploads/avatars`

### Data Storage
- **Database**: PostgreSQL (requires DATABASE_URL environment variable)
- **Schema Location**: `shared/schema.ts` defines two tables:
  - `users`: id, username, balance, avatarUrl, createdAt
  - `gameResults`: id, userId, result, playerScore, dealerScore, betAmount, createdAt
- **Migrations**: Drizzle Kit with output to `./migrations`

### Authentication
- Simple username-based authentication without passwords
- User ID stored in localStorage (`blackjack-user-id`)
- Auth context provides login, signup, logout, and user state management
- No session-based auth implemented (stateless user identification)

### Game Engine
- Client-side Blackjack logic in `client/src/lib/blackjack-engine.ts`
- Handles deck creation, shuffling, score calculation, and game state
- Game results saved to server for statistics tracking

### Key Design Patterns
- **Shared Types**: Schema and route definitions in `shared/` directory used by both client and server
- **Type-Safe API**: Zod schemas validate both request inputs and response shapes
- **Component Library**: Extensive use of Radix UI primitives wrapped with Tailwind styling
- **Sound Management**: Singleton SoundManager class for audio playback control

## External Dependencies

### Database
- PostgreSQL database (connection via DATABASE_URL environment variable)
- Drizzle ORM for database operations
- connect-pg-simple for potential session storage

### UI Components
- Radix UI primitives (dialog, dropdown, tabs, etc.)
- shadcn/ui component patterns
- Lucide React for icons

### Audio/Visual
- canvas-confetti for celebration effects
- Custom sound effects and music tracks stored in attached_assets

### Build & Development
- Vite for frontend bundling
- esbuild for server bundling (production)
- TypeScript for type checking across the stack

### Third-Party Integrations
- Google Fonts (DM Sans, Space Grotesk, JetBrains Mono)
- Replit-specific Vite plugins for development environment