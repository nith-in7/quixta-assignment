export interface Booking {
  id: string;
  title: string;
  startsAt: string;
  timezone: string;
}

export function isValidBooking(item: unknown): item is Booking {
  if (typeof item !== 'object' || item === null) {
    return false;
  }

  const candidate = item as Record<string, unknown>;

  const hasId = typeof candidate.id === 'string' && candidate.id.trim().length > 0;
  const hasTitle = typeof candidate.title === 'string' && candidate.title.trim().length > 0;
  const hasValidStartsAt =
    typeof candidate.startsAt === 'string' &&
    candidate.startsAt.trim().length > 0 &&
    !isNaN(Date.parse(candidate.startsAt));
  const hasTimezone = typeof candidate.timezone === 'string' && candidate.timezone.trim().length > 0;

  return hasId && hasTitle && hasValidStartsAt && hasTimezone;
}
