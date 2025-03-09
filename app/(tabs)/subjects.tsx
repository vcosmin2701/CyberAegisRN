import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Stack } from 'expo-router';
import exploreScreenStyles from '../styles/explorescreenStyle';
import * as ScreenOrientation from 'expo-screen-orientation';

interface Module {
  id: string;
  title: string;
  chapters: Chapter[];
}

interface Chapter {
  id: string;
  title: string;
  description: string;
}

const sampleModules: Module[] = [
  {
    id: '1',
    title: 'Modulul I – Siguranta Online pentru Copii',
    chapters: [
      {
        id: '1-1',
        title:
          'Capitolul 1: Parolele - Supereroii care ne protejează conturile!',
        description:
          'Cum să fii în siguranță pe internet! Învață despre parole puternice.',
      },
      {
        id: '1-2',
        title: 'Types of Cyber Threats',
        description: 'Understanding different types of cyber threats',
      },
      {
        id: '1-3',
        title: 'Basic Security Principles',
        description: 'Fundamental principles of information security',
      },
    ],
  },
  {
    id: '2',
    title: 'Introduction to Cybersecurity',
    chapters: [
      {
        id: '2-1',
        title: 'What is Cybersecurity?',
        description: 'Learn the basics of cybersecurity and its importance',
      },
      {
        id: '2-2',
        title: 'Types of Cyber Threats',
        description: 'Understanding different types of cyber threats',
      },
      {
        id: '2-3',
        title: 'Basic Security Principles',
        description: 'Fundamental principles of information security',
      },
    ],
  },
  {
    id: '3',
    title: 'Network Security',
    chapters: [
      {
        id: '3-1',
        title: 'Network Fundamentals',
        description: 'Understanding network basics and protocols',
      },
      {
        id: '3-2',
        title: 'Firewalls and IDS',
        description: 'Network security devices and their functions',
      },
    ],
  },
];

export default function SubjectsScreen() {
  useEffect(() => {
    const lockOrientation = async () => {
      await ScreenOrientation.lockAsync(
        ScreenOrientation.OrientationLock.LANDSCAPE_LEFT
      );
    };
    lockOrientation();

    return () => {
      ScreenOrientation.unlockAsync();
    };
  }, []);

  const router = useRouter();
  const [expandedModule, setExpandedModule] = useState<string | null>(null);

  const toggleModule = (moduleId: string) => {
    setExpandedModule(expandedModule === moduleId ? null : moduleId);
  };

  const renderChapter = ({ item }: { item: Chapter }) => (
    <TouchableOpacity
      style={styles.chapterItem}
      onPress={() => {
        router.push({
          pathname: '/lessonsComponent/ChapterContent',
          params: {
            id: item.id,
            title: item.title,
            description: item.description,
          },
        } as any);
      }}
    >
      <Text style={styles.chapterTitle}>{item.title}</Text>
      <Text style={styles.chapterDescription}>{item.description}</Text>
    </TouchableOpacity>
  );

  const renderModule = ({ item }: { item: Module }) => (
    <View style={styles.moduleContainer}>
      <TouchableOpacity
        style={styles.moduleHeader}
        onPress={() => toggleModule(item.id)}
      >
        <Text style={styles.moduleTitle}>{item.title}</Text>
        <Text style={styles.moduleIndicator}>
          {expandedModule === item.id ? '▼' : '▶'}
        </Text>
      </TouchableOpacity>
      {expandedModule === item.id && (
        <FlatList
          data={item.chapters}
          renderItem={renderChapter}
          keyExtractor={(chapter) => chapter.id}
          style={styles.chaptersList}
        />
      )}
    </View>
  );

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView style={exploreScreenStyles.container}>
        <View style={exploreScreenStyles.content}>
          <Text style={exploreScreenStyles.title}>Learning Modules</Text>
          <FlatList
            data={sampleModules}
            renderItem={renderModule}
            keyExtractor={(module) => module.id}
            style={styles.modulesList}
          />
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  modulesList: {
    flex: 1,
  },
  moduleContainer: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  moduleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  moduleTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  moduleIndicator: {
    fontSize: 16,
    color: '#666',
  },
  chaptersList: {
    backgroundColor: '#f9f9f9',
  },
  chapterItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  chapterTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#444',
    marginBottom: 4,
  },
  chapterDescription: {
    fontSize: 14,
    color: '#666',
  },
});
