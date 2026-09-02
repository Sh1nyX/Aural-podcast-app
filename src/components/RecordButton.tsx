import { Pressable, StyleSheet, Text } from 'react-native';

type RecordButtonProps = {
  isRecording: boolean;
  onPress: () => void;
};

export default function RecordButton({
  isRecording,
  onPress,
}: RecordButtonProps) {
  return (
    <Pressable
      style={[
        styles.button,
        isRecording && styles.recordingButton,
      ]}
      onPress={onPress}
    >
      <Text style={styles.text}>
        {isRecording ? 'Остановить запись' : 'Начать запись'}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 220,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#208AEF',
  },

  recordingButton: {
    backgroundColor: '#D32F2F',
  },

  text: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
});