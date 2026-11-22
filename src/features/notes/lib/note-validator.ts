export type NoteValidationResult =
  | { isValid: true }
  | { isValid: false; error: 'empty' | 'too_long' };

export function validateNote(text: string): NoteValidationResult {
  if (text.trim().length === 0) {
    return { isValid: false, error: 'empty' };
  }

  if (text.length > 140) {
    return { isValid: false, error: 'too_long' };
  }

  return { isValid: true };
}
