import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';

// Get screen dimensions
const { width } = Dimensions.get('window');

// Define the Level interface
interface Level {
  id: string;
  title: string;
  description: string;
  locked?: boolean;
}

// Sample levels data
const levels: Level[] = [
  {
    id: '1',
    title: 'Nivelul 1: Baze',
    description: 'Navighează prin jocul platformer și îndepărtează amenințările malware.',
    locked: false,
  },
  {
    id: '2',
    title: 'Nivelul 2: Apararea rețelei',
    description: 'Protejează rețeaua ta de atacuri cyber.',
    locked: true,
  },
  {
    id: '3',
    title: 'Nivelul 3: Protecția parolelor',
    description: 'Învață cum să creezi și să gestionezi parolele securizate.',
    locked: true,
  },
];

const LevelSelector: React.FC = () => {
  const router = useRouter();

  const handleLevelSelect = (level: Level) => {
    if (level.locked) {
      // Show locked level message
      return;
    }
    
    // Navigate to the selected level
    if (level.id === '1') {
      // Use index-based navigation instead of path-based
      router.navigate({
        pathname: "/(tabs)/PlatformerGame"
      });
    }
  };

  const renderLevelItem = ({ item }: { item: Level }) => (
    <TouchableOpacity
      style={[
        styles.levelCard,
        item.locked ? styles.lockedLevel : styles.unlockedLevel,
      ]}
      onPress={() => handleLevelSelect(item)}
      disabled={item.locked}
    >
      <View style={styles.levelContent}>
        <Text style={styles.levelTitle}>{item.title}</Text>
        <Text style={styles.levelDescription}>{item.description}</Text>
        {item.locked && (
          <View style={styles.lockedOverlay}>
            <Text style={styles.lockedText}>🔒 Locked</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Nivele</Text>
        <Text style={styles.headerSubtitle}>
          Completează nivelele pentru a deveni un expert în securitatea informației!
        </Text>
      </View>

      <FlatList
        data={levels}
        renderItem={renderLevelItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.levelList}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f2f5',
  },
  header: {
    padding: 20,
    backgroundColor: '#2c3e50',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#ecf0f1',
  },
  levelList: {
    padding: 15,
  },
  levelCard: {
    borderRadius: 10,
    marginBottom: 15,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  levelContent: {
    padding: 20,
    position: 'relative',
  },
  unlockedLevel: {
    backgroundColor: '#3498db',
  },
  lockedLevel: {
    backgroundColor: '#7f8c8d',
  },
  levelTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  levelDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  lockedOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  lockedText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default LevelSelector; 