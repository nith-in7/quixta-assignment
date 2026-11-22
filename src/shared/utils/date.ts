export function formatLocalTime(
  dateOrIso: Date | string,
  timezone: string
): string {
  const date = typeof dateOrIso === 'string' ? new Date(dateOrIso) : dateOrIso;
  if (isNaN(date.getTime())) {
    return '';
  }

  try {
    return new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }).format(date);
  } catch {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }).format(date);
  }
}

export function formatLocalDate(
  dateOrIso: Date | string,
  timezone: string
): string {
  const date = typeof dateOrIso === 'string' ? new Date(dateOrIso) : dateOrIso;
  if (isNaN(date.getTime())) {
    return '';
  }

  try {
    return new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  } catch {
    return new Intl.DateTimeFormat('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  }
}

export function formatUpdatedTimestamp(dateOrMs: Date | number): string {
  const date = typeof dateOrMs === 'number' ? new Date(dateOrMs) : dateOrMs;
  if (isNaN(date.getTime())) {
    return '';
  }

  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  }).format(date);
}
