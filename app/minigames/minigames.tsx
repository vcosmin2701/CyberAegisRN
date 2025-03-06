import React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { styles } from '../styles/minigamesStyle';

const games = [
  {
    id: 'detective',
    title: 'Eroul Siguranței Online',
    description: 'Rezolvă cazurile de siguranță online ca un detectiv digital!',
    icon: 'search',
    color: '#4CAF50',
    path: '/minigames/detective-game' as const
  },
  {
    id: 'block',
    title: 'Blochează și Protejează',
    description: 'Protejează-ți prietenii de mesajele negative în acest joc de reflexe!',
    icon: 'shield',
    color: '#FFA500',
    path: '/minigames/block-game' as const
  },
  {
    id: 'board',
    title: 'Aventură în Siguranța Online',
    description: 'Navighează prin provocările internetului într-un joc de tip board-game!',
    icon: 'gamepad',
    color: '#FF4444',
    path: '/minigames/board-game' as const
  },
  {
    id: 'chat',
    title: 'Chat în Siguranță',
    description: 'Învață cum să te protejezi în conversațiile online!',
    icon: 'comments',
    color: '#2196F3',
    path: '/minigames/chat-safety-game' as const
  },
  {
    id: 'password',
    title: 'Jocul Parolelor',
    description: 'Învață cum să creezi parole puternice și să le păstrezi în siguranță!',
    icon: 'lock',
    color: '#9C27B0',
    path: '/minigames/password-game' as const
  },
  {
    id: 'ad-detector',
    title: 'Detectorul de Reclame',
    description: 'Învață să identifici și să eviți reclamele înșelătoare online!',
    icon: 'ban',
    color: '#E91E63',
    path: '/minigames/ad-detector-game' as const
  }
];

export default function MinigamesScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Minigame-uri</Text>
        <Text style={styles.subtitle}>Învață despre siguranța online prin joc!</Text>

        <ScrollView style={styles.gamesContainer}>
          {games.map((game) => (
            <Link key={game.id} href={game.path} asChild>
              <TouchableOpacity style={styles.gameCard}>
                <View style={[styles.iconContainer, { backgroundColor: game.color }]}>
                  <FontAwesome name={game.icon as any} size={30} color="#FFFFFF" />
                </View>
                <View style={styles.gameInfo}>
                  <Text style={styles.gameTitle}>{game.title}</Text>
                  <Text style={styles.gameDescription}>{game.description}</Text>
                </View>
                <FontAwesome name="chevron-right" size={20} color="#8BA5B0" />
              </TouchableOpacity>
            </Link>
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
} 