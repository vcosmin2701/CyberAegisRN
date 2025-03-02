import { StyleSheet, View, Text } from 'react-native';

export default function ExploreScreen() {
  return (
    <View style={styles.container}>
      <Text style={{ color: 'white' }}>Explorează</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
