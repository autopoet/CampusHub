# CampusHub Technical Architecture & UI/UX Upgrade Overview

## 1. Core Objectives

- **Data Standardization**: Unified the data model for `recruit` (team recruitments) and `share` (knowledge sharing) types to ensure consistency across lists and detail pages.
- **Responsive-First Design**: Implemented a modern, mobile-friendly navigation system compatible with both large desktop screens and small mobile devices.
- **Premium Aesthetics**: Adopted high-end design principles including Glassmorphism, Google Fonts (Inter), and subtle micro-animations to create a state-of-the-art user experience.
- **Decoupled Architecture**: Strictly separated the Mock Data Layer, State Management (Pinia), and UI Components for easy future transitions to real backends.

## 2. Data & API Layer (`src/mock/`, `src/api/`)

### 2.1 Standardized Mock Data

- **`shares.json`**: Replaced the fragmented `posts.json`. Contains 10+ high-quality knowledge sharing records.
- **`recruit.json`**: Contains 12+ team recruitment posts with structured competition metadata and skill requirements.
- **Unified Schema**: Both types now include consistent fields such as `author`, `avatar` (image URLs), `updatedTime`, `tags`, and `status`.

### 2.2 Mock Service Engine (`src/api/mockService.js`)

- **Generic Loader**: `fetchMockData` supports dynamic imports, pagination calculation, and server-side filtering simulation.
- **Closure Filtering**: Supports passing custom predicate functions for complex real-time search logic (e.g., keyword + multiple tags + competition).

## 3. State Management (`src/stores/mockStore.js`)

- **Global Data Store**: Centralized management of `shares`, `recruitments`, `notifications`, and `comments`.
- **Infinite Scroll Support**: The `_load` action handles data appending, loading flags, and pagination tracking automatically.
- **Clean State Transitions**: Integrated `$reset` patterns for logout scenarios to clear sensitive session data.

## 4. UI/UX & Component Architecture

### 4.1 Responsive Navigation (`LayoutHeader.vue` & `HeaderUserInfo.vue`)

- **PC Mode**: Horizontal layout with a sticky blurred background (`backdrop-filter`). Integrated `LayoutMenu` and `HeaderUserInfo` with rich popover panels.
- **Dropdown Optimization**: Standardized the styling for "Notifications" and "My Teams" dropdowns with precise `right: 0` alignment.
- **Click Actions**: Icons and labels are now clickable, navigating directly to dedicated management pages.
- **Mobile Mode**: Hamburger menu triggers a **Teleport-based Drawer**.
- **Branding**: Unified the logo to use the project's `favicon.svg` across all header versions.

### 4.2 Real-time Filtering (`FilterBar.vue`)

- A premium, reusable filter component featuring:
  - **Debounced Search** for keywords.
  - **Multi-select Tags** for skills.
  - **Dropdown Selection** for competitions and recruitment status.
- UI features glassmorphism panels and responsive layout switching.

### 4.3 Detail Page & Profile Overhaul

- **Dynamic Routing**: Uses route parameters (`type`, `id`) to fetch targeted data from the specific store action.
- **Recruit Action Card**: Enhanced the "Apply to Join" component with better visual layering (Gradient + Shadows) and clearer typography.
- **UserProfile Refactoring**:
  - Replaced legacy tabs with **"My Recruitments"** and **"My Shares"**.
  - Implemented a clean **Title-List Mode** for easy content management.
  - Automatic data filtering based on the current user identity.

### 4.4 New Management Views

- **NotificationsView.vue**: A dedicated center for reading and managing all system notifications.
- **MyTeamsView.vue**: A streamlined dashboard to track recruitment status and project participation.

## 5. Visual Excellence & Design System (`index.css`)

- **Typography**: Integrated **Google Font: Inter** for modern, readable text across the application.
- **Color Palettes**: Defined RGB-based CSS variables to support precise alpha-channel blurs for glass effects.
- **Animations**:
  - `slideUp`: Entrance animation for list cards.
  - `drawer-fade`: Smooth transition for the mobile menu.
  - Interactive hover states and click ripple effects on all primary actions.

## 6. Implementation Checklist (Current Status)

- [x] Rename `posts.json` to `shares.json` and update structures.
- [x] Fix `PostDetail` dynamic loading bug.
- [x] Implement responsive `LayoutHeader` with mobile Drawer.
- [x] Create and integrate `FilterBar` in all list views.
- [x] Standardize `FeedCard` to support avatar images and metadata.
- [x] Sync header heights and fix global CSS compatibility (line-clamp).
- [x] Update logo to project `favicon.svg`.
- [x] Optimize Header dropdown styles and click logic.
- [x] Refactor User Profile tabs and content list mode.

---

*Updated: 2026-04-06*
*Document Location: `/DESIGN_OVERVIEW.md`*
