# Architecture Decision Record (ADR)

This document records the architectural and engineering decisions made for the Quixta React Native application.

---

### 1. Framework & Runtime
* **Decision**: Expo (SDK 58), React Native (0.88), and TypeScript.
* **Rationale**: Stable, modern cross-platform foundation with strict TypeScript typing across all modules.

---

### 2. Navigation Architecture: Component-Based React Navigation + Deep Linking
* **Decision**: Use `@react-navigation/native` with `@react-navigation/native-stack`, configured with a centralized `RootStackParamList` and `linkingOptions`.
* **Rationale**:
  * **Compile-Time Type Safety**: Provides a single source of truth for screen parameter contracts (`navigation.navigate('BookingDetail', { id })`) and typed props on receiving screens (`NativeStackScreenProps`).
  * **Deep Linking**: Maps the root URL (`''`) to the Bookings List and `'bookings/:id'` to the Booking Detail screen, fully satisfying route specifications across mobile, deep links, and web.

---

### 3. Architecture: Pure Feature-Based (Vertical Slices) with Barrel Exports & `__tests__/`
* **Decision**: All business capabilities are organized into self-contained vertical feature slices under `src/features/`:
  * `src/features/bookings/`: Polymorphic API clients, fake server fixtures, hooks, components, types, list screen, and `__tests__/`.
  * `src/features/booking-detail/`: Detail presentation and `BookingMetaCard` metadata components.
  * `src/features/check-in/`: Check-in business logic (`canCheckIn`), `CheckInButton` component, and `__tests__/`.
  * `src/features/notes/`: On-device storage repository (`INotesRepository`), validation logic, note input components, and `__tests__/`.
  * `src/shared/`: Cross-cutting concerns including design tokens, `useTheme` hook, safe area layout, feedback states, date/time formatting, and `__tests__/`.
* **Rationale**: High cohesion, loose coupling, and clean domain boundaries. Source folders contain only production code while tests are contained cleanly in feature-level `__tests__/` directories.

---

### 4. State & Networking: Polymorphic API Client (`IBookingsApi`) with Factory + 4-Tier State
* **Polymorphic API Client (`IBookingsApi`)**:
  * Instead of 4 redundant layers (React Query $\rightarrow$ Repository $\rightarrow$ Service $\rightarrow$ Axios), we use a single clean API layer:
    * `RemoteBookingsApi`: Uses Axios with request/response interceptors to query the real backend and filter corrupted rows (`isValidBooking`).
    * `FakeBookingsApi`: Reads `EXPO_PUBLIC_BOOKINGS` mock fixtures and filters corrupted rows.
  * **Factory Function (`createBookingsApi`)**: The **single place** in the codebase that evaluates `process.env.EXPO_PUBLIC_API_URL`. The rest of the app imports `bookingsApi` with zero conditional branching.
* **Axios Engine & Interceptors (`axios-client.ts`)**:
  * Centralized factory (`createApiClient`) and singleton (`apiClient`).
  * Request interceptor injects standard headers (`Accept: application/json`).
  * Response interceptor transforms status errors into `Request failed: HTTP ${status}`.
* **Tier 1 — Server State (`@tanstack/react-query`)**:
  * Consumes `bookingsApi.getBookings()`. Manages caching, cache invalidation, pull-to-refresh (`isRefetching`), error retry (`refetch`), and the `Updated <time>` timestamp (`dataUpdatedAt`).
* **Tier 2 — Global Client State (`zustand`)**:
  * Manages cross-screen UI state: persistent search query across navigation transitions.
* **Tier 3 — Persistent On-Device Storage (`AsyncStorage` + Repository Pattern)**:
  * Implements `INotesRepository` using `@react-native-async-storage/async-storage` keyed by `@booking_note_${bookingId}`.
* **Tier 4 — Ephemeral Component State (React `useState`)**:
  * Kept strictly local for live text input typing before submission (draft note, validation error messages).

---

### 5. UI, Design Language & Theming: "Architectural Slate" (System Appearance)
* **Decision**: Selected the **"Architectural Slate"** design language with comprehensive light and dark token palettes in `src/shared/theme/`.
* **Aesthetic**: Minimalist, quiet luxury, crisp hairline borders (`1px`), uppercase metadata tags, and high-contrast typography.
* **System Appearance**: Theme automatically adapts to the device's system appearance (`useColorScheme()`) via the `useTheme()` hook.
* **Zero Magic Numbers**: All component styling uses design tokens via the `useTheme()` hook.
* **Colors**:
  * **Light**: Alabaster canvas (`#FAFAF9`), pure white cards (`#FFFFFF`), carbon ink text (`#1C1917`), hairline stone borders (`#E7E5E4`), and deep cobalt accents (`#1D4ED8`).
  * **Dark**: Deep stone canvas (`#0C0A09`), elevated stone cards (`#1C1917`), soft white text (`#F5F5F4`), muted borders (`#292524`), and electric cobalt accents (`#3B82F6`).

---

### 6. Automated Testing: Headless Jest in `__tests__/`
* **Decision**: Automated unit test suite running headlessly via `yarn test` without simulator or device dependencies, structured into feature-level `__tests__/` directories.
* **Coverage**:
  1. `canCheckIn(now, startsAt)`: Verifies exact time boundaries (16 minutes before, 15 minutes before, at start, after start, invalid date handling).
  2. `IBookingsApi` (`RemoteBookingsApi`, `FakeBookingsApi`, `createBookingsApi`): Verifies real Axios integration, mock fixture modes, row sanitization (skipping broken rows), and interceptor header/error handling.
  3. `INotesRepository` (`AsyncStorageNotesRepository`): Verifies saving, retrieving, and clearing persisted notes.
  4. `date.ts`: Verifies IANA timezone formatting for all fixture locations.
