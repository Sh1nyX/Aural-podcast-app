import Slider from '@react-native-community/slider';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {
  useAudioPlayer,
  useAudioPlayerStatus,
} from 'expo-audio';

type AudioPlayerProps = {
  uri: string;
};

function formatTime(seconds: number) {
  const totalSeconds = Math.floor(seconds);

  const minutes = Math.floor(totalSeconds / 60);
  const remainingSeconds = totalSeconds % 60;

  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds
    .toString()
    .padStart(2, '0')}`;
}

export default function AudioPlayer({
  uri,
}: AudioPlayerProps) {
  const player = useAudioPlayer(uri, {
    updateInterval: 100,
  });

  const status = useAudioPlayerStatus(player);

  const handlePlayPause = () => {
    if (status.playing) {
      player.pause();
    } else {
      player.play();
    }
  };

  const handleSeek = async (value: number) => {
    await player.seekTo(value);
  };

  return (
    <View style={styles.container}>

      <View style={styles.playerRow}>

        <Pressable
          style={styles.playButton}
          onPress={handlePlayPause}
        >
          <Text style={styles.playIcon}>
            {status.playing ? 'Ⅱ' : '▶'}
          </Text>
        </Pressable>

        <View style={styles.sliderContainer}>

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
            onSlidingComplete={handleSeek}
            minimumTrackTintColor="#4CAF6A"
            maximumTrackTintColor="#343A35"
            thumbTintColor="#4CAF6A"
          />

        </View>

      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
  },

  playerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  playButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#4CAF6A',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },

  playIcon: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },

  sliderContainer: {
    flex: 1,
  },

  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  time: {
    fontSize: 11,
    color: '#777777',
  },

  slider: {
    width: '100%',
    height: 35,
  },
});