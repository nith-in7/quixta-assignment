import AsyncStorage from '@react-native-async-storage/async-storage';
import { INotesRepository } from './notes-repository';
export { INotesRepository };

export class AsyncStorageNotesRepository implements INotesRepository {
  private getStorageKey(bookingId: string): string {
    return `@booking_note_${bookingId}`;
  }

  async getNote(bookingId: string): Promise<string | null> {
    try {
      const key = this.getStorageKey(bookingId);
      return await AsyncStorage.getItem(key);
    } catch (error) {
      console.warn(`[AsyncStorageNotesRepository] Error reading note for ${bookingId}:`, error);
      return null;
    }
  }

  async saveNote(bookingId: string, note: string): Promise<void> {
    const key = this.getStorageKey(bookingId);
    await AsyncStorage.setItem(key, note);
  }

  async deleteNote(bookingId: string): Promise<void> {
    const key = this.getStorageKey(bookingId);
    await AsyncStorage.removeItem(key);
  }
}

export const defaultNotesRepository = new AsyncStorageNotesRepository();
