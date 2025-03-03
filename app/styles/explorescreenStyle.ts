import { StyleSheet } from 'react-native';
export const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#BFD7ED',
    },
    content: {
      flex: 1,
      padding: 16,
    },
    title: {
      fontSize: 32,
      fontWeight: 'bold',
      color: '#003B73',
      marginBottom: 24,
    },
    subjectsGrid: {
      flex: 1,
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 16,
    },
  })