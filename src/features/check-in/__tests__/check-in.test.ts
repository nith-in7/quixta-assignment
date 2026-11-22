import { canCheckIn } from '../lib/check-in';

describe('canCheckIn domain logic', () => {
  const startsAt = new Date('2026-06-01T15:00:00.000Z');

  it('returns false when now is 16 minutes before startsAt (2026-06-01T14:44:00.000Z)', () => {
    const now = new Date('2026-06-01T14:44:00.000Z');
    expect(canCheckIn(now, startsAt)).toBe(false);
  });

  it('returns true when now is exactly 15 minutes before startsAt (2026-06-01T14:45:00.000Z)', () => {
    const now = new Date('2026-06-01T14:45:00.000Z');
    expect(canCheckIn(now, startsAt)).toBe(true);
  });

  it('returns true when now is at start time (2026-06-01T15:00:00.000Z)', () => {
    const now = new Date('2026-06-01T15:00:00.000Z');
    expect(canCheckIn(now, startsAt)).toBe(true);
  });

  it('returns true when now is after the start time (2026-06-01T15:30:00.000Z)', () => {
    const now = new Date('2026-06-01T15:30:00.000Z');
    expect(canCheckIn(now, startsAt)).toBe(true);
  });

  it('returns false if invalid date objects are passed', () => {
    expect(canCheckIn(new Date('invalid'), startsAt)).toBe(false);
    expect(canCheckIn(new Date(), new Date('invalid'))).toBe(false);
  });
});
