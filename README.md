# Fintrack Web

A personal finance tracking web app built with React 19, TypeScript, Vite, Zustand, TanStack Query, ShadCN and Tailwind CSS. Features JWT authentication with refresh token rotation, full CRUD for financial data, dark mode, and a responsive layout.

[![Tests](https://img.shields.io/badge/tests-63%20passing-brightgreen)](#testing)
[![Coverage](https://img.shields.io/badge/coverage-99.35%25-brightgreen)](#testing)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF)](https://vite.dev/)

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Scripts](#scripts)
- [Features](#features)
- [Docker](#docker)
- [Testing](#testing)

---

## Overview

Fintrack Web is the frontend for the Fintrack personal finance platform. It connects to [fintrack-api](https://github.com/W1lson17/fintrack-api) to provide a full-featured finance tracking experience.

**Key features:**

- JWT access token (15m) + refresh token rotation (7d)
- Password reset flow via email
- Dashboard with monthly income/expense summary and category spending chart
- Full CRUD for categories, transactions and saving goals
- Server-side pagination and filtering on all list views
- User profile management — update name, change password, delete account
- Dark mode support
- Responsive layout — sidebar on desktop, drawer on mobile

---

## Tech Stack

| Technology      | Version | Purpose                 |
| --------------- | ------- | ----------------------- |
| React           | 19      | UI Framework            |
| TypeScript      | 5.9     | Language                |
| Vite            | 8       | Build Tool              |
| Zustand         | 5       | Global State Management |
| TanStack Query  | 5       | Server State + Caching  |
| TanStack Table  | 8       | Headless Table          |
| React Router    | 7       | Client-side Routing     |
| React Hook Form | 7       | Form Management         |
| Zod             | 4       | Schema Validation       |
| ShadCN          | —       | UI Component Library    |
| Tailwind CSS    | 4       | Styling                 |
| Framer Motion   | 12      | Animations              |
| axios           | —       | HTTP Client             |
| sonner          | —       | Toast Notifications     |
| next-themes     | —       | Dark Mode               |
| date-fns        | —       | Date Utilities          |
| Vitest          | 4       | Testing                 |
| pnpm            | —       | Package Manager         |

---

## Architecture

The project follows a **feature-based architecture** — each feature is self-contained with its own components, hooks, services, schemas and types.

```
src/
├── app/                # Entry point, router and global providers
├── components/ui/      # ShadCN base UI components
├── features/           # Feature modules
│   ├── auth/           # Login, register, forgot/reset password
│   ├── categories/     # Category management
│   ├── dashboard/      # Monthly summary and spending charts
│   ├── profile/        # User profile management
│   ├── saving-goals/   # Saving goal tracking
│   └── transactions/   # Transaction management
└── shared/             # Reusable across features
    ├── components/     # DataTable, ErrorBoundary, PageLoader, etc.
    ├── constants/      # Routes, transaction types
    ├── hooks/          # useDebounce, usePageTitle
    ├── layouts/        # AppLayout, AuthLayout
    ├── pages/          # NotFoundPage
    ├── services/       # Centralized axios instance with interceptors
    ├── types/          # Shared TypeScript interfaces
    └── utils/          # Error handling, formatters
```

Each feature follows the same internal structure:

```
features/<name>/
├── components/   # UI components
├── hooks/        # TanStack Query hooks
├── pages/        # Route-level page components
├── schemas/      # Zod validation schemas
├── services/     # API calls via axios
└── types/        # TypeScript interfaces
```

---

## Getting Started

### Prerequisites

- Node.js 24+
- pnpm
- [fintrack-api](https://github.com/W1lson17/fintrack-api) running locally

### 1. Clone and install dependencies

```bash
git clone https://github.com/W1lson17/fintrack-web
cd fintrack-web
pnpm install
```

### 2. Set up environment variables

```bash
cp .env.example .env
```

Fill in the required values. See [Environment Variables](#environment-variables) for details.

### 3. Start the development server

```bash
pnpm dev
```

The app will be available at `http://localhost:5173`.

---

## Environment Variables

### `.env` (development)

| Variable       | Description                           | Example                     |
| -------------- | ------------------------------------- | --------------------------- |
| `VITE_API_URL` | Base URL of the fintrack-api instance | `http://localhost:3001/api` |

### `.env.production`

| Variable       | Description                           | Example                           |
| -------------- | ------------------------------------- | --------------------------------- |
| `VITE_API_URL` | Base URL of the fintrack-api instance | `https://your-api-domain.com/api` |

> Use `.env.example` and `.env.production.example` as templates.

---

## Scripts

| Script                  | Description                                 |
| ----------------------- | ------------------------------------------- |
| `pnpm dev`              | Start development server with HMR           |
| `pnpm build`            | Type-check and build for production         |
| `pnpm preview`          | Preview the production build locally        |
| `pnpm lint`             | Run ESLint                                  |
| `pnpm test`             | Run all tests                               |
| `pnpm test:watch`       | Run tests in watch mode                     |
| `pnpm test:coverage`    | Run tests with coverage report              |
| `pnpm docker:prod`      | Build and start production Docker container |
| `pnpm docker:prod:down` | Stop production Docker container            |

---

## Features

### Authentication

- Register, login and logout
- JWT access token (15m) with automatic refresh via interceptors
- Refresh token rotation — single-use, 7 day expiry
- Forgot password — sends reset link via email
- Reset password — single-use token, 1 hour expiry
- Route guards — GuestGuard for public routes, AuthGuard for protected routes

### Dashboard

- Monthly income/expense summary with balance calculation
- Category spending breakdown chart
- Month picker to navigate between periods

### Transactions

- Paginated table with server-side filtering by type and category
- Create and delete transactions
- Collapsible filter panel with active filter count badge

### Categories

- Paginated table with create and delete actions
- Category types: INCOME | EXPENSE

### Saving Goals

- Paginated card grid
- Create goals with name, target amount and optional deadline
- Update progress — validates amount does not exceed target
- Progress bar showing current vs target amount

### Profile

- View profile — name and email
- Update name
- Change password with current password verification
- Delete account with password confirmation — invalidates all sessions

---

## Docker

Production deployment uses a multi-stage Docker build — Node.js compiles the Vite app, Nginx serves the static output.

```bash
cp .env.production.example .env.production
# Fill in production values
pnpm docker:prod
```

The app will be available at `http://localhost`.

> `VITE_API_URL` is injected at build time — Vite variables are embedded during compilation, not at runtime.

> Make sure `http://localhost` is included in `ALLOWED_ORIGINS` in fintrack-api when running via Docker.

---

## Testing

The project uses **Vitest** with **Testing Library** for unit tests.

```bash
# Run all tests
pnpm test

# Run with coverage report
pnpm test:coverage
```

### Coverage

| Layer             | Statements | Branches | Functions  | Lines      |
| ----------------- | ---------- | -------- | ---------- | ---------- |
| Auth hooks        | 100%       | 100%     | 100%       | 100%       |
| Profile hooks     | 100%       | 100%     | 100%       | 100%       |
| Category hooks    | 100%       | 100%     | 100%       | 100%       |
| Transaction hooks | 95%        | 100%     | 91.66%     | 95%        |
| Saving Goal hooks | 100%       | 100%     | 100%       | 100%       |
| Dashboard hooks   | 100%       | 100%     | 100%       | 100%       |
| Shared utils      | 100%       | 100%     | 100%       | 100%       |
| **Global**        | **99.35%** | **100%** | **98.79%** | **99.35%** |

Coverage thresholds are enforced — the test suite fails if any metric drops below 80%.
