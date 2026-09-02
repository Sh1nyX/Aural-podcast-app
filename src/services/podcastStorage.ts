import AsyncStorage from '@react-native-async-storage/async-storage';

import { Podcast } from '@/types/podcast';

const FAVORITES_KEY = '@podcast_favorites';

export async function getFavoritePodcasts(): Promise<Podcast[]> {
  const data = await AsyncStorage.getItem(FAVORITES_KEY);

  if (!data) {
    return [];
  }

  return JSON.parse(data);
}

export async function isPodcastFavorite(
  id: number
): Promise<boolean> {
  const favorites = await getFavoritePodcasts();

  return favorites.some(
    (podcast) => podcast.id === id
  );
}

export async function addFavoritePodcast(
  podcast: Podcast
): Promise<void> {
  const favorites = await getFavoritePodcasts();

  const alreadyExists = favorites.some(
    (item) => item.id === podcast.id
  );

  if (alreadyExists) {
    return;
  }

  await AsyncStorage.setItem(
    FAVORITES_KEY,
    JSON.stringify([
      ...favorites,
      podcast,
    ])
  );
}

export async function removeFavoritePodcast(
  id: number
): Promise<void> {
  const favorites = await getFavoritePodcasts();

  const updatedFavorites = favorites.filter(
    (podcast) => podcast.id !== id
  );

  await AsyncStorage.setItem(
    FAVORITES_KEY,
    JSON.stringify(updatedFavorites)
  );
}