import { StyleSheet, View, Text, ScrollView } from 'react-native';
import exploreScreenStyles from '../styles/explorescreenStyle';

export default function ExploreScreen() {
  return (
    <ScrollView style={exploreScreenStyles.container}>
      <View style={exploreScreenStyles.content}>
        <Text style={exploreScreenStyles.title}>Explorează</Text>
        <View style={exploreScreenStyles.subjectsGrid}>
          {/* Add your subject items here */}
        </View>
      </View>
    </ScrollView>
  );
}
