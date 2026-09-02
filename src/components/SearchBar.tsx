import { StyleSheet, TextInput } from 'react-native';

type SearchBarProps = {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
};

export default function SearchBar({
  value,
  onChangeText,
  placeholder = 'Пошук записів...',
}: SearchBarProps) {
  return (
    <TextInput
      style={styles.input}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor="#777F79"
    />
  );
}

const styles = StyleSheet.create({
  input: {
    height: 44,
    paddingHorizontal: 14,
    marginBottom: 15,
    borderRadius: 10,
    backgroundColor: '#181C19',
    borderWidth: 1,
    borderColor: '#292E2A',
    color: '#F1F3F1',
    fontSize: 15,
  },
});