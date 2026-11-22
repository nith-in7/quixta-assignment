import {
  formatLocalTime,
  formatLocalDate,
  formatUpdatedTimestamp,
} from '../utils/date';

describe('Timezone date formatting utility', () => {
  it('formats Studio visit correctly to 11:00 AM in America/New_York', () => {
    const startsAt = '2026-06-01T15:00:00.000Z';
    const timezone = 'America/New_York';

    expect(formatLocalTime(startsAt, timezone)).toBe('11:00 AM');
    expect(formatLocalDate(startsAt, timezone)).toBe('June 1, 2026');
  });

  it('formats Site walkthrough correctly to 11:00 AM in America/Los_Angeles', () => {
    const startsAt = '2026-06-01T18:00:00.000Z';
    const timezone = 'America/Los_Angeles';

    expect(formatLocalTime(startsAt, timezone)).toBe('11:00 AM');
    expect(formatLocalDate(startsAt, timezone)).toBe('June 1, 2026');
  });

  it('formats Plan review correctly to 3:00 PM in Europe/London', () => {
    const startsAt = '2026-06-01T14:00:00.000Z';
    const timezone = 'Europe/London';

    expect(formatLocalTime(startsAt, timezone)).toBe('3:00 PM');
    expect(formatLocalDate(startsAt, timezone)).toBe('June 1, 2026');
  });

  describe('Edge cases and fallbacks', () => {
    it('returns empty string when date string is invalid', () => {
      expect(formatLocalTime('not-a-date', 'America/New_York')).toBe('');
      expect(formatLocalDate('not-a-date', 'America/New_York')).toBe('');
      expect(formatUpdatedTimestamp(NaN)).toBe('');
    });

    it('falls back gracefully to device time when an invalid timezone is provided', () => {
      const startsAt = '2026-06-01T15:00:00.000Z';
      const resultTime = formatLocalTime(startsAt, 'Invalid/Timezone');
      const resultDate = formatLocalDate(startsAt, 'Invalid/Timezone');

      expect(typeof resultTime).toBe('string');
      expect(resultTime.length).toBeGreaterThan(0);
      expect(typeof resultDate).toBe('string');
      expect(resultDate.length).toBeGreaterThan(0);
    });

    it('formats timestamp with seconds included for pull-to-refresh visibility', () => {
      const fixedMs = 1772449245000;
      const formatted = formatUpdatedTimestamp(fixedMs);

      // Matches formats like "11:00:45 AM" or "3:20:05 PM"
      expect(formatted).toMatch(/\d{1,2}:\d{2}:\d{2}\s?(AM|PM)/i);
    });
  });
});
