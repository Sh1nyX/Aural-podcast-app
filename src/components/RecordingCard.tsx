import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { useState } from 'react';

import { Recording } from '@/types/recording';
import AudioPlayer from '@/components/AudioPlayer';
import { categories } from '@/constants/categories';

type RecordingCardProps = {
  recording: Recording;
  isSelected: boolean;
  isEditing: boolean;
  selectionMode: boolean;

  onLongPress: () => void;
  onPress: () => void;

  onRename: (id: string, name: string) => void;
  onCategoryChange: (id: string, category: string) => void;
};

function formatTime(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds
    .toString()
    .padStart(2, '0')}`;
}

export default function RecordingCard({
  recording,
  isSelected,
  isEditing,
  selectionMode,
  onLongPress,
  onPress,
  onRename,
  onCategoryChange,
}: RecordingCardProps) {
  const [newName, setNewName] = useState(recording.name);
  const [showCategories, setShowCategories] = useState(false);

  const handleRename = () => {
    const trimmedName = newName.trim();

    if (!trimmedName) {
      return;
    }

    onRename(recording.id, trimmedName);
  };

  return (
    <Pressable
      style={[
        styles.card,
        isSelected && styles.selectedCard,
      ]}
      onLongPress={onLongPress}
      onPress={onPress}
      delayLongPress={500}
    >

      {selectionMode && (
        <View
          style={[
            styles.selectionIndicator,
            isSelected && styles.selectionIndicatorSelected,
          ]}
        >
          {isSelected && (
            <Text style={styles.checkmark}>
              ✓
            </Text>
          )}
        </View>
      )}

      <View style={styles.info}>

        {isEditing ? (
          <TextInput
            style={styles.nameInput}
            value={newName}
            onChangeText={setNewName}
            autoFocus
            keyboardType="default"
          />
        ) : (
          <Text style={styles.name}>
            {recording.name}
          </Text>
        )}

        <Text style={styles.details}>
          {recording.date} • {formatTime(recording.duration)}
        </Text>

        <Pressable
          style={styles.categoryButton}
          onPress={() => setShowCategories(!showCategories)}
        >
          <Text style={styles.categoryText}>
            {recording.category}
          </Text>
        </Pressable>

        {showCategories && (
          <View style={styles.categoryList}>
            {categories.map((category) => (
              <Pressable
                key={category}
                style={styles.categoryOption}
                onPress={() => {
                  onCategoryChange(
                    recording.id,
                    category
                  );
                  setShowCategories(false);
                }}
              >
                <Text style={styles.categoryOptionText}>
                  {category}
                </Text>
              </Pressable>
            ))}
          </View>
        )}

      </View>

      <AudioPlayer uri={recording.uri} />

      {isEditing && (
        <Pressable
          style={styles.saveButton}
          onPress={handleRename}
        >
          <Text style={styles.saveText}>
            Зберегти
          </Text>
        </Pressable>
      )}

    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    position: 'relative',
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    backgroundColor: '#eeeeee',
  },

  selectedCard: {
    borderWidth: 2,
    borderColor: '#208AEF',
  },

  selectionIndicator: {
    position: 'absolute',
    top: 12,
    right: 12,

    width: 24,
    height: 24,
    borderRadius: 12,

    borderWidth: 2,
    borderColor: '#aaaaaa',

    justifyContent: 'center',
    alignItems: 'center',

    backgroundColor: '#ffffff',
  },

  selectionIndicatorSelected: {
    backgroundColor: '#208AEF',
    borderColor: '#208AEF',
  },

  checkmark: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: 'bold',
  },

  info: {
    marginBottom: 8,
  },

  name: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 6,
    paddingRight: 30,
  },

  nameInput: {
    fontSize: 18,
    fontWeight: '600',
    borderWidth: 1,
    borderColor: '#cccccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: '#ffffff',
    marginBottom: 6,
  },

  details: {
    fontSize: 14,
    color: '#666666',
  },

  categoryButton: {
    alignSelf: 'flex-start',
    marginTop: 6,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: '#ffffff',
  },

  categoryText: {
    fontSize: 13,
    color: '#208AEF',
    fontWeight: '600',
  },

  categoryList: {
    marginTop: 6,
    borderRadius: 8,
    backgroundColor: '#ffffff',
    overflow: 'hidden',
  },

  categoryOption: {
    paddingVertical: 10,
    paddingHorizontal: 12,
  },

  categoryOptionText: {
    fontSize: 14,
  },

  saveButton: {
    alignSelf: 'flex-start',
    marginTop: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#208AEF',
  },

  saveText: {
    color: '#ffffff',
    fontWeight: '600',
  },
});