import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, Animated } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { styles } from '../styles/blockGameStyle';

interface Message {
  id: number;
  text: string;
  isPositive: boolean;
  icon: string;
}

const messages: Message[] = [
  { id: 1, text: "Ești un prieten minunat! 🌟", isPositive: true, icon: "heart" },
  { id: 2, text: "Ai părul urât! 😈", isPositive: false, icon: "thumbs-down" },
  { id: 3, text: "Felicitări pentru rezultate! 🎉", isPositive: true, icon: "star" },
  { id: 4, text: "Nu ești bun la nimic! 😡", isPositive: false, icon: "ban" },
  { id: 5, text: "Suntem prieteni pentru totdeauna! 💫", isPositive: true, icon: "smile" },
  { id: 6, text: "Nu mai vreau să te văd! 👎", isPositive: false, icon: "times" },
  { id: 7, text: "Ai făcut o treabă excelentă! 🌈", isPositive: true, icon: "trophy" },
  { id: 8, text: "Ești un ratat! 💩", isPositive: false, icon: "frown" },
];

export default function BlockGame() {
  const [currentMessage, setCurrentMessage] = useState<Message | null>(null);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [timeLeft, setTimeLeft] = useState(5);
  const [gameOver, setGameOver] = useState(false);
  const [slideAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    if (!gameOver) {
      startNewRound();
    }
  }, [level]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (timeLeft > 0 && !gameOver) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleTimeUp();
    }
    return () => clearInterval(timer);
  }, [timeLeft, gameOver]);

  const startNewRound = () => {
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    setCurrentMessage(randomMessage);
    setTimeLeft(5);
    Animated.spring(slideAnim, {
      toValue: 1,
      friction: 8,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const handleTimeUp = () => {
    setGameOver(true);
  };

  const handleAction = (isBlock: boolean) => {
    if (currentMessage && isBlock === !currentMessage.isPositive) {
      setScore(score + 10);
      if (score + 10 >= level * 50) {
        setLevel(level + 1);
      }
    } else {
      setGameOver(true);
    }
    Animated.spring(slideAnim, {
      toValue: 0,
      friction: 8,
      tension: 40,
      useNativeDriver: true,
    }).start(() => {
      if (!gameOver) {
        startNewRound();
      }
    });
  };

  const resetGame = () => {
    setScore(0);
    setLevel(1);
    setGameOver(false);
    startNewRound();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Blochează și Protejează</Text>
        <Text style={styles.subtitle}>Protejează-ți prietenii de mesajele negative!</Text>

        <View style={styles.levelContainer}>
          <Text style={styles.levelText}>Nivel {level}</Text>
        </View>

        <View style={styles.timerContainer}>
          <FontAwesome name="clock-o" size={24} color="#FFA500" />
          <Text style={styles.timerText}>{timeLeft}s</Text>
        </View>

        <View style={styles.scoreContainer}>
          <FontAwesome name="star" size={24} color="#4CAF50" />
          <Text style={styles.scoreText}>{score}</Text>
        </View>

        <View style={styles.gameContainer}>
          {currentMessage && (
            <Animated.View
              style={[
                styles.messageCard,
                {
                  transform: [
                    {
                      translateY: slideAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [200, 0],
                      }),
                    },
                  ],
                },
              ]}
            >
              <FontAwesome name={currentMessage.icon as any} size={40} color={currentMessage.isPositive ? "#4CAF50" : "#FF4444"} />
              <Text style={styles.messageText}>{currentMessage.text}</Text>
              <View style={styles.buttonsContainer}>
                <TouchableOpacity
                  style={[styles.actionButton, { backgroundColor: '#FF4444' }]}
                  onPress={() => handleAction(true)}
                >
                  <FontAwesome name="ban" size={24} color="#FFFFFF" />
                  <Text style={styles.buttonText}>Blochează</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionButton, { backgroundColor: '#4CAF50' }]}
                  onPress={() => handleAction(false)}
                >
                  <FontAwesome name="heart" size={24} color="#FFFFFF" />
                  <Text style={styles.buttonText}>Răspunde frumos</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          )}
        </View>

        {gameOver && (
          <View style={styles.gameOverContainer}>
            <View style={styles.gameOverCard}>
              <FontAwesome name="times-circle" size={50} color="#FF4444" />
              <Text style={styles.gameOverTitle}>Game Over!</Text>
              <Text style={styles.gameOverText}>
                Scorul tău final: {score}
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