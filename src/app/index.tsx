import { useCallback, useState } from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { router, useFocusEffect } from 'expo-router';

import RecordingCard from '@/components/RecordingCard';
import SearchBar from '@/components/SearchBar';

import { Recording } from '@/types/recording';
import { categories } from '@/constants/categories';

import {
  getRecordings,
  saveRecordings,
  deleteRecordingFile,
} from '@/services/recordingStorage';

export default function HomeScreen() {
  const [recordings, setRecordings] = useState<Recording[]>([]);

  const [searchText, setSearchText] = useState('');

  const [selectedCategory, setSelectedCategory] =
    useState('Всі');

  const [selectedIds, setSelectedIds] =
    useState<string[]>([]);

  const [isEditing, setIsEditing] = useState(false);

  const selectionMode = selectedIds.length > 0;

  useFocusEffect(
    useCallback(() => {
      const loadRecordings = async () => {
        const savedRecordings = await getRecordings();
        setRecordings(savedRecordings);
      };

      loadRecordings();
    }, [])
  );

  const filteredRecordings = recordings.filter(
    (recording) => {
      const matchesSearch = recording.name
        .toLowerCase()
        .includes(searchText.toLowerCase());

      const matchesCategory =
        selectedCategory === 'Всі' ||
        recording.category === selectedCategory;

      return matchesSearch && matchesCategory;
    }
  );

  const openRecorder = () => {
    router.push('/record');
  };

  const startSelection = (id: string) => {
    setSelectedIds([id]);
  };

  const toggleSelection = (id: string) => {
    setSelectedIds((currentIds) => {
      if (currentIds.includes(id)) {
        const updatedIds = currentIds.filter(
          (itemId) => itemId !== id
        );

        if (updatedIds.length === 0) {
          setIsEditing(false);
        }

        return updatedIds;
      }

      return [...currentIds, id];
    });
  };

  const exitSelectionMode = () => {
    setSelectedIds([]);
    setIsEditing(false);
  };

  const deleteSelected = async () => {
    const selectedRecordings = recordings.filter(
      (recording) =>
        selectedIds.includes(recording.id)
    );

    for (const recording of selectedRecordings) {
      await deleteRecordingFile(recording.uri);
    }

    const updatedRecordings = recordings.filter(
      (recording) =>
        !selectedIds.includes(recording.id)
    );

    setRecordings(updatedRecordings);
    await saveRecordings(updatedRecordings);

    exitSelectionMode();
  };

  const startRename = () => {
    if (selectedIds.length !== 1) {
      return;
    }

    setIsEditing(true);
  };

  const renameRecording = async (
    id: string,
    name: string
  ) => {
    const updatedRecordings = recordings.map(
      (recording) =>
        recording.id === id
          ? { ...recording, name }
          : recording
    );

    setRecordings(updatedRecordings);
    await saveRecordings(updatedRecordings);

    setIsEditing(false);
    exitSelectionMode();
  };

  const changeCategory = async (
    id: string,
    category: string
  ) => {
    const updatedRecordings = recordings.map(
      (recording) =>
        recording.id === id
          ? { ...recording, category }
          : recording
    );

    setRecordings(updatedRecordings);
    await saveRecordings(updatedRecordings);
  };

  return (
    <View style={styles.container}>

      {selectionMode ? (
        <View style={styles.selectionHeader}>

          <Pressable
            style={styles.closeButton}
            onPress={exitSelectionMode}
          >
            <Text style={styles.closeText}>
              ✕
            </Text>
          </Pressable>

          <Text style={styles.selectedCount}>
            Выбрано: {selectedIds.length}
          </Text>

          <View style={styles.headerActions}>

            <Pressable
              style={[
                styles.actionButton,
                selectedIds.length !== 1 &&
                  styles.disabledButton,
              ]}
              onPress={startRename}
              disabled={selectedIds.length !== 1}
            >
              <Text
                style={[
                  styles.actionText,
                  selectedIds.length !== 1 &&
                    styles.disabledText,
                ]}
              >
                ✏️
              </Text>
            </Pressable>

            <Pressable
              style={styles.actionButton}
              onPress={deleteSelected}
            >
              <Text style={styles.actionText}>
                🗑️
              </Text>
            </Pressable>

          </View>
        </View>
      ) : (
        <SearchBar
          value={searchText}
          onChangeText={setSearchText}
        />
      )}


      {!selectionMode && (
        <View style={styles.categories}>

          <Pressable
            style={[
              styles.categoryButton,
              selectedCategory === 'Всі' &&
                styles.selectedCategory,
            ]}
            onPress={() =>
              setSelectedCategory('Всі')
            }
          >
            <Text
              style={[
                styles.categoryText,
                selectedCategory === 'Всі' &&
                  styles.selectedCategoryText,
              ]}
            >
              Всі
            </Text>
          </Pressable>

          {categories.map((category) => (
            <Pressable
              key={category}
              style={[
                styles.categoryButton,
                selectedCategory === category &&
                  styles.selectedCategory,
              ]}
              onPress={() =>
                setSelectedCategory(category)
              }
            >
              <Text
                style={[
                  styles.categoryText,
                  selectedCategory === category &&
                    styles.selectedCategoryText,
                ]}
              >
                {category}
              </Text>
            </Pressable>
          ))}

        </View>
      )}

      <Text style={styles.sectionTitle}>
        Мої записи
      </Text>

      <FlatList
        data={filteredRecordings}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <RecordingCard
            recording={item}
            isSelected={selectedIds.includes(item.id)}
            isEditing={
              isEditing &&
              selectedIds.includes(item.id)
            }
            selectionMode={selectionMode}
            onLongPress={() =>
              startSelection(item.id)
            }
            onPress={() => {
              if (selectionMode) {
                toggleSelection(item.id);
              }
            }}
            onRename={renameRecording}
            onCategoryChange={changeCategory}
          />
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>
            {searchText
              ? 'Записів не знайдено'
              : 'Записів поки немає'}
          </Text>
        }
        contentContainerStyle={styles.listContent}
      />

      {!selectionMode && (
      <Pressable
        style={styles.podcastsButton}
        onPress={() => router.push('/podcasts')}
      >
        <Text style={styles.podcastsButtonText}>
          Подкасти
        </Text>
  </Pressable>

  )}
      
      {!selectionMode && (
      <Pressable
        style={styles.recordButton}
        onPress={openRecorder}
      >
        <Text style={styles.recordButtonText}>
          +
        </Text>
      </Pressable>
    )}

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },

  selectionHeader: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },

  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#eeeeee',
  },

  closeText: {
    fontSize: 20,
  },

  selectedCount: {
    flex: 1,
    marginLeft: 12,
    fontSize: 17,
    fontWeight: '600',
  },

  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },

  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#eeeeee',
  },

  disabledButton: {
    opacity: 0.35,
  },

  actionText: {
    fontSize: 18,
  },

  disabledText: {
    opacity: 0.5,
  },

  categories: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },

  categoryButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: '#eeeeee',
  },

  selectedCategory: {
    backgroundColor: '#208AEF',
  },

  categoryText: {
    fontSize: 13,
    color: '#333333',
  },

  selectedCategoryText: {
    color: '#ffffff',
  },

  sectionTitle: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 15,
  },

  listContent: {
    paddingBottom: 100,
  },

  empty: {
    textAlign: 'center',
    color: '#777777',
    marginTop: 30,
  },

  recordButton: {
    position: 'absolute',
    right: 25,
    bottom: 25,

    width: 64,
    height: 64,
    borderRadius: 32,

    backgroundColor: '#208AEF',

    justifyContent: 'center',
    alignItems: 'center',

    elevation: 5,
  },

  recordButtonText: {
    color: '#ffffff',
    fontSize: 36,
    fontWeight: '300',
    lineHeight: 40,
  },

  podcastsButton: {
  marginTop: 10,
  marginBottom: 15,
  paddingVertical: 12,
  borderRadius: 10,
  backgroundColor: '#eeeeee',
  alignItems: 'center',
},

podcastsButtonText: {
  fontSize: 16,
  fontWeight: '600',
},
});