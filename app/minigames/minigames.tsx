import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Link } from 'expo-router';

export default function MinigamesScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Minigames</Text>
      <View style={styles.gamesContainer}>
        <Link href="/minigames/password-game" asChild>
          <TouchableOpacity style={styles.gameButton}>
            <View style={styles.gameContent}>
              <Text style={styles.gameIcon}>🔒</Text>
              <Text style={styles.gameTitle}>Password Game</Text>
              <Text style={styles.gameDescription}>Învață să creezi parole puternice</Text>
            </View>
          </TouchableOpacity>
        </Link>

        <Link href="/minigames/chat-safety-game" asChild>
          <TouchableOpacity style={styles.gameButton}>
            <View style={styles.gameContent}>
              <Text style={styles.gameIcon}>💬</Text>
              <Text style={styles.gameTitle}>Chat Safety Game</Text>
              <Text style={styles.gameDescription}>Protejează-ți informațiile personale</Text>
            </View>
          </TouchableOpacity>
        </Link>

        <Link href="/minigames/ad-detector-game" asChild>
          <TouchableOpacity style={styles.gameButton}>
            <View style={styles.gameContent}>
              <Text style={styles.gameIcon}>🎣</Text>
              <Text style={styles.gameTitle}>Phishing Game</Text>
              <Text style={styles.gameDescription}>Identifică emailurile periculoase</Text>
            </View>
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );
}

const windowWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#BFD7ED',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#003B73',
    textAlign: 'center',
    marginVertical: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  gamesContainer: {
    gap: 20,
  },
  gameButton: {
    backgroundColor: '#0074B7',
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: '#60A3D9',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  gameContent: {
    alignItems: 'center',
  },
  gameIcon: {
    fontSize: 40,
    marginBottom: 10,
  },
  gameTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#BFD7ED',
    marginBottom: 8,
    textAlign: 'center',
  },
  gameDescription: {
    fontSize: 16,
    color: '#60A3D9',
    textAlign: 'center',
  },
}); 