import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import { Link } from 'expo-router';

export default function HomeScreen() {
  return (
    <ScrollView style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>CyberAegis</Text>
        <Text style={styles.headerSubtitle}>Learn Cybersecurity Through Play</Text>
      </View>

      {/* Main Game Button */}
      <TouchableOpacity style={styles.mainGameButton}>
        <View style={styles.mainGameContent}>
          <Text style={styles.mainGameTitle}>🎮 Main Adventure</Text>
          <Text style={styles.mainGameSubtitle}>Start Your Cyber Journey</Text>
        </View>
      </TouchableOpacity>

      {/* Daily Check-in */}
      <View style={styles.dailyCheckIn}>
        <Text style={styles.sectionTitle}>Daily Check-in</Text>
        <View style={styles.checkInContainer}>
          <View style={styles.dayBox}>
            <Text style={styles.dayNumber}>1</Text>
            <View style={[styles.checkMark, styles.checked]}>✓</View>
          </View>
          <View style={styles.dayBox}>
            <Text style={styles.dayNumber}>2</Text>
            <View style={[styles.checkMark, styles.checked]}>✓</View>
          </View>
          <View style={styles.dayBox}>
            <Text style={styles.dayNumber}>3</Text>
            <View style={styles.checkMark}>?</View>
          </View>
          <View style={styles.dayBox}>
            <Text style={styles.dayNumber}>4</Text>
            <View style={styles.checkMark}>?</View>
          </View>
          <View style={styles.dayBox}>
            <Text style={styles.dayNumber}>5</Text>
            <View style={styles.checkMark}>?</View>
          </View>
        </View>
      </View>

      {/* Lessons Button */}
      <TouchableOpacity style={styles.lessonButton}>
        <Text style={styles.buttonText}>📚 Cybersecurity Lessons</Text>
        <Text style={styles.progressText}>Progress: 2/10</Text>
      </TouchableOpacity>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navButton}>
          <Text style={styles.navButtonText}>🎲 Minigames</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton}>
          <Text style={styles.navButtonText}>📖 Switch Subjects</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#091353',
  },
  header: {
    padding: 20,
    alignItems: 'center',
    marginTop: 20,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#FFF',
    opacity: 0.8,
  },
  mainGameButton: {
    backgroundColor: '#1A237E',
    margin: 20,
    borderRadius: 15,
    padding: 20,
    elevation: 5,
    borderWidth: 2,
    borderColor: '#4A90E2',
  },
  mainGameContent: {
    alignItems: 'center',
  },
  mainGameTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 8,
  },
  mainGameSubtitle: {
    fontSize: 16,
    color: '#4A90E2',
  },
  dailyCheckIn: {
    margin: 20,
    backgroundColor: '#1A237E',
    borderRadius: 15,
    padding: 20,
    borderWidth: 2,
    borderColor: '#4A90E2',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 15,
  },
  checkInContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dayBox: {
    alignItems: 'center',
    gap: 8,
  },
  dayNumber: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  checkMark: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#1A237E',
    borderWidth: 2,
    borderColor: '#4A90E2',
    justifyContent: 'center',
    alignItems: 'center',
    color: '#FFF',
  },
  checked: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  lessonButton: {
    backgroundColor: '#1A237E',
    margin: 20,
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#4A90E2',
  },
  buttonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 8,
  },
  progressText: {
    fontSize: 14,
    color: '#4A90E2',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 20,
    marginTop: 'auto',
  },
  navButton: {
    backgroundColor: '#1A237E',
    flex: 1,
    margin: 5,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#4A90E2',
  },
  navButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
