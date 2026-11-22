import { validateNote } from '../lib/note-validator';

describe('validateNote boundary tests', () => {
  it('returns empty error when string is empty', () => {
    expect(validateNote('')).toEqual({ isValid: false, error: 'empty' });
  });

  it('returns empty error when string contains only whitespace', () => {
    expect(validateNote('   \n\t  ')).toEqual({ isValid: false, error: 'empty' });
  });

  it('returns valid when string has exactly 1 character', () => {
    expect(validateNote('a')).toEqual({ isValid: true });
  });

  it('returns valid when string has exactly 140 characters', () => {
    const text140 = 'a'.repeat(140);
    expect(validateNote(text140)).toEqual({ isValid: true });
  });

  it('returns too_long error when string has 141 characters', () => {
    const text141 = 'a'.repeat(141);
    expect(validateNote(text141)).toEqual({ isValid: false, error: 'too_long' });
  });

  it('returns valid for normal note content', () => {
    expect(validateNote('Please bring hard hats and safety gear.')).toEqual({
      isValid: true,
    });
  });
});
