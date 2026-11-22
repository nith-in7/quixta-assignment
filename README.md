# Quixta — Mobile Bookings Application

A modern React Native mobile application built for Quixta using Expo and TypeScript. The app enables users to view scheduled appointments, search in real time, view local appointment times across IANA timezones, evaluate 15-minute check-in eligibility, and save persistent notes that survive app restarts and navigation transitions.

---

## 1. Prerequisites & Installation

* **Node.js**: v18+ (tested on v24.18.0)
* **Yarn**: v1.22+

```bash
# Install dependencies
yarn install
```

---

## 2. How to Run

### Development Server
```bash
# Start Expo development server (interactive terminal for Web, iOS, Android)
yarn start

# Or launch directly into a target platform:
yarn web      # Browser
yarn ios      # iOS Simulator
yarn android  # Android Emulator
```

### Running Automated Tests
All 38 unit tests run headlessly in Node without needing an emulator or device:
```bash
yarn test
```

### Testing Fake Server States
The fake server behavior can be tested by passing the `EXPO_PUBLIC_BOOKINGS` environment variable:
```bash
# Default (3 valid bookings, malformed row safely skipped)
yarn start

# Empty state ("No bookings")
EXPO_PUBLIC_BOOKINGS=empty yarn start

# Error state ("Could not load bookings" + "Try again" retry button)
EXPO_PUBLIC_BOOKINGS=error yarn start
```

---

## 3. Project Structure

The project follows a **Feature-Based Architecture (Vertical Slices)** where all domain logic, components, screens, and tests are co-located within feature directories:

```text
src/
├── features/
│   ├── bookings/            # Bookings list, search, real/fake API clients, query hooks
│   │   ├── api/             # Axios client, IBookingsApi, fake server fixtures
│   │   ├── components/      # BookingCard, SearchBar, Feedback states, Timestamp
│   │   ├── hooks/           # useBookingsQuery (TanStack Query)
│   │   ├── screens/         # BookingsListScreen
│   │   ├── types/           # Booking model & isValidBooking type guard
│   │   └── __tests__/       # API integration, row sanitization, interceptor tests
│   │
│   ├── booking-detail/      # Booking metadata presentation & detail screen
│   │   ├── components/      # BookingMetaCard
│   │   └── screens/         # BookingDetailScreen
│   │
│   ├── check-in/            # Check-in eligibility logic & button
│   │   ├── components/      # CheckInButton (with live 15s ticker)
│   │   ├── lib/             # canCheckIn pure domain function
│   │   └── __tests__/       # Time boundary tests (16m, 15m, start, post-start)
│   │
│   └── notes/               # On-device note persistence
│       ├── components/      # NoteSection (140-char validation, char counter)
│       ├── repository/      # INotesRepository & AsyncStorage implementation
│       └── __tests__/       # Storage repository unit tests
│
├── navigation/              # Centralized RootStackParamList & deep linking
└── shared/                  # Design tokens, useTheme, SafeScreen, date utilities, __tests__/
```

---

## 4. Deviations from the Assignment Brief & Key Differences

While remaining 100% compliant with the functional requirements and verbatim strings, the implementation deviates from some suggestions in the brief to establish enterprise-grade architecture:

### 1. Component-Based React Navigation vs. File-Based Routing (Expo Router)
* **Brief Suggestion**: File-based routing conventions (`/` and `/bookings/[id]`).
* **Our Implementation**: Pure `@react-navigation/native-stack` with a centralized `RootStackParamList` and deep linking configuration (`linking.ts`).
* **Why We Deviated**: File-based routing passes parameters as weakly typed URL strings. A centralized `RootStackParamList` provides strict, compile-time autocomplete for screen names and enforces exact parameter types (`navigation.navigate('BookingDetail', { id })`), eliminating silent runtime typos while still mapping `''` and `'bookings/:id'` for deep links and web.

### 2. Polymorphic API Client & Factory vs. Raw `fetch(fetchFn = fetch)`
* **Brief Suggestion**: `fetchBookings(fetchFn = fetch)` passing a raw fetch function.
* **Our Implementation**: Polymorphic `IBookingsApi` contract with two dedicated implementations (`RemoteBookingsApi` and `FakeBookingsApi`) instantiated via a single `createBookingsApi()` factory, powered by Axios with request and response interceptors.
* **Why We Deviated**: Real production code avoids dirty `if (isMock) ...` conditionals inside network methods. By using polymorphism, `RemoteBookingsApi` handles pure Axios HTTP requests and standard headers (`Accept: application/json`), while `FakeBookingsApi` handles mock fixtures. The factory is the single place that evaluates `EXPO_PUBLIC_API_URL`. A `fetchBookings()` helper is preserved for spec compatibility.

### 3. 4-Tier State Boundaries vs. Ad-Hoc Global State
* **Brief Suggestion**: Basic state and direct storage calls.
* **Our Implementation**:
  1. **Tier 1 (Server State)**: `@tanstack/react-query` exclusively handles caching, revalidation, pull-to-refresh (`isRefetching`), and the `Updated <time>` line (`dataUpdatedAt`).
  2. **Tier 2 (Global Client State)**: `zustand` exclusively preserves the search query across navigation transitions.
  3. **Tier 3 (Persistent Storage)**: `@react-native-async-storage/async-storage` wrapped in the **Repository Pattern** (`INotesRepository`), decoupling UI components from disk storage.
  4. **Tier 4 (Ephemeral Component State)**: React `useState` for live text typing, preventing global re-render thrashing.
* **Why We Deviated**: Clear state boundaries ensure separation of concerns and prevent leaky storage abstractions.

### 4. Design Tokens & System Appearance vs. Inline Styling
* **Brief Suggestion**: Basic styling.
* **Our Implementation**: Centralized "Architectural Slate" design tokens (`spacing`, `borderRadius`, `typography`, `colors`) with zero magic numbers and zero hardcoded hex colors in component StyleSheets. Includes automatic light and dark mode adaptation based on device system settings (`useColorScheme()`).
* **Why We Deviated**: Eliminates magic numbers, guarantees visual consistency, and ensures native look-and-feel across platforms.

### 5. Feature-Level `__tests__/` Organization
* **Brief Suggestion**: Two test cases.
* **Our Implementation**: 38 automated unit tests across 5 test suites organized inside feature-level `__tests__/` folders.
* **Why We Deviated**: Keeps source directories clean, prevents directory drift, and preserves high cohesion within feature slices.
