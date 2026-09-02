import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';

import { getPodcastEpisodes } from '@/services/podcastFeed';
import { PodcastEpisode } from '@/types/podcastEpisode';

function formatTime(seconds: number) {
  const totalSeconds = Math.floor(seconds);

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor(
    (totalSeconds % 3600) / 60
  );
  const remainingSeconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}:${minutes
      .toString()
      .padStart(2, '0')}:${remainingSeconds
      .toString()
      .padStart(2, '0')}`;
  }

  return `${minutes
    .toString()
    .padStart(2, '0')}:${remainingSeconds
    .toString()
    .padStart(2, '0')}`;
}

export default function PodcastDetailsScreen() {
  const {
    name,
    artist,
    artworkUrl,
    feedUrl,
  } = useLocalSearchParams<{
    id: string;
    name: string;
    artist: string;
    artworkUrl: string;
    feedUrl: string;
  }>();

  const [episodes, setEpisodes] =
    useState<PodcastEpisode[]>([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadEpisodes = async () => {
      try {
        if (!feedUrl) {
          return;
        }

        const result =
          await getPodcastEpisodes(feedUrl);

        setEpisodes(result);
      } catch (error) {
        console.log(
          'Ошибка загрузки выпусков:',
          error
        );
      } finally {
        setLoading(false);
      }
    };

    loadEpisodes();
  }, [feedUrl]);

  const openEpisode = (
    episode: PodcastEpisode
  ) => {
    router.push({
      pathname: '/player/[id]',
      params: {
        id: Date.now().toString(),
        name,
        artist,
        artworkUrl,
        feedUrl,

        episodeTitle: episode.title,
        episodeAudioUrl: episode.audioUrl,
        episodeDuration:
          episode.duration.toString(),
        episodeDate: episode.date,
      },
    });
  };

  return (
    <View style={styles.container}>

      <View style={styles.podcastHeader}>
        <Image
          source={{ uri: artworkUrl }}
          style={styles.artwork}
        />

        <Text
          style={styles.name}
          numberOfLines={2}
        >
          {name}
        </Text>

        <Text
          style={styles.artist}
          numberOfLines={1}
        >
          {artist}
        </Text>
      </View>

      <Text style={styles.episodesTitle}>
        Випуски
      </Text>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" />

          <Text style={styles.loadingText}>
            Завантаження випусків...
          </Text>
        </View>
      ) : (
        <FlatList
          data={episodes}
          keyExtractor={(item, index) =>
            `${item.id}-${index}`
          }
          renderItem={({ item }) => (
            <Pressable
              style={styles.episode}
              onPress={() =>
                openEpisode(item)
              }
            >
              <View style={styles.episodeInfo}>

                <Text
                  style={styles.episodeTitle}
                  numberOfLines={2}
                >
                  {item.title}
                </Text>

                <Text style={styles.episodeDetails}>
                  {formatTime(item.duration)}
                </Text>

              </View>

              <Text style={styles.playIcon}>
                ▶
              </Text>
            </Pressable>
          )}
          ListEmptyComponent={
            <Text style={styles.empty}>
              Випусків не знайдено
            </Text>
          }
          contentContainerStyle={
            styles.list
          }
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

  podcastHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },

  artwork: {
    width: 180,
    height: 180,
    borderRadius: 15,
    marginBottom: 15,
  },

  name: {
    fontSize: 23,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 5,
  },

  artist: {
    fontSize: 15,
    color: '#777777',
  },

  episodesTitle: {
    fontSize: 21,
    fontWeight: '600',
    marginBottom: 10,
  },

  episode: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    marginBottom: 10,
    borderRadius: 10,
    backgroundColor: '#eeeeee',
  },

  episodeInfo: {
    flex: 1,
    marginRight: 10,
  },

  episodeTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 6,
  },

  episodeDetails: {
    fontSize: 13,
    color: '#777777',
  },

  playIcon: {
    fontSize: 22,
    color: '#208AEF',
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
});