export interface INotesRepository {
  getNote(bookingId: string): Promise<string | null>;
  saveNote(bookingId: string, note: string): Promise<void>;
  deleteNote(bookingId: string): Promise<void>;
}
