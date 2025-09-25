# Solana Token Creator

## Overview

This is a Solana SPL token creation platform that allows users to create custom SPL tokens with metadata on both Devnet and Mainnet. The application features a modern dark-themed crypto aesthetic inspired by DeFi platforms like Uniswap and Jupiter Exchange. Users can connect their Solana wallets, configure token parameters including supply, decimals, and metadata, and mint tokens directly on the Solana blockchain.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The frontend is built using React 18 with TypeScript and Vite as the build tool. The application uses a modern component-based architecture with:

- **Routing**: Wouter for lightweight client-side routing
- **State Management**: React Query (TanStack Query) for server state and API data fetching
- **UI Framework**: Shadcn/ui components built on Radix UI primitives for accessible, customizable components
- **Styling**: Tailwind CSS with custom design system focused on crypto/DeFi aesthetics
- **Forms**: React Hook Form with Zod validation for type-safe form handling

The design system implements a dark-first approach with custom color tokens, gradients, and visual effects like glowing borders and frosted glass elements to create a futuristic crypto platform feel.

### Backend Architecture
The backend follows a lightweight Express.js architecture with:

- **Server Framework**: Express.js with TypeScript support
- **Development Setup**: Hot reloading with Vite middleware in development mode
- **Storage Interface**: Abstracted storage layer with in-memory implementation for development
- **API Structure**: RESTful endpoints with `/api` prefix routing

The backend is structured to be easily extensible, with a clean separation between routing, storage, and business logic.

### Data Storage Solutions
The application uses a dual storage approach:

- **Database ORM**: Drizzle ORM configured for PostgreSQL with type-safe schema definitions
- **Development Storage**: In-memory storage implementation for rapid development and testing
- **Production Database**: Configured for Neon Database (serverless PostgreSQL)

Database migrations are managed through Drizzle Kit, and the schema includes user authentication structures that can be extended for token creation tracking.

### Authentication and Authorization
Basic user authentication structure is implemented with:

- **User Schema**: Username/password based authentication ready for extension
- **Session Management**: Prepared for session-based authentication
- **Wallet Integration**: Frontend components ready for Solana wallet connectivity (Phantom, Solflare, Backpack)

### Design System and Components
The UI system implements a comprehensive component library with:

- **Form Components**: Advanced token creation forms with conditional sections
- **Wallet Integration**: Wallet connection buttons with multi-wallet support
- **Network Selection**: Devnet/Mainnet switching functionality
- **File Upload**: Image upload for token logos with validation
- **Result Display**: Success states with transaction details and explorer links

## External Dependencies

### Core Framework Dependencies
- **React Ecosystem**: React 18, React DOM, React Query for state management
- **Build Tools**: Vite for development and bundling, TypeScript for type safety
- **Routing**: Wouter for lightweight client-side navigation

### UI and Styling
- **Component Library**: Radix UI primitives for accessible base components
- **Styling Framework**: Tailwind CSS with PostCSS processing
- **Form Handling**: React Hook Form with Hookform Resolvers for validation integration
- **Validation**: Zod for runtime type validation and schema definition
- **Utility Libraries**: clsx and class-variance-authority for conditional styling, date-fns for date manipulation

### Database and Backend
- **ORM**: Drizzle ORM with Drizzle Zod for type-safe database operations
- **Database**: Neon Database (serverless PostgreSQL) for production
- **Session Store**: connect-pg-simple for PostgreSQL session storage
- **Development**: tsx for TypeScript execution, esbuild for server bundling

### Solana Integration (Prepared)
The application is structured to integrate with Solana blockchain through:
- Wallet adapter libraries (to be added for production)
- SPL Token program interaction
- Metadata program for token metadata
- Web3.js or similar for blockchain interaction

### Development Tools
- **Code Quality**: TypeScript for type checking, ESLint configuration ready
- **Asset Handling**: Vite plugins for static assets and development features
- **Replit Integration**: Cartographer plugin and runtime error overlay for Replit environment