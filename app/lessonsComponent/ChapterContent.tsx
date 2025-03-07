import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';

// Define chapter content
const chapterContents = {
  '1-1': {
    sections: [
      {
        title: 'Ce este o parolă și de ce este importantă?',
        content: [
          'O parolă este un cod secret pe care îl folosim pentru a proteja conturile noastre online. Este ca un gard invizibil care ține hoții departe de informațiile noastre personale.',
          'Imaginează-ți că parola ta este cheia casei tale. Dacă o faci prea simplă, oricine poate intra! Dar dacă e puternică, doar TU vei putea deschide ușa contului tău.'
        ]
      },
      {
        title: 'Cum să îți faci o parolă SUPER SIGURĂ!',
        content: [
          '• Să fie LUNGĂ – cel puțin 8-12 caractere.',
          '• Să conțină litere mari și mici – "A" și "a" fac diferența.',
          '• Să includă cifre și simboluri – "P@ssw0rd!2024" este mai sigur decât "parola123".',
          '• Să fie ușor de reținut pentru tine, dar greu de ghicit pentru alții!'
        ]
      },
      {
        title: 'Cum să-ți amintești parolele?',
        content: [
          '• Poți folosi o frază ușor de reținut, de exemplu:',
          '• "MereleVerzi!Sunt12Bune"',
          '• Nu scrie parola pe hârtie sau în telefon într-un loc ușor de găsit.',
          '• Nu împărtăși parola nimănui, nici măcar prietenilor!',
          '',
          'Truc: Folosește o propoziție pe care doar tu o știi!',
          'Exemplu: "ImiPlAcMereleVerzi!22" – Ușor de ținut minte, dar greu de ghicit!',
          'NU spune nimănui parola ta! Nici măcar celui mai bun prieten.'
        ]
      },
      {
        title: 'Cum să NU îți faci parola',
        content: [
          '• Nu folosi parole scurte – "12345" sau "parola" sunt foarte ușor de ghicit!',
          '• Nu folosi numele tău sau data de naștere – Dacă cineva știe cum te cheamă, poate încerca asta.',
          '• Nu folosi aceeași parolă peste tot – Dacă cineva o află, îți poate accesa toate conturile!'
        ]
      }
    ]
  }
  // Add more chapter contents here as needed
};

export default function ChapterContent() {
  const params = useLocalSearchParams();
  const { id, title, description } = params;
  const chapterId = id as string;
  
  // Get chapter content if available
  const chapterContent = chapterContents[chapterId as keyof typeof chapterContents];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>{title as string}</Text>
        <Text style={styles.description}>{description as string}</Text>
        
        {chapterContent ? (
          // Display structured content if available
          chapterContent.sections.map((section, index) => (
            <View key={index} style={styles.section}>
              <Text style={styles.sectionTitle}>{section.title}</Text>
              {section.content.map((paragraph, pIndex) => (
                <Text key={pIndex} style={styles.sectionText}>
                  {paragraph}
                </Text>
              ))}
            </View>
          ))
        ) : (
          // Default content if no specific content is available
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Content</Text>
            <Text style={styles.sectionText}>
              This is where you can add the actual content for each chapter.
              You can include text, images, videos, or interactive elements.
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
  },
  section: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#444',
    marginBottom: 12,
  },
  sectionText: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
    marginBottom: 8,
  },
}); 