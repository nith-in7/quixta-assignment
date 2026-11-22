# Project Architecture & AI Agent Guardrails

This is an Expo / React Native mobile application for Quixta. All AI agents and developers must strictly follow the architectural boundaries, state tiers, and design system documented below and in `decisions.md`.

---

## 1. Architectural Guardrails (Non-Negotiable)

1. **Feature-Based Architecture**:
   All business logic, components, screens, hooks, and types must live strictly within their vertical feature slice under `src/features/`:
   - `src/features/bookings/`: API clients (`RemoteBookingsApi`, `FakeBookingsApi`, factory `createBookingsApi`), fake server fixtures, query hooks, list components, `BookingsListScreen.tsx`, and `__tests__/`.
   - `src/features/booking-detail/`: Metadata components (`BookingMetaCard`), check-in presentation, and `BookingDetailScreen.tsx`.
   - `src/features/check-in/`: Check-in domain logic (`canCheckIn`), `CheckInButton`, and `__tests__/`.
   - `src/features/notes/`: On-device storage repository (`INotesRepository`), validation rules (140-char limit), note form, and `__tests__/`.
   - `src/shared/`: Cross-cutting concerns (`theme`, `hooks`, `components`, `utils`, `__tests__/`).
   - `src/navigation/`: Root navigation contracts, `RootStackParamList`, and deep linking configuration.
   *Do NOT create arbitrary root folders or dump code outside these designated slices.*

2. **Navigation Contracts**:
   - Navigation uses pure **React Navigation** (`@react-navigation/native-stack`) with a centralized `RootStackParamList` in `src/navigation/types.ts`.
   - Screen parameters must be strictly typed using `NativeStackScreenProps`.
   - Deep linking is configured via `src/navigation/linking.ts` to map `''` to Bookings List and `'bookings/:id'` to Booking Detail.

3. **4-Tier State Boundaries**:
   - **Tier 1 (Server State)**: `@tanstack/react-query` exclusively for remote API data, caching, `isRefetching` (pull-to-refresh), error retry, and `dataUpdatedAt`.
   - **Tier 2 (Global Client State)**: `zustand` exclusively for cross-screen UI state (e.g. search query persistence across navigation transitions).
   - **Tier 3 (Persistent Storage)**: `@react-native-async-storage/async-storage` wrapped in the **Repository Pattern** (`INotesRepository`) for offline notes keyed by `@booking_note_${bookingId}`.
   - **Tier 4 (Ephemeral Component State)**: React `useState` exclusively for live text input typing and temporary feedback messages. *Never put raw text input keystrokes into global stores.*

4. **Design Tokens & Styling**:
   - All styling must use the **Architectural Slate** design tokens from `src/shared/theme/` (colors, typography, spacing, borderRadius).
   - **Zero hardcoded hex colors or magic numbers** in component `StyleSheet`s.
   - Keep components small, readable, and mobile-first. Content must always remain inside safe area bounds (`SafeAreaView` / `SafeScreen`).
   - The detail screen must keep the note input and "Save note" button visible when the keyboard is open (`KeyboardAvoidingView` / scroll container).

5. **Exact Verbatim Strings (Spec Compliance)**:
   Never modify or paraphrase the following user-facing strings:
   - Search label: `"Search bookings"`
   - Empty search state: `"No bookings match"`
   - Empty list state: `"No bookings"`
   - Error state: `"Could not load bookings"` with button `"Try again"`
   - Timestamp line: `"Updated "` followed by formatted time
   - Check-in button: `"Check in"`
   - Note label: `"Note"`
   - Save button: `"Save note"`
   - Note validation / status:
     - Empty submit: `"Enter a note"`
     - Over 140 chars: `"Keep the note under 140 characters"`
     - Valid save: `"Note saved"`

---

## 2. Definition of Done & Verification Checklist

Before declaring any turn or task complete, run and pass:
1. `npx tsc --noEmit` — Zero TypeScript compilation errors.
2. `yarn test` — 100% of headless unit tests passing (`check-in.test.ts`, `bookings-api.test.ts`).
3. Audit exact strings against the spec.
4. Audit stylesheets for zero un-tokenized hex colors.
