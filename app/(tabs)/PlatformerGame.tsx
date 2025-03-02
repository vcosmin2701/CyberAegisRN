import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Pressable,
  Text,
  Modal,
  Alert,
} from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
const PLAYER_SIZE = 40;
const MOVEMENT_SPEED = 20;

// Recalculate maze paths to fill screen
const MAZE_PATHS = [
  // Outer frame
  { x: 20, y: 80, width: SCREEN_WIDTH - 40, height: 40 }, // Top
  { x: 20, y: 80, width: 40, height: SCREEN_HEIGHT - 160 }, // Left
  { x: 20, y: SCREEN_HEIGHT - 120, width: SCREEN_WIDTH - 40, height: 40 }, // Bottom
  { x: SCREEN_WIDTH - 60, y: 80, width: 40, height: SCREEN_HEIGHT - 160 }, // Right

  // Inner horizontal paths
  { x: 20, y: SCREEN_HEIGHT / 2 - 20, width: SCREEN_WIDTH - 40, height: 40 }, // Middle

  // Inner vertical paths
  { x: SCREEN_WIDTH / 3, y: 80, width: 40, height: SCREEN_HEIGHT - 160 }, // First third
  {
    x: (SCREEN_WIDTH / 3) * 2 - 40,
    y: 80,
    width: 40,
    height: SCREEN_HEIGHT - 160,
  }, // Second third
];

const COMPUTERS = [
  { x: 30, y: 90 },
  { x: SCREEN_WIDTH / 3 + 10, y: 90 },
  { x: (SCREEN_WIDTH / 3) * 2 - 30, y: 90 },
  { x: SCREEN_WIDTH - 70, y: 90 },
  { x: 30, y: SCREEN_HEIGHT - 130 },
  { x: SCREEN_WIDTH / 3 + 10, y: SCREEN_HEIGHT - 130 },
  { x: (SCREEN_WIDTH / 3) * 2 - 30, y: SCREEN_HEIGHT - 130 },
  { x: SCREEN_WIDTH - 70, y: SCREEN_HEIGHT - 130 },
];

const COLLECTIBLES = [
  { x: SCREEN_WIDTH / 4, y: SCREEN_HEIGHT / 4 },
  { x: (SCREEN_WIDTH / 4) * 3, y: SCREEN_HEIGHT / 4 },
  { x: SCREEN_WIDTH / 4, y: (SCREEN_HEIGHT / 4) * 3 },
  { x: (SCREEN_WIDTH / 4) * 3, y: (SCREEN_HEIGHT / 4) * 3 },
];

const CYBER_QUESTIONS = [
  {
    question: 'What is a strong password?',
    options: ['123456', 'password123', 'K9$mP2#vL9*nQ4@', 'qwerty'],
    correctAnswer: 2,
  },
  {
    question: 'What is phishing?',
    options: [
      'Catching fish',
      'A cyber attack that uses disguised emails',
      'A type of computer virus',
      'A secure password',
    ],
    correctAnswer: 1,
  },
  {
    question: 'What should you do if you receive a suspicious email?',
    options: [
      'Open all attachments',
      'Click all links',
      'Reply with your information',
      'Delete it or report it',
    ],
    correctAnswer: 3,
  },
];

const isOnPath = (x: number, y: number) => {
  // Add some tolerance for better gameplay
  const tolerance = PLAYER_SIZE / 2;

  return MAZE_PATHS.some(
    (path) =>
      x + tolerance > path.x &&
      x - tolerance < path.x + path.width &&
      y + tolerance > path.y &&
      y - tolerance < path.y + path.height
  );
};

