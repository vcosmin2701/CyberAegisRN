import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  ScrollView,
  SafeAreaView,
  Dimensions,
  StatusBar,
  Vibration,
  Animated,
} from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { platformerGameStyles } from '../styles/platformerGameStyle';
import NetworkCables from '../../components/platfomerComponents/networkCables';
import ServerLeft from '@/components/platfomerComponents/serverLeft';
import TutorialOverlay from '@/components/platfomerComponents/tutorialOverlay';
import MovementController from '@/components/platfomerComponents/MovementController';
import EngineerCharacter from '@/components/platfomerComponents/EngineerCharacter';
import ComputerWorkstation from '@/components/platfomerComponents/ComputerWorkstation';
import MalwareThreat from '@/components/platfomerComponents/MalwareThreat';
import QuizModal from '@/components/platfomerComponents/QuizModal';
import SecurityStatus from '@/components/platfomerComponents/SecurityStatus';

// Get screen dimensions
const { width, height } = Dimensions.get('window');
// Calculate available height (accounting for tab bar)
const TAB_BAR_HEIGHT = 49; // Standard tab bar height
const AVAILABLE_HEIGHT =
  height - TAB_BAR_HEIGHT - (StatusBar.currentHeight || 0);

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
}

const quizQuestions: QuizQuestion[] = [
  {
    question: 'Ce trebuie să faci când primești un mesaj de la un străin?',
    options: [
      'Deschid mesajul',
      'Spun unui adult',
      'Răspund imediat',
      'Dau click pe link',
    ],
    correctAnswer: 1,
  },
  {
    question: 'Care este o parolă bună?',
    options: ['123456', 'numele meu', 'Fl0@re!Alb@stră', 'parola'],
    correctAnswer: 2,
  },
  {
    question: 'Ce faci când folosești internetul?',
    options: [
      'Dau informații personale',
      'Vorbesc doar cu prieteni',
      'Descărc orice joc',
      'Deschid toate emailurile',
    ],
    correctAnswer: 1,
  },
  {
    question: 'Cum protejezi tableta sau telefonul?',
    options: [
      'O las oriunde',
      'Folosesc o parolă',
      'O împrumut oricui',
      'Nu am grijă de ea',
    ],
    correctAnswer: 1,
  },
];

