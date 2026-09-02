import { useEffect, useState } from 'react';
import {
  AudioModule,
  RecordingPresets,
  setAudioModeAsync,
  useAudioRecorder,
  useAudioRecorderState,
} from 'expo-audio';

export function useRecorder() {
  const recorder = useAudioRecorder({
    ...RecordingPresets.HIGH_QUALITY,
    directory: 'document',
  });

  const recorderState = useAudioRecorderState(recorder);

  const [recordingTime, setRecordingTime] = useState(0);

  useEffect(() => {
    const requestPermission = async () => {
      const status =
        await AudioModule.requestRecordingPermissionsAsync();

      if (!status.granted) {
        console.log('Microphone permission denied');
        return;
      }

      await setAudioModeAsync({
        playsInSilentMode: true,
        allowsRecording: true,
      });
    };

    requestPermission();
  }, []);

  useEffect(() => {
    if (!recorderState.isRecording) {
      return;
    }

    const interval = setInterval(() => {
      setRecordingTime((time) => time + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [recorderState.isRecording]);

  const startRecording = async () => {
    setRecordingTime(0);

    await recorder.prepareToRecordAsync();
    recorder.record();
  };

  const stopRecording = async () => {
    const duration = recordingTime;

    await recorder.stop();

    console.log('Recording URI:', recorder.uri);

    return {
      uri: recorder.uri,
      duration,
    };
  };

  return {
    isRecording: recorderState.isRecording,
    recordingTime,
    startRecording,
    stopRecording,
    recordingUri: recorder.uri,
  };
}