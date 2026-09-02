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
        {isRecording ? 'Зупинити запис' : 'Почати запис'}
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
    backgroundColor: '#4CAF6A',
  },

  recordingButton: {
    backgroundColor: '#202521',
    borderWidth: 2,
    borderColor: '#5CCF7A',
  },

  text: {
    color: '#0F1110',
    fontSize: 18,
    fontWeight: '600',
  },

  recordingText: {
    color: '#5CCF7A',
  },
});