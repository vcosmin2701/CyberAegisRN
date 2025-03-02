import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
} from 'react-native';
import { Link } from 'expo-router';

const { width } = Dimensions.get('window');
const cardWidth = width * 0.9; // 90% of screen width

export default function HomeScreen() {
  // Mock user data - replace with real data later
  const userData = {
    username: 'CyberHero123',
    xp: 1250,
    currentLesson: 'Network Security Basics',
    lessonProgress: 60,
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.contentContainer}>
        {/* Header with Profile */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>CyberAegis</Text>
          <View style={styles.profileSection}>
            <View style={styles.profileInfo}>
              <Text style={styles.username}>{userData.username}</Text>
              <View style={styles.xpContainer}>
                <Text style={styles.xpText}>XP: {userData.xp}</Text>
                <View style={styles.xpBar}>
                  <View style={[styles.xpProgress, { width: `${userData.lessonProgress}%` }]} />
                </View>
              </View>
            </View>
            <TouchableOpacity style={styles.profileButton}>
              <Text style={styles.profileButtonText}>👤</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Current Lesson Status */}
        <View style={styles.currentLessonCard}>
          <Text style={styles.sectionTitle}>Current Lesson 📚</Text>
          <Text style={styles.lessonTitle}>{userData.currentLesson}</Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${userData.lessonProgress}%` }]} />
          </View>
          <Text style={styles.progressText}>{userData.lessonProgress}% Complete</Text>
          <TouchableOpacity style={styles.continueButton}>
            <Text style={styles.continueButtonText}>Continue Learning</Text>
          </TouchableOpacity>
        </View>

        {/* Main Game Button */}
        <TouchableOpacity style={styles.mainGameButton}>
          <View style={styles.mainGameContent}>
            <Text style={styles.mainGameTitle}>🎮 Start Platformer Game</Text>
            <Text style={styles.mainGameSubtitle}>Begin Your Cyber Adventure</Text>
          </View>
        </TouchableOpacity>

        {/* Alex's Lab Button */}
        <TouchableOpacity style={styles.mainGameButton}>
          <View style={styles.mainGameContent}>
            <Text style={styles.mainGameTitle}>🥼 Alex's Lab</Text>
            <Text style={styles.mainGameSubtitle}>See the results of Alex's experiments</Text>
          </View>
        </TouchableOpacity>

        {/* Daily Check-in */}
        <View style={styles.dailyCheckIn}>
          <Text style={styles.sectionTitle}>Daily Rewards 🎁</Text>
          <View style={styles.checkInContainer}>
            {[1, 2, 3, 4, 5].map((day) => (
              <View key={day} style={styles.dayBox}>
                <Text style={styles.dayNumber}>{day}</Text>
                <View style={[styles.checkMark, day <= 2 && styles.checked]}>
                  <Text style={styles.checkMarkText}>{day <= 2 ? '✓' : '?'}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Quick Actions Grid */}
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonText}>Minigames 🎲</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonText}>Shop 🛍️</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#BFD7ED', // Baby Blue
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  header: {
    flex: 1,
    backgroundColor: '#003B73', // Navy Blue
    padding: 16,
    paddingTop: 48,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#BFD7ED', // Baby Blue
    marginBottom: 16,
  },
  profileSection: {
    flexDirection: 'row',
    backgroundColor: '#0074B7', // Royal Blue
    padding: 16,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#60A3D9', // Blue Grotto
  },
  profileInfo: {
    flex: 1,
    marginRight: 16,
  },
  username: {
    color: '#BFD7ED', // Baby Blue
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  xpContainer: {
    flex: 1,
  },
  xpText: {
    color: '#60A3D9', // Blue Grotto
    fontSize: 14,
    marginBottom: 4,
  },
  xpBar: {
    height: 6,
    backgroundColor: '#003B73', // Navy Blue
    borderRadius: 3,
    overflow: 'hidden',
  },
  xpProgress: {
    height: '100%',
    backgroundColor: '#60A3D9', // Blue Grotto
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#60A3D9', // Blue Grotto
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileButtonText: {
    fontSize: 20,
  },
  currentLessonCard: {
    flex: 1,
    backgroundColor: '#0074B7', // Royal Blue
    borderRadius: 16,
    padding: 16,
    marginVertical: 16,
    borderWidth: 2,
    borderColor: '#60A3D9', // Blue Grotto
    elevation: 5,
  },
  lessonTitle: {
    color: '#BFD7ED', // Baby Blue
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#003B73', // Navy Blue
    borderRadius: 4,
    overflow: 'hidden',
    marginVertical: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#60A3D9', // Blue Grotto
  },
  progressText: {
    color: '#BFD7ED', // Baby Blue
    fontSize: 14,
    marginBottom: 16,
  },
  continueButton: {
    backgroundColor: '#003B73', // Navy Blue
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  continueButtonText: {
    color: '#BFD7ED', // Baby Blue
    fontSize: 16,
    fontWeight: 'bold',
  },
  mainGameButton: {
    flex: 1,
    backgroundColor: '#0074B7', // Royal Blue
    borderRadius: 16,
    padding: 16,
    marginVertical: 8,
    borderWidth: 2,
    borderColor: '#60A3D9', // Blue Grotto
    elevation: 5,
  },
  mainGameContent: {
    alignItems: 'center',
  },
  mainGameTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#BFD7ED', // Baby Blue
    marginBottom: 8,
    textAlign: 'center',
  },
  mainGameSubtitle: {
    fontSize: 16,
    color: '#60A3D9', // Blue Grotto
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#BFD7ED', // Baby Blue
    marginBottom: 16,
  },
  dailyCheckIn: {
    flex: 1,
    backgroundColor: '#0074B7', // Royal Blue
    borderRadius: 16,
    padding: 16,
    marginVertical: 16,
    borderWidth: 2,
    borderColor: '#60A3D9', // Blue Grotto
    elevation: 5,
  },
  checkInContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dayBox: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  dayNumber: {
    color: '#BFD7ED', // Baby Blue
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  checkMark: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#003B73', // Navy Blue
    borderWidth: 2,
    borderColor: '#60A3D9', // Blue Grotto
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkMarkText: {
    color: '#BFD7ED', // Baby Blue
    fontSize: 16,
    fontWeight: 'bold',
  },
  checked: {
    backgroundColor: '#60A3D9', // Blue Grotto
  },
  quickActions: {
    flexDirection: 'row',
    marginVertical: 16,
    gap: 16,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#0074B7', // Royal Blue
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#60A3D9', // Blue Grotto
    elevation: 5,
  },
  actionButtonText: {
    color: '#BFD7ED', // Baby Blue
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
