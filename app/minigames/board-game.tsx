import React, { useState } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, Animated } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { styles } from '../styles/boardGameStyle';

interface Challenge {
  id: number;
  text: string;
  options: {
    text: string;
    isCorrect: boolean;
    points: number;
    feedback: string;
  }[];
}

const challenges: Challenge[] = [
  {
    id: 1,
    text: "Ai primit un mesaj ciudat de la cineva necunoscut. Ce faci?",
    options: [
      {
        text: "Răspund și încep o conversație",
        isCorrect: false,
        points: -10,
        feedback: "Nu este sigur să vorbești cu necunoscuți online!"
      },
      {
        text: "Blochez și raportez profilul",
        isCorrect: true,
        points: 20,
        feedback: "Excelent! Ai făcut alegerea corectă pentru siguranța ta!"
      },
      {
        text: "Trimit mai departe la prieteni",
        isCorrect: false,
        points: -5,
        feedback: "Nu trimite niciodată mesaje suspecte mai departe!"
      }
    ]
  },
  {
    id: 2,
    text: "Un site îți cere parola pentru a verifica contul. Ce faci?",
    options: [
      {
        text: "Ofer parola pentru că pare oficial",
        isCorrect: false,
        points: -15,
        feedback: "Niciodată să nu oferi parola ta, chiar dacă site-ul pare oficial!"
      },
      {
        text: "Verific URL-ul și contactez suportul",
        isCorrect: true,
        points: 25,
        feedback: "Foarte bine! Ai verificat legitimitatea cererii!"
      },
      {
        text: "Ignor mesajul",
        isCorrect: true,
        points: 15,
        feedback: "Bună alegere! Este mai bine să ignori cereri suspecte!"
      }
    ]
  },
  {
    id: 3,
    text: "Un prieten îți trimite un link pentru un joc nou. Ce faci?",
    options: [
      {
        text: "Deschid direct pentru că e de la prieten",
        isCorrect: false,
        points: -10,
        feedback: "Chiar și link-urile de la prieteni pot fi periculoase!"
      },
      {
        text: "Verific URL-ul și cer confirmare",
        isCorrect: true,
        points: 20,
        feedback: "Excelent! Ai verificat legitimitatea link-ului!"
      },
      {
        text: "Trimit mai departe la alți prieteni",
        isCorrect: false,
        points: -5,
        feedback: "Nu trimite niciodată link-uri mai departe fără verificare!"
      }
    ]
  }
];

const BOARD_SIZE = 36;

export default function BoardGame() {
  const [position, setPosition] = useState(0);
  const [score, setScore] = useState(0);
  const [showChallenge, setShowChallenge] = useState(false);
  const [currentChallenge, setCurrentChallenge] = useState<Challenge | null>(null);
  const [gameOver, setGameOver] = useState(false);
  const [diceValue, setDiceValue] = useState(0);
  const [diceAnim] = useState(new Animated.Value(0));

  const rollDice = () => {
    const newValue = Math.floor(Math.random() * 6) + 1;
    setDiceValue(newValue);
    
    Animated.sequence([
      Animated.timing(diceAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(diceAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      const newPosition = position + newValue;
      if (newPosition >= BOARD_SIZE) {
        setGameOver(true);
      } else {
        setPosition(newPosition);
        if (newPosition % 5 === 0) {
          const randomChallenge = challenges[Math.floor(Math.random() * challenges.length)];
          setCurrentChallenge(randomChallenge);
          setShowChallenge(true);
        }
      }
    });
  };

  const handleOptionSelect = (option: { points: number; feedback: string }) => {
    setScore(score + option.points);
    setShowChallenge(false);
    setCurrentChallenge(null);
  };

  const resetGame = () => {
    setPosition(0);
    setScore(0);
    setGameOver(false);
    setShowChallenge(false);
    setCurrentChallenge(null);
  };

  const renderBoard = () => {
    const cells = [];
    for (let i = 0; i < BOARD_SIZE; i++) {
      const isActive = i === position;
      const isVisited = i < position;
      cells.push(
        <View
          key={i}
          style={[
            styles.cell,
            isActive && styles.cellActive,
            isVisited && styles.cellVisited
          ]}
        >
          <Text style={styles.cellText}>{i + 1}</Text>
        </View>
      );
    }
    return cells;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Aventură în Siguranța Online</Text>
        <Text style={styles.subtitle}>Navighează prin provocările internetului!</Text>

        <View style={styles.playerInfo}>
          <View style={styles.playerCard}>
            <Text style={styles.playerName}>Scor</Text>
            <Text style={styles.playerScore}>{score}</Text>
          </View>
          <View style={styles.playerCard}>
            <Text style={styles.playerName}>Poziție</Text>
            <Text style={styles.playerScore}>{position + 1}/{BOARD_SIZE}</Text>
          </View>
        </View>

        <View style={styles.boardContainer}>
          <View style={styles.boardGrid}>
            {renderBoard()}
          </View>
        </View>

        <View style={styles.diceContainer}>
          <TouchableOpacity
            style={styles.diceButton}
            onPress={rollDice}
            disabled={showChallenge || gameOver}
          >
            <Text style={styles.diceButtonText}>
              {diceValue ? `Zar: ${diceValue}` : 'Aruncă zarul'}
            </Text>
          </TouchableOpacity>
        </View>

        {showChallenge && currentChallenge && (
          <View style={styles.challengeCard}>
            <Text style={styles.challengeText}>{currentChallenge.text}</Text>
            <View style={styles.optionsContainer}>
              {currentChallenge.options.map((option, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.optionButton}
                  onPress={() => handleOptionSelect(option)}
                >
                  <Text style={styles.optionText}>{option.text}</Text>
                  <FontAwesome
                    name={option.isCorrect ? "check-circle" : "times-circle"}
                    size={24}
                    color={option.isCorrect ? "#4CAF50" : "#FF4444"}
                  />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {gameOver && (
          <View style={styles.gameOverContainer}>
            <View style={styles.gameOverCard}>
              <FontAwesome name="trophy" size={50} color="#4CAF50" />
              <Text style={styles.gameOverTitle}>Felicitări!</Text>
              <Text style={styles.gameOverText}>
                Ai ajuns la final cu scorul: {score}
              </Text>
              <TouchableOpacity style={styles.retryButton} onPress={resetGame}>
                <Text style={styles.retryButtonText}>Joacă din nou</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
} 