import { useEffect, useState } from 'react';
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';

import {
  addFavoritePodcast,
  isPodcastFavorite,
  removeFavoritePodcast,
} from '@/services/podcastStorage';

import {
  useAudioPlayer,
  useAudioPlayerStatus,
  setAudioModeAsync,
} from 'expo-audio';

import Slider from '@react-native-community/slider';

import { getPodcastEpisodes } from '@/services/podcastFeed';
import { PodcastEpisode } from '@/types/podcastEpisode';

function formatTime(seconds: number) {
  const totalSeconds = Math.floor(seconds);

  const minutes = Math.floor(totalSeconds / 60);
  const remainingSeconds = totalSeconds % 60;

  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds
    .toString()
    .padStart(2, '0')}`;
}

export default function PodcastPlayerScreen() {
  const {
    id,
    name,
    artist,
    artworkUrl,
    feedUrl,
    category,
    episodeTitle,
    episodeAudioUrl,
    episodeDuration,
    episodeDate,
  } = useLocalSearchParams<{
    id: string;
    name: string;
    artist: string;
    artworkUrl: string;
    feedUrl: string;
    category: string;

    episodeTitle: string;
    episodeAudioUrl: string;
    episodeDuration: string;
    episodeDate: string;
  }>();

  const [isFavorite, setIsFavorite] =
    useState(false);

  const [speed, setSpeed] = useState(1);

  const [showSpeeds, setShowSpeeds] =
    useState(false);

  const [episodes, setEpisodes] =
  useState<PodcastEpisode[]>([]);

const [currentEpisodeIndex, setCurrentEpisodeIndex] =
  useState(0);

const [currentEpisode, setCurrentEpisode] =
  useState<PodcastEpisode>({
    id: 'selected',
    title: episodeTitle,
    description: '',
    audioUrl: episodeAudioUrl,
    duration: Number(episodeDuration),
    date: episodeDate,
  });

  const player = useAudioPlayer(
    episodeAudioUrl,
    {
      updateInterval: 100,
    }
  );

  useEffect(() => {
  const configureAudio = async () => {
    await setAudioModeAsync({
      playsInSilentMode: true,
      shouldPlayInBackground: true,
      interruptionMode: 'doNotMix',
    });
  };

  configureAudio();
}, []);

  const status = useAudioPlayerStatus(player);

  useEffect(() => {
    const checkFavorite = async () => {
      if (!id) {
        return;
      }

      const favorite =
        await isPodcastFavorite(
          Number(id)
        );

      setIsFavorite(favorite);
    };

    checkFavorite();
  }, [id]);

  useEffect(() => {
  const loadEpisodes = async () => {
    if (!feedUrl) {
      return;
    }

    try {
      const result =
        await getPodcastEpisodes(feedUrl);

      setEpisodes(result);

      const selectedIndex =
        result.findIndex(
          (item) =>
            item.audioUrl === episodeAudioUrl
        );

      if (selectedIndex !== -1) {
        setCurrentEpisodeIndex(
          selectedIndex
        );
      }
    } catch (error) {
      console.log(
        'Ошибка загрузки очереди:',
        error
      );
    }
  };

  loadEpisodes();
}, [feedUrl, episodeAudioUrl]);

useEffect(() => {
  if (!status.didJustFinish) {
    return;
  }

  const nextIndex =
    currentEpisodeIndex + 1;

  if (nextIndex >= episodes.length) {
    player.pause();
    return;
  }

  const nextEpisode =
    episodes[nextIndex];

  setCurrentEpisodeIndex(nextIndex);
  setCurrentEpisode(nextEpisode);

  player.replace(
    nextEpisode.audioUrl
  );

  player.play();
}, [
  status.didJustFinish,
  currentEpisodeIndex,
  episodes,
]);

  const togglePlay = () => {
  if (status.playing) {
    player.pause();
  } else {
    player.setActiveForLockScreen(true, {
      title: currentEpisode.title,
      artist: artist,
      albumTitle: name,
      artworkUrl: artworkUrl,
    }, {
      showSeekBackward: true,
      showSeekForward: true,
    });

    player.play();
  }
};

  const toggleFavorite = async () => {
    if (!id) {
      return;
    }

    const podcast = {
      id: Number(id),
      name,
      artist,
      artworkUrl,
      feedUrl,
      category,
    };

    if (isFavorite) {
      await removeFavoritePodcast(
        Number(id)
      );

      setIsFavorite(false);
    } else {
      await addFavoritePodcast(podcast);

      setIsFavorite(true);
    }
  };

  const seek = async (seconds: number) => {
    const newTime = Math.max(
      0,
      Math.min(
        status.duration,
        status.currentTime + seconds
      )
    );

    await player.seekTo(newTime);
  };

  const changeSpeed = async (
    newSpeed: number
  ) => {
    setSpeed(newSpeed);

    await player.setPlaybackRate(
      newSpeed
    );

    setShowSpeeds(false);
  };
  

  return (
    <View style={styles.container}>

      <View style={styles.header}>
        <Image
          source={{ uri: artworkUrl }}
          style={styles.artwork}
        />

        <Text
          style={styles.title}
          numberOfLines={2}
        >
          {currentEpisode.title}
        </Text>

        <Text
          style={styles.artist}
          numberOfLines={1}
        >
          {artist}
        </Text>

        <Text
          style={styles.podcastName}
          numberOfLines={1}
        >
          {name}
        </Text>
      </View>

      <View style={styles.progressSection}>

        <View style={styles.timeRow}>
          <Text style={styles.time}>
            {formatTime(status.currentTime)}
          </Text>

          <Text style={styles.time}>
            {formatTime(status.duration)}
          </Text>
        </View>

        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={status.duration || 1}
          value={status.currentTime}
          onSlidingComplete={async (value) => {
            await player.seekTo(value);
          }}
          minimumTrackTintColor="#208AEF"
          maximumTrackTintColor="#cccccc"
          thumbTintColor="#208AEF"
        />

      </View>

      <View style={styles.controls}>

        <View style={styles.sideControl}>
          <Pressable
            style={styles.smallButton}
            onPress={() =>
              setShowSpeeds(!showSpeeds)
            }
          >
            <Text style={styles.speedText}>
              {speed}x
            </Text>
          </Pressable>

          {showSpeeds && (
            <View style={styles.speedList}>
              {[0.5, 0.75, 1, 1.25, 1.5, 2].map(
                (value) => (
                  <Pressable
                    key={value}
                    style={[
                      styles.speedOption,
                      speed === value &&
                        styles.selectedSpeed,
                    ]}
                    onPress={() =>
                      changeSpeed(value)
                    }
                  >
                    <Text
                      style={[
                        styles.speedOptionText,
                        speed === value &&
                          styles.selectedSpeedText,
                      ]}
                    >
                      {value}x
                    </Text>
                  </Pressable>
                )
              )}
            </View>
          )}
        </View>

        <Pressable
          style={styles.skipButton}
          onPress={() => seek(-15)}
        >
          <Text style={styles.skipText}>
            ↶
          </Text>
        </Pressable>

        <Pressable
          style={styles.playButton}
          onPress={togglePlay}
        >
          <Text style={styles.playIcon}>
            {status.playing ? 'Ⅱ' : '▶'}
          </Text>
        </Pressable>

        <Pressable
          style={styles.skipButton}
          onPress={() => seek(15)}
        >
          <Text style={styles.skipText}>
            ↷
          </Text>
        </Pressable>

        <Pressable
          style={styles.smallButton}
          onPress={toggleFavorite}
        >
          <Text style={styles.favoriteIcon}>
            {isFavorite ? '♥' : '♡'}
          </Text>
        </Pressable>

      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },

  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },

  loadingText: {
    marginTop: 10,
    color: '#666666',
  },

  header: {
    alignItems: 'center',
    marginTop: 10,
  },

  artwork: {
    width: 300,
    height: 300,
    borderRadius: 18,
    marginBottom: 25,
  },

  title: {
    width: '100%',
    textAlign: 'center',
    fontSize: 26,
    fontWeight: '600',
    marginBottom: 8,
  },

  artist: {
    fontSize: 17,
    color: '#777777',
    marginBottom: 5,
  },

  podcastName: {
    fontSize: 15,
    color: '#999999',
  },

  progressSection: {
    marginBottom: 10,
  },

  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
    marginTop: 15,
  },

  time: {
    fontSize: 13,
    color: '#777777',
  },

 slider: {
  width: '100%',
  height: 40,
},

 controls: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginTop: 40,
  marginBottom: 60,
},

  sideControl: {
    position: 'relative',
  },

  smallButton: {
  width: 55,
  height: 55,
  borderRadius: 28,
  justifyContent: 'center',
  alignItems: 'center',
},

  speedText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#208AEF',
  },

  speedList: {
    position: 'absolute',
    bottom: 55,
    left: -15,
    width: 78,
    borderRadius: 10,
    backgroundColor: '#ffffff',
    elevation: 6,
    overflow: 'hidden',
  },

  speedOption: {
    paddingVertical: 9,
    alignItems: 'center',
  },

  selectedSpeed: {
    backgroundColor: '#208AEF',
  },

  speedOptionText: {
    fontSize: 14,
  },

  selectedSpeedText: {
    color: '#ffffff',
    fontWeight: '600',
  },

  skipButton: {
  width: 65,
  height: 65,
  justifyContent: 'center',
  alignItems: 'center',
},

  skipText: {
  fontSize: 36,
  lineHeight: 36,
  color: '#208AEF',
},

  playButton: {
  width: 68,
  height: 68,
  borderRadius: 34,
  backgroundColor: '#208AEF',
  justifyContent: 'center',
  alignItems: 'center',
},

  playIcon: {
  color: '#ffffff',
  fontSize: 28,
  fontWeight: 'bold',
},

  favoriteIcon: {
  fontSize: 36,
  color: '#208AEF',
},
});