export default function PlatformerGame() {
  const [playerPosition, setPlayerPosition] = useState({
    x: SCREEN_WIDTH / 2 - PLAYER_SIZE / 2,
    y: SCREEN_HEIGHT / 2 - PLAYER_SIZE / 2,
  });
  const [score, setScore] = useState(0);
  const [hearts, setHearts] = useState(3);
  const [showQuestion, setShowQuestion] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [visitedComputers, setVisitedComputers] = useState<number[]>([]);

  const checkComputerCollision = (x: number, y: number) => {
    COMPUTERS.forEach((computer, index) => {
      if (
        !visitedComputers.includes(index) &&
        Math.abs(x - computer.x) < PLAYER_SIZE &&
        Math.abs(y - computer.y) < PLAYER_SIZE
      ) {
        setCurrentQuestion(Math.floor(Math.random() * CYBER_QUESTIONS.length));
        setShowQuestion(true);
        setVisitedComputers([...visitedComputers, index]);
      }
    });
  };

  const movePlayer = (direction: 'up' | 'down' | 'left' | 'right') => {
    setPlayerPosition((prev) => {
      let nextX = prev.x;
      let nextY = prev.y;

      const step = MOVEMENT_SPEED;

      switch (direction) {
        case 'up':
          nextY = Math.max(0, prev.y - step);
          break;
        case 'down':
          nextY = Math.min(SCREEN_HEIGHT - PLAYER_SIZE - 100, prev.y + step);
          break;
        case 'left':
          nextX = Math.max(0, prev.x - step);
          break;
        case 'right':
          nextX = Math.min(SCREEN_WIDTH - PLAYER_SIZE, prev.x + step);
          break;
      }

      if (isOnPath(nextX, nextY)) {
        checkComputerCollision(nextX, nextY);
        return { x: nextX, y: nextY };
      }
      return prev;
    });
  };

  const handleAnswer = (selectedAnswer: number) => {
    const question = CYBER_QUESTIONS[currentQuestion];
    if (selectedAnswer === question.correctAnswer) {
      setScore((prev) => prev + 100);
      Alert.alert('Correct! 🎉', 'You earned 100 points!');
    } else {
      setHearts((prev) => Math.max(0, prev - 1));
      Alert.alert('Incorrect!', 'Try again next time!');
      if (hearts <= 1) {
        Alert.alert('Game Over!', `Final Score: ${score}`, [
          {
            text: 'Restart',
            onPress: () => {
              setScore(0);
              setHearts(3);
              setVisitedComputers([]);
              setPlayerPosition({
                x: SCREEN_WIDTH / 2 - PLAYER_SIZE / 2,
                y: SCREEN_HEIGHT / 2 - PLAYER_SIZE / 2,
              });
            },
          },
        ]);
      }
    }
    setShowQuestion(false);
  };

  return (
    <View style={styles.container}>
      {/* Score and Hearts */}
      <View style={styles.header}>
        <Text style={styles.headerText}>
          {'❤️'.repeat(hearts)} Score: {score}
        </Text>
      </View>

      <View style={styles.gameMap}>
        {/* Draw maze paths */}
        {MAZE_PATHS.map((path, index) => (
          <View
            key={`path-${index}`}
            style={[
              styles.path,
              {
                left: path.x,
                top: path.y,
                width: path.width,
                height: path.height,
              },
            ]}
          />
        ))}

        {/* Draw computers */}
        {COMPUTERS.map((computer, index) => (
          <View
            key={`computer-${index}`}
            style={[styles.computer, { left: computer.x, top: computer.y }]}
          >
            <View style={styles.computerScreen} />
            <View style={styles.computerKeyboard} />
          </View>
        ))}

        {/* Draw collectibles */}
        {COLLECTIBLES.map((collectible, index) => (
          <View
            key={`collectible-${index}`}
            style={[
              styles.collectible,
              { left: collectible.x, top: collectible.y },
            ]}
          />
        ))}

        {/* Player */}
        <View
          style={[
            styles.player,
            {
              left: playerPosition.x,
              top: playerPosition.y,
            },
          ]}
        >
          <View style={styles.playerFace} />
        </View>
      </View>

      {/* Question Modal */}
      <Modal visible={showQuestion} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.questionText}>
              {CYBER_QUESTIONS[currentQuestion].question}
            </Text>
            {CYBER_QUESTIONS[currentQuestion].options.map((option, index) => (
              <Pressable
                key={index}
                style={styles.answerButton}
                onPress={() => handleAnswer(index)}
              >
                <Text style={styles.answerText}>{option}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      </Modal>

      {/* Controls */}
      <View style={styles.controlsContainer}>
        <Pressable
          style={styles.button}
          onPress={() => movePlayer('up')}
          onPressIn={() => movePlayer('up')}
          onLongPress={() => movePlayer('up')}
        >
          <Text style={styles.arrow}>↑</Text>
        </Pressable>
        <View style={styles.horizontalControls}>
          <Pressable
            style={styles.button}
            onPress={() => movePlayer('left')}
            onPressIn={() => movePlayer('left')}
            onLongPress={() => movePlayer('left')}
          >
            <Text style={styles.arrow}>←</Text>
          </Pressable>
          <Pressable
            style={styles.button}
            onPress={() => movePlayer('down')}
            onPressIn={() => movePlayer('down')}
            onLongPress={() => movePlayer('down')}
          >
            <Text style={styles.arrow}>↓</Text>
          </Pressable>
          <Pressable
            style={styles.button}
            onPress={() => movePlayer('right')}
            onPressIn={() => movePlayer('right')}
            onLongPress={() => movePlayer('right')}
          >
            <Text style={styles.arrow}>→</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  header: {
    padding: 10,
    paddingTop: 40, // Add extra padding for status bar
    alignItems: 'center',
  },
  headerText: {
    color: '#fff',
    fontSize: 24,
  },
  gameMap: {
    flex: 1,
    backgroundColor: '#2a2a2a',
    position: 'relative',
  },
  path: {
    position: 'absolute',
    backgroundColor: '#4a4a4a',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#5a5a5a',
  },
  computer: {
    position: 'absolute',
    width: 30,
    height: 30,
    backgroundColor: '#666',
    borderRadius: 4,
    padding: 2,
  },
  computerScreen: {
    flex: 1,
    backgroundColor: '#88ffff',
    borderRadius: 2,
  },
  computerKeyboard: {
    height: 4,
    backgroundColor: '#444',
    marginTop: 2,
    borderRadius: 1,
  },
  collectible: {
    position: 'absolute',
    width: 20,
    height: 20,
    backgroundColor: '#ffff00',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#ffaa00',
    shadowColor: '#ffff00',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 5,
  },
  player: {
    width: PLAYER_SIZE,
    height: PLAYER_SIZE,
    backgroundColor: '#ff88ff',
    position: 'absolute',
    borderRadius: PLAYER_SIZE / 2,
    borderWidth: 2,
    borderColor: '#ff44ff',
    shadowColor: '#ff88ff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 5,
    elevation: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playerFace: {
    width: PLAYER_SIZE * 0.6,
    height: PLAYER_SIZE * 0.6,
    borderRadius: PLAYER_SIZE * 0.3,
    borderWidth: 2,
    borderColor: '#ff44ff',
    backgroundColor: '#ffffff',
  },
  controlsContainer: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  horizontalControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    width: 60,
    height: 60,
    backgroundColor: 'rgba(255, 136, 255, 0.3)',
    borderRadius: 30,
    margin: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ff88ff',
  },
  arrow: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#ff88ff',
    textShadowColor: '#ff88ff',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalContent: {
    backgroundColor: '#2a2a2a',
    padding: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#ff88ff',
    width: '80%',
    alignItems: 'center',
  },
  questionText: {
    color: '#fff',
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  answerButton: {
    backgroundColor: 'rgba(255, 136, 255, 0.3)',
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ff88ff',
    width: '100%',
    marginVertical: 5,
  },
  answerText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
  },
});
