import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { defaultNotesRepository, INotesRepository } from '../repository/async-storage-notes-repository';
import { validateNote } from '../lib/note-validator';
import { useTheme } from '../../../shared/hooks/useTheme';

interface NoteSectionProps {
  bookingId: string;
  repository?: INotesRepository;
}

type FeedbackType = 'idle' | 'empty' | 'too_long' | 'saved';

export function NoteSection({
  bookingId,
  repository = defaultNotesRepository,
}: NoteSectionProps) {
  const theme = useTheme();

  const [noteText, setNoteText] = useState('');
  const [feedback, setFeedback] = useState<FeedbackType>('idle');
  const [isLoadingNote, setIsLoadingNote] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadSavedNote() {
      setIsLoadingNote(true);
      try {
        const saved = await repository.getNote(bookingId);
        if (isMounted && saved !== null) {
          setNoteText(saved);
        }
      } catch (err) {
        console.warn('Failed to load note:', err);
      } finally {
        if (isMounted) {
          setIsLoadingNote(false);
        }
      }
    }

    loadSavedNote();

    return () => {
      isMounted = false;
    };
  }, [bookingId, repository]);

  const handleSave = async () => {
    const result = validateNote(noteText);
    if (!result.isValid) {
      setFeedback(result.error);
      return;
    }

    setIsSaving(true);
    try {
      await repository.saveNote(bookingId, noteText);
      setFeedback('saved');
    } catch (err) {
      console.warn('Failed to save note:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const charCount = noteText.length;
  const isTooLong = charCount > 140;
  const isNearLimit = charCount >= 120 && !isTooLong;

  return (
    <View style={[styles.container, { marginVertical: theme.spacing.lg }]}>
      <View style={[styles.labelRow, { marginBottom: theme.spacing.sm }]}>
        <Text
          style={[
            styles.label,
            {
              color: theme.colors.text.primary,
              fontSize: theme.typography.fontSize.md,
            },
          ]}
        >
          Note
        </Text>
        <Text
          style={[
            styles.charCounter,
            {
              color: isTooLong
                ? theme.colors.status.error
                : isNearLimit
                ? theme.colors.status.warning
                : theme.colors.text.muted,
              fontSize: theme.typography.fontSize.xs,
            },
          ]}
        >
          {charCount} / 140
        </Text>
      </View>

      {isLoadingNote ? (
        <View
          style={[
            styles.loadingContainer,
            { paddingVertical: theme.spacing.xxxl },
          ]}
        >
          <ActivityIndicator size="small" color={theme.colors.brand.primary} />
        </View>
      ) : (
        <TextInput
          value={noteText}
          onChangeText={(text) => {
            setNoteText(text);
            if (feedback !== 'idle') {
              setFeedback('idle');
            }
          }}
          placeholder="Add a note about this booking..."
          placeholderTextColor={theme.colors.text.muted}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
          style={[
            styles.input,
            {
              backgroundColor: theme.colors.surface,
              borderColor: isTooLong
                ? theme.colors.status.error
                : theme.colors.border.subtle,
              borderRadius: theme.borderRadius.md,
              color: theme.colors.text.primary,
              fontSize: theme.typography.fontSize.md,
              padding: theme.spacing.md,
              minHeight: theme.spacing.huge * 2,
              marginBottom: theme.spacing.sm,
            },
          ]}
          accessibilityLabel="Note"
        />
      )}

      {feedback === 'empty' && (
        <Text
          style={[
            styles.feedbackText,
            {
              color: theme.colors.status.error,
              fontSize: theme.typography.fontSize.sm,
              marginBottom: theme.spacing.sm,
            },
          ]}
        >
          Enter a note
        </Text>
      )}

      {feedback === 'too_long' && (
        <Text
          style={[
            styles.feedbackText,
            {
              color: theme.colors.status.error,
              fontSize: theme.typography.fontSize.sm,
              marginBottom: theme.spacing.sm,
            },
          ]}
        >
          Keep the note under 140 characters
        </Text>
      )}

      {feedback === 'saved' && (
        <Text
          style={[
            styles.feedbackText,
            {
              color: theme.colors.status.success,
              fontSize: theme.typography.fontSize.sm,
              marginBottom: theme.spacing.sm,
            },
          ]}
        >
          Note saved
        </Text>
      )}

      <Pressable
        onPress={handleSave}
        disabled={isSaving}
        accessibilityRole="button"
        accessibilityLabel="Save note"
        style={({ pressed }) => [
          styles.saveButton,
          {
            backgroundColor: theme.colors.brand.primary,
            borderRadius: theme.borderRadius.md,
            minHeight: theme.spacing.huge,
            paddingVertical: theme.spacing.md,
            paddingHorizontal: theme.spacing.lg,
            marginTop: theme.spacing.xs,
            opacity: pressed || isSaving ? 0.85 : 1,
          },
        ]}
      >
        {isSaving ? (
          <ActivityIndicator size="small" color={theme.colors.brand.primaryText} />
        ) : (
          <Text
            style={[
              styles.saveButtonText,
              {
                color: theme.colors.brand.primaryText,
                fontSize: theme.typography.fontSize.md,
              },
            ]}
          >
            Save note
          </Text>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontWeight: '600',
  },
  charCounter: {
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  feedbackText: {
    fontWeight: '500',
  },
  saveButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonText: {
    fontWeight: '600',
    letterSpacing: 0.3,
  },
});
