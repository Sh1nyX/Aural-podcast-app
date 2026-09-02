import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { router } from 'expo-router';

import PodcastCard from '@/components/PodcastCard';

import { searchPodcasts } from '@/services/podcastApi';
import {
  getFavoritePodcasts,
} from '@/services/podcastStorage';

import { Podcast } from '@/types/podcast';
import { podcastCategories } from '@/constants/podcastCategories';

export default function PodcastsScreen() {
  const [podcasts, setPodcasts] = useState<Podcast[]>([]);

  const [loading, setLoading] = useState(true);

  const [selectedCategory, setSelectedCategory] =
    useState('Technology');

  const [showCategories, setShowCategories] =
    useState(false);

  const [showFavorites, setShowFavorites] =
    useState(false);

  const loadPodcasts = async (category: string) => {
    try {
      setLoading(true);

      const result = await searchPodcasts(category);

      setPodcasts(result);
    } catch (error) {
      console.log('Ошибка:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadFavorites = async () => {
    try {
      setLoading(true);

      const favorites =
        await getFavoritePodcasts();

      setPodcasts(favorites);
    } catch (error) {
      console.log('Ошибка загрузки избранного:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPodcasts('Technology');
  }, []);

  const handleCategoryPress = (
    category: string
  ) => {
    setSelectedCategory(category);
    setShowCategories(false);
    setShowFavorites(false);

    loadPodcasts(category);
  };

  const handleFavoritesPress = () => {
  if (showFavorites) {
    setShowFavorites(false);
    loadPodcasts(selectedCategory);
    return;
  }

  setShowFavorites(true);
  setShowCategories(false);

  loadFavorites();
};

  return (
    <View style={styles.container}>
      <View style={styles.topButtons}>

        <Pressable
          style={styles.topButton}
          onPress={() =>
            router.push('/podcasts/search')
          }
        >
          <Text style={styles.topButtonText}>
            Пошук
          </Text>
        </Pressable>

        <Pressable
          style={[
            styles.topButton,
            showFavorites &&
              styles.activeTopButton,
          ]}
          onPress={handleFavoritesPress}
        >
          <Text
            style={[
              styles.topButtonText,
              showFavorites &&
                styles.activeTopButtonText,
            ]}
          >
            Обране
          </Text>
        </Pressable>

      </View>

      {!showFavorites && (
        <Pressable
          style={styles.categoryButton}
          onPress={() =>
            setShowCategories(!showCategories)
          }
        >
          <Text style={styles.categoryButtonText}>
            {selectedCategory}{' '}
            {showCategories ? '▲' : '▼'}
          </Text>
        </Pressable>
      )}

      {showCategories && !showFavorites && (
        <View style={styles.categoryList}>

          {podcastCategories.map((category) => (
            <Pressable
              key={category}
              style={[
                styles.categoryItem,
                selectedCategory === category &&
                  styles.selectedCategoryItem,
              ]}
              onPress={() =>
                handleCategoryPress(category)
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

      <Text style={styles.title}>
        {showFavorites
          ? 'Обране'
          : selectedCategory}
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
                router.push({
                  pathname: '/podcasts/[id]',
                  params: {
                    id: item.id.toString(),
                    name: item.name,
                    artist: item.artist,
                    artworkUrl: item.artworkUrl,
                    feedUrl: item.feedUrl,
                  },
                });
              }}
            />
          )}
          ListEmptyComponent={
            <Text style={styles.empty}>
              {showFavorites
                ? 'Обраних подкастів немає'
                : 'Подкастів не знайдено'}
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
    padding: 20,
    backgroundColor: '#0F1110',
  },

  topButtons: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 15,
  },

  topButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: '#181C19',
    borderWidth: 1,
    borderColor: '#292E2A',
    alignItems: 'center',
  },

  topButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#F1F3F1',
  },

  activeTopButton: {
    backgroundColor: '#4CAF6A',
    borderColor: '#4CAF6A',
  },

  activeTopButtonText: {
    color: '#0F1110',
  },

  categoryButton: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 10,
    backgroundColor: '#181C19',
    borderWidth: 1,
    borderColor: '#292E2A',
    marginBottom: 8,
  },

  categoryButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#F1F3F1',
  },

  categoryList: {
    marginBottom: 12,
    borderRadius: 10,
    backgroundColor: '#181C19',
    borderWidth: 1,
    borderColor: '#292E2A',
    overflow: 'hidden',
  },

  categoryItem: {
    paddingVertical: 11,
    paddingHorizontal: 14,
  },

  selectedCategoryItem: {
    backgroundColor: '#4CAF6A',
  },

  categoryText: {
    fontSize: 14,
    color: '#A7AEA8',
  },

  selectedCategoryText: {
    color: '#0F1110',
    fontWeight: '600',
  },

  title: {
    fontSize: 22,
    fontWeight: '600',
    color: '#F1F3F1',
    marginBottom: 15,
  },

  list: {
    paddingBottom: 20,
  },

  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  loadingText: {
    marginTop: 10,
    color: '#929992',
  },

  empty: {
    textAlign: 'center',
    marginTop: 30,
    color: '#777F79',
  },
});