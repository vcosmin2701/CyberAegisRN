import { StyleSheet, View, Text } from 'react-native';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={{ color: 'white' }}>Pagina Principală</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#091353',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
