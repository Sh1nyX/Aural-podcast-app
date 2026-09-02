import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { router } from 'expo-router';

import PodcastCard from '@/components/PodcastCard';
import SearchBar from '@/components/SearchBar';

import { searchPodcasts } from '@/services/podcastApi';
import { Podcast } from '@/types/podcast';

export default function PodcastSearchScreen() {
  const [podcasts, setPodcasts] = useState<Podcast[]>([]);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!searchText.trim()) {
      return;
    }

    try {
      setLoading(true);

      const result = await searchPodcasts(searchText);

      setPodcasts(result);
    } catch (error) {
      console.log('Ошибка:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleSearch();
  }, []);

  return (
    <View style={styles.container}>
      <SearchBar
        value={searchText}
        onChangeText={setSearchText}
        placeholder="Пошук подкастів..."
      />

      <Text
        style={styles.searchButton}
        onPress={handleSearch}
      >
        Пошук
      </Text>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" />

          <Text style={styles.loadingText}>
            Завантаження...
          </Text>
        </View>
      ) : (
        <FlatList
          data={podcasts}
          keyExtractor={(item) =>
            item.id.toString()
          }
          renderItem={({ item }) => (
            <PodcastCard
              podcast={item}
              onPress={() => {
                console.log(
                  'Выбран подкаст:',
                  item.name
                );
              }}
            />
          )}
          ListEmptyComponent={
            <Text style={styles.empty}>
              Подкастів не знайдено
            </Text>
          }
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
  },

  list: {
    paddingBottom: 30,
  },

  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  loadingText: {
    marginTop: 10,
    color: '#666666',
  },

  empty: {
    textAlign: 'center',
    marginTop: 30,
    color: '#777777',
  },

  searchButton: {
    padding: 12,
    marginBottom: 15,
    borderRadius: 10,
    backgroundColor: '#208AEF',
    color: '#ffffff',
    textAlign: 'center',
    fontWeight: '600',
  },
});