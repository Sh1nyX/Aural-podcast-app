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
  id,
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
        id,
        name,
        artist,
        artworkUrl,
        feedUrl,

        episodeTitle: episode.title,
        episodeAudioUrl: episode.audioUrl,
        episodeDuration: episode.duration.toString(),
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
    padding: 20,
    backgroundColor: '#0F1110',
  },

  podcastHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },

  artwork: {
    width: 190,
    height: 190,
    borderRadius: 14,
    marginBottom: 16,
  },

  name: {
    fontSize: 23,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 6,
    color: '#F1F3F1',
  },

  artist: {
    fontSize: 15,
    color: '#929992',
    textAlign: 'center',
  },

  episodesTitle: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 14,
    color: '#F1F3F1',
  },

  episode: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    marginBottom: 10,
    borderRadius: 12,
    backgroundColor: '#181C19',
    borderWidth: 1,
    borderColor: '#292E2A',
  },

  episodeInfo: {
    flex: 1,
    marginRight: 12,
  },

  episodeTitle: {
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 21,
    marginBottom: 7,
    color: '#F1F3F1',
  },

  episodeDetails: {
    fontSize: 13,
    color: '#929992',
  },

  playIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#202521',
    color: '#5CCF7A',
    fontSize: 17,
    textAlign: 'center',
    textAlignVertical: 'center',
    overflow: 'hidden',
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
    color: '#929992',
  },

  empty: {
    textAlign: 'center',
    marginTop: 30,
    color: '#777F79',
  },
});