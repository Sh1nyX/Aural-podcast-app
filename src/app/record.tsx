import { StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';

import RecordButton from '@/components/RecordButton';
import { useRecorder } from '@/hooks/useRecorder';
import { getRecordings, saveRecordings } from '@/services/recordingStorage';
import { Recording } from '@/types/recording';

function formatDate(date: Date) {
  return date.toLocaleDateString('uk-UA');
}

export default function RecordScreen() {
  const {
    isRecording,
    recordingTime,
    startRecording,
    stopRecording,
  } = useRecorder();

  const handleRecordPress = async () => {
    if (!isRecording) {
      await startRecording();
      return;
    }

    const result = await stopRecording();

    if (!result.uri) {
      return;
    }

    const recordings = await getRecordings();

    const newRecording: Recording = {
      id: Date.now().toString(),
      name: `Запис ${recordings.length + 1}`,
      date: formatDate(new Date()),
      duration: result.duration,
      category: 'Без категорії',
      uri: result.uri,
    };

    const updatedRecordings = [
      newRecording,
        ...recordings,
    ];

    await saveRecordings(updatedRecordings);

    router.back();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Новий запис
      </Text>

      <Text style={styles.timer}>
        {Math.floor(recordingTime / 60)
          .toString()
          .padStart(2, '0')}
        :
        {(recordingTime % 60)
          .toString()
          .padStart(2, '0')}
      </Text>

      <RecordButton
        isRecording={isRecording}
        onPress={handleRecordPress}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#0F1110',
  },

  title: {
    fontSize: 26,
    fontWeight: '600',
    marginBottom: 35,
    color: '#F1F3F1',
  },

  timer: {
    fontSize: 56,
    fontWeight: '500',
    marginBottom: 45,
    color: '#5CCF7A',
    fontVariant: ['tabular-nums'],
  },
});