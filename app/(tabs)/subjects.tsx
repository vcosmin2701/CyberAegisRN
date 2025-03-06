import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { styles } from '../styles/explorescreenStyle';

export default function ExploreScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Explorează</Text>
        <View style={styles.subjectsGrid}>
          {/* Add your subject items here */}
        </View>
      </View>
    </ScrollView>
  );
};
