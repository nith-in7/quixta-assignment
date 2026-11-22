import { AsyncStorageNotesRepository } from '../repository/async-storage-notes-repository';
import AsyncStorage from '@react-native-async-storage/async-storage';

jest.mock('@react-native-async-storage/async-storage', () => {
  const store = new Map<string, string>();
  return {
    getItem: jest.fn(async (key: string) => store.get(key) ?? null),
    setItem: jest.fn(async (key: string, value: string) => {
      store.set(key, value);
    }),
    removeItem: jest.fn(async (key: string) => {
      store.delete(key);
    }),
    clear: jest.fn(async () => {
      store.clear();
    }),
  };
});

describe('AsyncStorageNotesRepository', () => {
  let repository: AsyncStorageNotesRepository;

  beforeEach(() => {
    jest.clearAllMocks();
    repository = new AsyncStorageNotesRepository();
  });

  it('stores and retrieves a note for a booking under @booking_note_${bookingId}', async () => {
    const bookingId = 'studio';
    const noteText = 'Great acoustics in the live room.';

    await repository.saveNote(bookingId, noteText);

    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      `@booking_note_${bookingId}`,
      noteText
    );

    const retrieved = await repository.getNote(bookingId);
    expect(retrieved).toBe(noteText);
    expect(AsyncStorage.getItem).toHaveBeenCalledWith(
      `@booking_note_${bookingId}`
    );
  });

  it('returns null when no note exists for a booking', async () => {
    const retrieved = await repository.getNote('nonexistent');
    expect(retrieved).toBeNull();
  });

  it('deletes a note for a booking', async () => {
    const bookingId = 'site';
    await repository.saveNote(bookingId, 'Needs ladder');
    await repository.deleteNote(bookingId);

    const retrieved = await repository.getNote(bookingId);
    expect(retrieved).toBeNull();
  });
});
