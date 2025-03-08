import React from 'react';
import styles from '../../app/styles/indexStyle';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Link, useRouter } from 'expo-router';

export default function HomeScreen() {
  const router = useRouter();
  // Mock user data - replace with real data later
  const userData = {
    username: 'CyberHero123',
    xp: 1250,
    currentLesson: 'Network Security Basics',
    lessonProgress: 60,
  };

  const handleProfilePress = () => {
    router.push('/(tabs)/profile');
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
            <TouchableOpacity style={styles.profileButton} onPress={handleProfilePress}>
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

        {/* Main Game Buttons */}
        <View style={styles.gameButtonsContainer}>
          <TouchableOpacity style={styles.mainGameButton}>
            <View style={styles.mainGameContent}>
              <Text style={styles.mainGameTitle}>🎮 Start Platformer Game</Text>
              <Text style={styles.mainGameSubtitle}>Begin Your Cyber Adventure</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.mainGameButton}>
            <View style={styles.mainGameContent}>
              <Text style={styles.mainGameTitle}>🥼 Alex's Lab</Text>
              <Text style={styles.mainGameSubtitle}>See the results of Alex's experiments</Text>
            </View>
          </TouchableOpacity>
        </View>

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
          <Link href="../minigames/minigames" asChild>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionButtonText}>Minigames 🎲</Text>
            </TouchableOpacity>
          </Link>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonText}>Shop 🛍️</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
;