const PlatformerGame: React.FC = () => {
  const router = useRouter();
  const [solvedComputers, setSolvedComputers] = useState<boolean[]>([
    false,
    false,
    false,
    false,
  ]);
  const [activeQuiz, setActiveQuiz] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [securityLevel, setSecurityLevel] = useState('Low');
  const [showTutorial, setShowTutorial] = useState(false);
  const [engineerPosition, setEngineerPosition] = useState({
    left: 40,
    top: 150,
  });
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [hackerAttack, setHackerAttack] = useState(false);
  const [gameProgress, setGameProgress] = useState(0);
  const [malwareThreats, setMalwareThreats] = useState<
    { x: number; y: number; eliminated: boolean; type: string }[]
  >([
    { x: 80, y: 150, eliminated: false, type: 'virus' },
    { x: 180, y: 280, eliminated: false, type: 'trojan' },
    { x: 250, y: 180, eliminated: false, type: 'ransomware' },
    { x: 40, y: 320, eliminated: false, type: 'worm' },
    { x: 120, y: 220, eliminated: false, type: 'virus' },
    { x: 220, y: 120, eliminated: false, type: 'trojan' },
  ]);
  const [score, setScore] = useState(0);
  const [correctAnswersInARow, setCorrectAnswersInARow] = useState(0);
  const [showTip, setShowTip] = useState(false);
  const [currentTip, setCurrentTip] = useState('');
  const [progressAnimation] = useState(new Animated.Value(0));

  // Security tips in Romanian
  const securityTips = [
    'Nu da niciodată parola ta altcuiva!',
    'Spune unui adult dacă vezi ceva ciudat online.',
    'Nu deschide emailuri de la persoane necunoscute.',
    'Folosește parole diferite pentru conturi diferite.',
    'Nu da informații personale pe internet.',
    'Ai grijă ce linkuri deschizi!',
  ];

  // Animation timing
  useEffect(() => {
    // Simulate more frequent hacker attacks
    const attackInterval = setInterval(() => {
      if (Math.random() > 0.5 && !solvedComputers.every((solved) => solved)) {
        setHackerAttack(true);
      }
    }, 8000);

    return () => {
      clearInterval(attackInterval);
    };
  }, [solvedComputers]);

  // Check for malware elimination with improved feedback
  useEffect(() => {
    const checkMalwareElimination = () => {
      const updatedMalware = [...malwareThreats];
      let updated = false;
      let newScore = score;

      malwareThreats.forEach((threat, index) => {
        if (!threat.eliminated) {
          const distance = Math.sqrt(
            Math.pow(engineerPosition.left - threat.x, 2) +
              Math.pow(engineerPosition.top - threat.y, 2)
          );

          if (distance < 30) {
            updatedMalware[index].eliminated = true;
            updated = true;
            newScore += 15;
            Vibration.vibrate(100); // Feedback for elimination

            // Show random security tip
            const randomTip =
              securityTips[Math.floor(Math.random() * securityTips.length)];
            setCurrentTip(randomTip);
            setShowTip(true);
            setTimeout(() => setShowTip(false), 3000);

            // Animate progress bar
            const newProgress = Math.min(100, gameProgress + 8);
            Animated.timing(progressAnimation, {
              toValue: newProgress / 100,
              duration: 500,
              useNativeDriver: false,
            }).start();
            setGameProgress(newProgress);
          }
        }
      });

      if (updated) {
        setMalwareThreats(updatedMalware);
        setScore(newScore);
      }
    };

    checkMalwareElimination();
  }, [engineerPosition]);

  const handleComputerPress = (index: number) => {
    if (!solvedComputers[index]) {
      setActiveQuiz(index);
      setShowModal(true);
      // Move engineer to the computer
      const positions = [
        { left: 40, top: 100 },
        { left: 200, top: 100 },
        { left: 40, top: 250 },
        { left: 200, top: 250 },
      ];
      setEngineerPosition(positions[index]);
    }
  };

  const handleAnswer = (answerIndex: number) => {
    if (activeQuiz !== null) {
      // Make sure we don't go out of bounds with the quiz questions
      const questionIndex = activeQuiz % quizQuestions.length;
      const question = quizQuestions[questionIndex];

      if (answerIndex === question.correctAnswer) {
        const newSolvedComputers = [...solvedComputers];
        newSolvedComputers[activeQuiz] = true;
        setSolvedComputers(newSolvedComputers);

        // Increment correct answers counter
        setCorrectAnswersInARow((prev) => prev + 1);

        // Check if we should stop the hacker attack (2 correct answers in a row)
        if (correctAnswersInARow + 1 >= 2) {
          setHackerAttack(false);
          setCorrectAnswersInARow(0);
        }

        // Update security level and progress
        const solvedCount = newSolvedComputers.filter(
          (solved) => solved
        ).length;
        if (solvedCount === newSolvedComputers.length) {
          setSecurityLevel('High');
          setShowSuccessMessage(true);
          setTimeout(() => setShowSuccessMessage(false), 3000);

          // Animate to 100%
          Animated.timing(progressAnimation, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: false,
          }).start();
          setGameProgress(100);
        } else if (solvedCount > 0) {
          setSecurityLevel('Medium');

          // Increase progress significantly for solving a computer
          const newProgress = Math.min(100, gameProgress + 15);
          Animated.timing(progressAnimation, {
            toValue: newProgress / 100,
            duration: 500,
            useNativeDriver: false,
          }).start();
          setGameProgress(newProgress);
        }

        // Increase score for correct answer
        setScore((prev) => prev + 25);

        // Show positive feedback
        setCurrentTip('Excelent! Ai rezolvat provocarea!');
        setShowTip(true);
        setTimeout(() => setShowTip(false), 3000);
      } else {
        // Wrong answer feedback
        Vibration.vibrate(200);
        setCorrectAnswersInARow(0);

        // Show hint
        setCurrentTip('Încearcă din nou! Gândește-te la securitate.');
        setShowTip(true);
        setTimeout(() => setShowTip(false), 3000);
      }
      setShowModal(false);
      setActiveQuiz(null);
    }
  };

  const handleBackToLevels = () => {
    router.back();
  };

  // Handle position updates from the MovementController
  const handlePositionChange = (newPosition: { left: number; top: number }) => {
    setEngineerPosition(newPosition);
  };

  // Get the position type for a computer workstation
  const getComputerPosition = (index: number) => {
    switch (index) {
      case 0:
        return 'topLeft';
      case 1:
        return 'topRight';
      case 2:
        return 'bottomLeft';
      case 3:
        return 'bottomRight';
      default:
        return 'topLeft';
    }
  };

  return (
    <SafeAreaView style={platformerGameStyles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      {/* Back button */}
      <TouchableOpacity
        style={navigationStyles.backButton}
        onPress={handleBackToLevels}
      >
        <Text style={navigationStyles.backButtonText}>← Back to Levels</Text>
      </TouchableOpacity>
      {/* Level title */}
      <View style={navigationStyles.levelTitleContainer}>
        <Text style={navigationStyles.levelTitle}>
          Level 1: Cyber Security Basics
        </Text>
      </View>
      {/* Score Display */}
      <View style={platformerGameStyles.scoreContainer}>
        <Text style={platformerGameStyles.scoreText}>SCOR: {score}</Text>
      </View>
      {/* Progress Bar - Animated */}
      <View style={platformerGameStyles.progressContainer}>
        <Animated.View
          style={[
            platformerGameStyles.progressBar,
            {
              width: progressAnimation.interpolate({
                inputRange: [0, 1],
                outputRange: ['0%', '100%'],
              }),
            },
          ]}
        />
        <Text style={platformerGameStyles.progressText}>
          {gameProgress}% Securizat
        </Text>
      </View>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={true}
      >
        <View style={styles.labRoom}>
          {/* Lab Background with Grid */}
          <View
            style={[
              platformerGameStyles.labBackground,
              hackerAttack && platformerGameStyles.hackerAttackBackground,
            ]}
          >
            <View style={platformerGameStyles.gridLines}>
              {[...Array(10)].map((_, i) => (
                <View
                  key={`h${i}`}
                  style={[
                    platformerGameStyles.horizontalLine,
                    { top: `${i * 10}%` },
                  ]}
                />
              ))}
              {[...Array(10)].map((_, i) => (
                <View
                  key={`v${i}`}
                  style={[
                    platformerGameStyles.verticalLine,
                    { left: `${i * 10}%` },
                  ]}
                />
              ))}
            </View>
          </View>

          {/* Security Status Display */}
          <SecurityStatus
            securityLevel={securityLevel as 'Low' | 'Medium' | 'High'}
            isUnderAttack={hackerAttack}
          />

          {/* Main Content Area */}
          <View style={platformerGameStyles.mainContent}>
            {/* Left Section - Server Racks */}
            <View style={platformerGameStyles.leftSection}>
              {/* srever left */}
              <View>
                <ServerLeft />
              </View>
              {/* Network Cables */}
              <View style={platformerGameStyles.networkCables}>
                <NetworkCables />
              </View>
            </View>

            {/* Center Section - Workstations */}
            <View style={platformerGameStyles.centerSection}>
              <View style={platformerGameStyles.workstationArea}>
                {[0, 1, 2, 3].map((index) => (
                  <ComputerWorkstation
                    key={index}
                    index={index}
                    isSolved={solvedComputers[index]}
                    isUnderAttack={hackerAttack}
                    onPress={handleComputerPress}
                    position={
                      getComputerPosition(index) as
                        | 'topLeft'
                        | 'topRight'
                        | 'bottomLeft'
                        | 'bottomRight'
                    }
                  />
                ))}
              </View>

              {/* Malware Threats */}
              {malwareThreats.map(
                (threat, index) =>
                  !threat.eliminated && (
                    <MalwareThreat
                      key={index}
                      type={threat.type}
                      position={{ x: threat.x, y: threat.y }}
                    />
                  )
              )}

              {/* Engineer Character */}
              <EngineerCharacter position={engineerPosition} />
            </View>

            {/* Right Section - Security Features */}
            <View style={platformerGameStyles.rightSection}>
              {/* Security Monitors */}
              <View style={platformerGameStyles.securityMonitors}>
                <View style={platformerGameStyles.securityMonitor}>
                  <View style={platformerGameStyles.monitorScreen}>
                    <View style={platformerGameStyles.monitorGraph} />
                  </View>
                </View>
                <View style={platformerGameStyles.securityMonitor}>
                  <View style={platformerGameStyles.monitorScreen}>
                    <View style={platformerGameStyles.monitorData} />
                    <View style={platformerGameStyles.monitorData} />
                    <View style={platformerGameStyles.monitorData} />
                  </View>
                </View>
              </View>

              {/* Security Features */}
              <View style={platformerGameStyles.securityFeatures}>
                <View style={platformerGameStyles.camera}>
                  <View style={platformerGameStyles.cameraLens} />
                  <View style={platformerGameStyles.cameraBody} />
                </View>
                <View style={platformerGameStyles.keypad}>
                  {[...Array(9)].map((_, i) => (
                    <View key={i} style={platformerGameStyles.keypadButton} />
                  ))}
                </View>
              </View>

              {/* Firewall Status */}
              <View style={platformerGameStyles.firewallStatus}>
                <Text style={platformerGameStyles.firewallLabel}>FIREWALL</Text>
                <View
                  style={[
                    platformerGameStyles.firewallIndicator,
                    solvedComputers.every((solved) => solved)
                      ? platformerGameStyles.firewallActive
                      : platformerGameStyles.firewallInactive,
                  ]}
                />
              </View>
            </View>
          </View>

          {/* Bottom Padding to ensure content is above tab bar */}
          <View style={styles.bottomPadding} />
        </View>
      </ScrollView>

      {/* Movement Controller */}
      <MovementController
        initialPosition={engineerPosition}
        onPositionChange={handlePositionChange}
      />

      {/* Tutorial Overlay */}
      {showTutorial && (
        <TutorialOverlay onClose={() => setShowTutorial(false)} />
      )}

      {/* Success Message */}
      {showSuccessMessage && (
        <View style={platformerGameStyles.successOverlay}>
          <View style={platformerGameStyles.successBox}>
            <Text style={platformerGameStyles.successTitle}>
              Securitate Restabilită!
            </Text>
            <Text style={platformerGameStyles.successText}>
              Bravo! Ai securizat toate sistemele din laborator.
            </Text>
            <View style={platformerGameStyles.successIcon}>
              <Text style={platformerGameStyles.successIconText}>✓</Text>
            </View>
          </View>
        </View>
      )}

      {/* Quiz Modal */}
      <QuizModal
        visible={showModal}
        activeQuiz={activeQuiz}
        questions={quizQuestions}
        onAnswer={handleAnswer}
      />

      {/* Game Instructions */}
      <TouchableOpacity
        style={platformerGameStyles.helpButton}
        onPress={() => setShowTutorial(true)}
      >
        <Text style={platformerGameStyles.helpButtonText}>?</Text>
      </TouchableOpacity>

      {/* Security Tip Popup */}
      {showTip && (
        <View style={platformerGameStyles.tipContainer}>
          <View style={platformerGameStyles.tipBox}>
            <Text style={platformerGameStyles.tipText}>{currentTip}</Text>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

export const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: TAB_BAR_HEIGHT + 20, // Add extra padding at bottom
  },
  labRoom: {
    flex: 1,
    position: 'relative',
    minHeight: AVAILABLE_HEIGHT * 0.9, // Use 90% of available height
  },
  bottomPadding: {
    height: TAB_BAR_HEIGHT + 20, // Extra padding at the bottom
  },
});

// Additional styles for navigation
const navigationStyles = StyleSheet.create({
  backButton: {
    position: 'absolute',
    top: 10,
    left: 10,
    zIndex: 10,
    padding: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 5,
  },
  backButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  levelTitleContainer: {
    position: 'absolute',
    top: 10,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 5,
  },
  levelTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 20,
  },
});

export default PlatformerGame;
