const FIFTEEN_MINUTES_MS = 15 * 60 * 1000;

/**
 * Determines whether a user can check in to a booking.
 * Returns true when now is 15 minutes or less before startsAt (or later),
 * and false before that.
 */
export function canCheckIn(now: Date, startsAt: Date): boolean {
  const nowMs = now.getTime();
  const startsAtMs = startsAt.getTime();

  if (isNaN(nowMs) || isNaN(startsAtMs)) {
    return false;
  }

  const msUntilStart = startsAtMs - nowMs;
  return msUntilStart <= FIFTEEN_MINUTES_MS;
}
