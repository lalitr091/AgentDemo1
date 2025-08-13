# Overview

This is a production-quality frontend-only web application called "Initializ Agent Mesh — First-Action Worker (GreyOrange)" built with React, Vite, TypeScript, and Tailwind CSS. The application simulates a three-agent collaborative AI system that handles automated Zendesk-to-Jira workflows with governance, evidence tracking, and replay capabilities. The system showcases enterprise-grade AI automation for customer support operations at GreyOrange.

The application features three specialized agents (TriageAgent, LogAnalyzerAgent, and SpareAgent) that work together to classify support tickets, analyze logs, and manage spare parts inventory. It includes role-based access control with three user types (Engineer, Head, Executive), comprehensive audit trails, and real-time chat support.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
The application follows a modern React architecture using functional components with hooks for state management. The codebase is organized into a monorepo structure with shared TypeScript types and schemas. Key architectural decisions include:

- **Component Structure**: Uses a component-based architecture with reusable UI components built on Radix UI primitives and styled with Tailwind CSS
- **State Management**: Implements Zustand for global state management across authentication, chat, and ticket management
- **Routing**: Uses Wouter for client-side routing with role-based route protection
- **Styling**: Leverages Tailwind CSS with a custom design system including dark mode support and CSS variables for theming

## Mock Data Layer
Since this is a frontend-only application, it uses MirageJS to simulate backend services:

- **API Simulation**: MirageJS provides deterministic mock data with seeded fixtures for tickets, users, and system data
- **Data Persistence**: Uses localStorage for client-side persistence of user sessions and application state
- **Mock Services**: Simulates external integrations with Zendesk, Jira, and inventory systems

## Authentication & Authorization
Implements a role-based access control system with three distinct user roles:

- **Support Engineer**: Full access to work queue and evidence packs, read-only policy access
- **Support Head**: Operations dashboard, approval workflows, and policy configuration (except strict mode)
- **C-Level Executive**: ROI analytics, strict mode toggle, and read-only access to other areas

Route guards ensure users can only access features appropriate to their role, with automatic redirection to role-appropriate dashboards.

## Agent System Architecture
The core feature is a three-agent collaboration system:

- **TriageAgent**: Handles ticket classification, routing (hardware vs software), similarity matching, and Jira issue creation
- **LogAnalyzerAgent**: Processes log files for hardware issues, extracts error signals, and updates Jira with findings
- **SpareAgent**: Manages inventory checks, part reservations, and handoff coordination

All agent interactions are tracked through a mesh console that logs messages, tool invocations, and handoffs between agents.

## Evidence & Audit System
Every automated operation generates tamper-evident audit trails:

- **Evidence Packs**: JSON downloads with mock SHA-256 signatures for compliance
- **OpenTelemetry-style Timelines**: Detailed traces of agent interactions and tool calls
- **Agentfile Configuration**: YAML-based agent definitions and policies with copy-to-clipboard functionality

## User Interface Design
The application uses a sophisticated dark-mode interface optimized for enterprise use:

- **Keyboard Navigation**: Comprehensive keyboard shortcuts (/, ⌘K, ?, G, E) for power users
- **Accessibility**: Built with ARIA labels and semantic HTML for screen reader compatibility
- **Responsive Design**: Mobile-first approach with breakpoint-based layouts
- **Micro-animations**: Framer Motion for subtle UI feedback and state transitions

# External Dependencies

## Core Framework Dependencies
- **React 18**: Modern React with concurrent features and hooks
- **Vite**: Fast build tool and development server with hot module replacement
- **TypeScript**: Type safety and enhanced developer experience
- **Tailwind CSS**: Utility-first CSS framework with custom design tokens

## UI Component Libraries
- **Radix UI**: Headless, accessible UI primitives for complex components
- **Lucide React**: Consistent icon library for UI elements
- **Framer Motion**: Animation library for micro-interactions and page transitions

## State Management & Data Fetching
- **Zustand**: Lightweight state management with persistence middleware
- **TanStack React Query**: Server state management and caching (used with MirageJS)
- **React Hook Form**: Form state management with validation

## Development & Simulation
- **MirageJS**: API mocking and simulation for frontend-only development
- **Drizzle ORM**: Type-safe database schema definitions (configured for potential PostgreSQL integration)
- **Neon Database**: Serverless PostgreSQL provider (configured but not actively used in frontend-only mode)

## Build & Development Tools
- **ESBuild**: Fast JavaScript bundler for production builds
- **PostCSS**: CSS processing with Tailwind CSS integration
- **TSX**: TypeScript execution for development server
- **Replit Plugins**: Development environment integration for Replit hosting

## Database Configuration
While currently frontend-only, the application is configured for PostgreSQL integration:

- **Database Provider**: Neon Database (serverless PostgreSQL)
- **ORM**: Drizzle ORM with type-safe schema definitions
- **Migrations**: Configured migration system for future backend integration
- **Connection**: Environment-based database URL configuration

The database configuration allows for easy transition to a full-stack application when backend services are required.