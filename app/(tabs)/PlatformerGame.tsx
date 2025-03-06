import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Modal,
  ScrollView,
  SafeAreaView,
  Dimensions,
  StatusBar,
  Vibration,
  Animated,
} from 'react-native';
// import LottieView from 'lottie-react-native';

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
  const [solvedComputers, setSolvedComputers] = useState<boolean[]>([
    false,
    false,
    false,
    false,
  ]);
  const [activeQuiz, setActiveQuiz] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [securityLevel, setSecurityLevel] = useState('Low');
  const [showTutorial, setShowTutorial] = useState(true);
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
  ]);
  const [score, setScore] = useState(0);
  const [movementDirection, setMovementDirection] = useState<string | null>(
    null
  );
  const [correctAnswersInARow, setCorrectAnswersInARow] = useState(0);

  // Add movement speed and boundaries
  const MOVEMENT_SPEED = 10;
  const BOUNDARY = {
    minX: 0,
    maxX: width - 50, // Adjust based on engineer width
    minY: 0,
    maxY: AVAILABLE_HEIGHT - 100, // Adjust based on engineer height
  };

  // Animation timing
  useEffect(() => {
    // Hide tutorial after 5 seconds
    const tutorialTimer = setTimeout(() => {
      setShowTutorial(false);
    }, 5000);

    // Simulate more frequent hacker attacks
    const attackInterval = setInterval(() => {
      if (Math.random() > 0.5 && !solvedComputers.every((solved) => solved)) {
        setHackerAttack(true);
      }
    }, 8000);

    return () => {
      clearTimeout(tutorialTimer);
      clearInterval(attackInterval);
    };
  }, [solvedComputers]);

  // Add continuous movement when holding down arrow keys
  useEffect(() => {
    if (!movementDirection) return;

    const moveInterval = setInterval(() => {
      moveEngineer(movementDirection as 'up' | 'down' | 'left' | 'right');
    }, 100);

    return () => clearInterval(moveInterval);
  }, [movementDirection]);

  // Check for malware elimination
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
          }
        }
      });

      if (updated) {
        setMalwareThreats(updatedMalware);
        setScore(newScore);
        setGameProgress(Math.min(100, gameProgress + 8));
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

        // Update security level based on solved computers
        const solvedCount = newSolvedComputers.filter(
          (solved) => solved
        ).length;
        if (solvedCount === newSolvedComputers.length) {
          setSecurityLevel('High');
          setShowSuccessMessage(true);
          setTimeout(() => setShowSuccessMessage(false), 3000);
        } else if (solvedCount > 0) {
          setSecurityLevel('Medium');
          setGameProgress(50);
        }
      } else {
        // Wrong answer feedback
        Vibration.vibrate(200);
        // Reset correct answers counter on wrong answer
        setCorrectAnswersInARow(0);
      }
      setShowModal(false);
      setActiveQuiz(null);
    }
  };

  // Add movement handler with press and release functions
  const moveEngineer = (direction: 'up' | 'down' | 'left' | 'right') => {
    setEngineerPosition((current) => {
      let newPosition = { ...current };

      switch (direction) {
        case 'up':
          newPosition.top = Math.max(
            BOUNDARY.minY,
            current.top - MOVEMENT_SPEED
          );
          break;
        case 'down':
          newPosition.top = Math.min(
            BOUNDARY.maxY,
            current.top + MOVEMENT_SPEED
          );
          break;
        case 'left':
          newPosition.left = Math.max(
            BOUNDARY.minX,
            current.left - MOVEMENT_SPEED
          );
          break;
        case 'right':
          newPosition.left = Math.min(
            BOUNDARY.maxX,
            current.left + MOVEMENT_SPEED
          );
          break;
      }

      return newPosition;
    });
  };

  const handleDirectionPress = (
    direction: 'up' | 'down' | 'left' | 'right'
  ) => {
    setMovementDirection(direction);
    moveEngineer(direction);
  };

  const handleDirectionRelease = () => {
    setMovementDirection(null);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Score Display */}
      <View style={styles.scoreContainer}>
        <Text style={styles.scoreText}>SCORE: {score}</Text>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={[styles.progressBar, { width: `${gameProgress}%` }]} />
        <Text style={styles.progressText}>{gameProgress}% Secure</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={true}
      >
        <View style={styles.labRoom}>
          {/* Lab Background with Grid */}
          <View
            style={[
              styles.labBackground,
              hackerAttack && styles.hackerAttackBackground,
            ]}
          >
            <View style={styles.gridLines}>
              {[...Array(10)].map((_, i) => (
                <View
                  key={`h${i}`}
                  style={[styles.horizontalLine, { top: `${i * 10}%` }]}
                />
              ))}
              {[...Array(10)].map((_, i) => (
                <View
                  key={`v${i}`}
                  style={[styles.verticalLine, { left: `${i * 10}%` }]}
                />
              ))}
            </View>
          </View>

          {/* Security Status Display */}
          <View style={styles.securityStatus}>
            <Text style={styles.securityLabel}>NIVEL SECURITATE:</Text>
            <View
              style={[
                styles.securityIndicator,
                securityLevel === 'Low' && styles.securityLow,
                securityLevel === 'Medium' && styles.securityMedium,
                securityLevel === 'High' && styles.securityHigh,
              ]}
            >
              <Text style={styles.securityText}>
                {securityLevel === 'Low'
                  ? 'Scăzut'
                  : securityLevel === 'Medium'
                  ? 'Mediu'
                  : 'Ridicat'}
              </Text>
            </View>
            {hackerAttack && (
              <View style={styles.alertBadge}>
                <Text style={styles.alertText}>ATAC DETECTAT!</Text>
              </View>
            )}
          </View>

          {/* Main Content Area */}
          <View style={styles.mainContent}>
            {/* Left Section - Server Racks */}
            <View style={styles.leftSection}>
              <View style={styles.serverRack}>
                {[...Array(6)].map((_, i) => (
                  <View key={i} style={styles.server}>
                    <View style={styles.serverLights}>
                      <View style={[styles.light, styles.lightGreen]} />
                      <View style={[styles.light, styles.lightBlue]} />
                    </View>
                  </View>
                ))}
              </View>

              {/* Network Cables */}
              <View style={styles.networkCables}>
                {['#FF5252', '#4CAF50', '#2196F3', '#FFEB3B'].map(
                  (color, i) => (
                    <View
                      key={i}
                      style={[styles.cable, { backgroundColor: color }]}
                    />
                  )
                )}
              </View>
            </View>

            {/* Center Section - Workstations */}
            <View style={styles.centerSection}>
              <View style={styles.workstationArea}>
                {[0, 1, 2, 3].map((index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.desk,
                      index % 2 === 0 ? styles.leftDesk : styles.rightDesk,
                      index < 2 ? styles.topRow : styles.bottomRow,
                      !solvedComputers[index] && styles.interactiveDesk,
                    ]}
                    onPress={() => handleComputerPress(index)}
                  >
                    <View style={styles.monitor}>
                      <View
                        style={[
                          styles.screen,
                          solvedComputers[index] && styles.solvedScreen,
                          hackerAttack &&
                            !solvedComputers[index] &&
                            styles.hackedScreen,
                        ]}
                      >
                        <View style={styles.screenContent} />
                        <View style={styles.screenContent} />
                        {solvedComputers[index] && (
                          <View style={styles.checkmark}>
                            <Text style={styles.checkmarkText}>✓</Text>
                          </View>
                        )}
                        {hackerAttack && !solvedComputers[index] && (
                          <Text style={styles.hackerText}>!</Text>
                        )}
                      </View>
                      <View style={styles.monitorStand} />
                    </View>
                    <View style={styles.keyboard}>
                      {[...Array(3)].map((_, j) => (
                        <View key={j} style={styles.keyboardRow} />
                      ))}
                    </View>
                    <View style={styles.mouse} />
                  </TouchableOpacity>
                ))}
              </View>

              {/* Malware Threats */}
              {malwareThreats.map(
                (threat, index) =>
                  !threat.eliminated && (
                    <View
                      key={index}
                      style={[
                        styles.malwareThreat,
                        { left: threat.x, top: threat.y },
                      ]}
                    >
                      <Text style={styles.malwareIcon}>
                        {threat.type === 'virus'
                          ? '🦠'
                          : threat.type === 'trojan'
                          ? '🐴'
                          : threat.type === 'ransomware'
                          ? '🔒'
                          : '🐛'}
                      </Text>
                    </View>
                  )
              )}

              {/* Movable Engineer Character */}
              <Animated.View
                style={[
                  styles.staticEngineer,
                  {
                    left: engineerPosition.left,
                    top: engineerPosition.top,
                  },
                ]}
              >
                {/* Chair */}
                <View style={styles.chair}>
                  <View style={styles.chairBack} />
                  <View style={styles.chairSeat} />
                  <View style={styles.chairBase} />
                  <View style={styles.chairWheels}>
                    <View style={styles.wheel} />
                    <View style={styles.wheel} />
                    <View style={styles.wheel} />
                  </View>
                </View>

                {/* Engineer - Sitting position */}
                <View style={styles.engineerBody}>
                  <View style={styles.head}>
                    <View style={styles.hair} />
                    <View style={styles.face}>
                      <View style={styles.glasses} />
                      <View style={styles.smile} />
                    </View>
                  </View>
                  <View style={[styles.body, styles.sittingBody]}>
                    <View style={styles.labCoat} />
                    <View style={styles.badge} />
                  </View>
                  <View style={[styles.legs, styles.sittingLegs]}>
                    <View style={[styles.leftLeg, styles.sittingLeg]} />
                    <View style={[styles.rightLeg, styles.sittingLeg]} />
                  </View>
                </View>
              </Animated.View>
            </View>

            {/* Right Section - Security Features */}
            <View style={styles.rightSection}>
              {/* Security Monitors */}
              <View style={styles.securityMonitors}>
                <View style={styles.securityMonitor}>
                  <View style={styles.monitorScreen}>
                    <View style={styles.monitorGraph} />
                  </View>
                </View>
                <View style={styles.securityMonitor}>
                  <View style={styles.monitorScreen}>
                    <View style={styles.monitorData} />
                    <View style={styles.monitorData} />
                    <View style={styles.monitorData} />
                  </View>
                </View>
              </View>

              {/* Security Features */}
              <View style={styles.securityFeatures}>
                <View style={styles.camera}>
                  <View style={styles.cameraLens} />
                  <View style={styles.cameraBody} />
                </View>
                <View style={styles.keypad}>
                  {[...Array(9)].map((_, i) => (
                    <View key={i} style={styles.keypadButton} />
                  ))}
                </View>
              </View>

              {/* Firewall Status */}
              <View style={styles.firewallStatus}>
                <Text style={styles.firewallLabel}>FIREWALL</Text>
                <View
                  style={[
                    styles.firewallIndicator,
                    solvedComputers.every((solved) => solved)
                      ? styles.firewallActive
                      : styles.firewallInactive,
                  ]}
                />
              </View>
            </View>
          </View>

          {/* Bottom Padding to ensure content is above tab bar */}
          <View style={styles.bottomPadding} />
        </View>
      </ScrollView>

      {/* Tutorial Overlay */}
      {showTutorial && (
        <View style={styles.tutorialOverlay}>
          <View style={styles.tutorialBox}>
            <Text style={styles.tutorialTitle}>
              Bine ai venit, Inginer de Securitate!
            </Text>
            <Text style={styles.tutorialText}>
              Misiunea ta este să securizezi toate computerele din laborator.
              Apasă pe computere pentru a rezolva provocările de securitate.
            </Text>
            <TouchableOpacity
              style={styles.tutorialButton}
              onPress={() => setShowTutorial(false)}
            >
              <Text style={styles.tutorialButtonText}>Am înțeles!</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Success Message */}
      {showSuccessMessage && (
        <View style={styles.successOverlay}>
          <View style={styles.successBox}>
            <Text style={styles.successTitle}>Securitate Restabilită!</Text>
            <Text style={styles.successText}>
              Bravo! Ai securizat toate sistemele din laborator.
            </Text>
            <View style={styles.successIcon}>
              <Text style={styles.successIconText}>✓</Text>
            </View>
          </View>
        </View>
      )}

      {/* Quiz Modal */}
      <Modal visible={showModal} transparent={true} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {activeQuiz !== null && (
              <>
                <Text style={styles.modalTitle}>Provocare de Securitate</Text>
                <Text style={styles.questionText}>
                  {quizQuestions[activeQuiz % quizQuestions.length].question}
                </Text>
                {quizQuestions[activeQuiz % quizQuestions.length].options.map(
                  (option, index) => (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.optionButton,
                        { transform: [{ scale: 1 }] },
                      ]}
                      onPress={() => handleAnswer(index)}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.optionText}>{option}</Text>
                    </TouchableOpacity>
                  )
                )}
              </>
            )}
          </View>
        </View>
      </Modal>

      {/* Control buttons at the bottom */}
      <View style={styles.controls}>
        <View style={styles.controlRow}>
          <TouchableOpacity
            style={styles.controlButton}
            onPressIn={() => handleDirectionPress('up')}
            onPressOut={handleDirectionRelease}
          >
            <Text style={styles.controlButtonText}>↑</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.controlRow}>
          <TouchableOpacity
            style={styles.controlButton}
            onPressIn={() => handleDirectionPress('left')}
            onPressOut={handleDirectionRelease}
          >
            <Text style={styles.controlButtonText}>←</Text>
          </TouchableOpacity>
          <View style={styles.controlButtonSpacer} />
          <TouchableOpacity
            style={styles.controlButton}
            onPressIn={() => handleDirectionPress('right')}
            onPressOut={handleDirectionRelease}
          >
            <Text style={styles.controlButtonText}>→</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.controlRow}>
          <TouchableOpacity
            style={styles.controlButton}
            onPressIn={() => handleDirectionPress('down')}
            onPressOut={handleDirectionRelease}
          >
            <Text style={styles.controlButtonText}>↓</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Game Instructions */}
      <TouchableOpacity
        style={styles.helpButton}
        onPress={() => setShowTutorial(true)}
      >
        <Text style={styles.helpButtonText}>?</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: TAB_BAR_HEIGHT + 20, // Add extra padding at bottom
  },
  labRoom: {
    flex: 1,
    position: 'relative',
    minHeight: AVAILABLE_HEIGHT * 0.9, // Use 90% of available height
  },
  labBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#1a1a1a',
  },
  gridLines: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  horizontalLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
  },
  verticalLine: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
  },
  securityStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 5,
    margin: 10,
  },
  securityLabel: {
    color: '#fff',
    fontSize: 12,
    marginRight: 10,
  },
  securityIndicator: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 3,
  },
  securityText: {
    fontWeight: 'bold',
    fontSize: 12,
  },
  securityLow: {
    backgroundColor: 'rgba(255, 0, 0, 0.2)',
    borderWidth: 1,
    borderColor: '#FF5252',
  },
  securityMedium: {
    backgroundColor: 'rgba(255, 193, 7, 0.2)',
    borderWidth: 1,
    borderColor: '#FFC107',
  },
  securityHigh: {
    backgroundColor: 'rgba(76, 175, 80, 0.2)',
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  mainContent: {
    flexDirection: 'row',
    padding: 10,
    justifyContent: 'space-between',
  },
  leftSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    maxWidth: 80,
  },
  serverRack: {
    width: '90%',
    aspectRatio: 0.5,
    backgroundColor: '#2a2a2a',
    borderRadius: 8,
    padding: 5,
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#333',
  },
  server: {
    height: '12%',
    backgroundColor: '#333',
    borderRadius: 4,
    padding: 3,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  serverLights: {
    flexDirection: 'row',
    gap: 3,
  },
  light: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  lightGreen: {
    backgroundColor: '#4CAF50',
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
  },
  lightBlue: {
    backgroundColor: '#2196F3',
    shadowColor: '#2196F3',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
  },
  networkCables: {
    width: '100%',
    height: 50,
    justifyContent: 'space-around',
    marginTop: 10,
  },
  cable: {
    height: 2,
    width: '80%',
    marginVertical: 2,
  },
  centerSection: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  workstationArea: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 10,
  },
  desk: {
    width: '40%',
    aspectRatio: 1.5,
    padding: 5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2a2a2a',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    margin: 5,
  },
  leftDesk: {
    marginRight: 10,
  },
  rightDesk: {
    marginLeft: 10,
  },
  topRow: {
    marginBottom: 10,
  },
  bottomRow: {
    marginTop: 10,
  },
  monitor: {
    width: '90%',
    height: '60%',
    alignItems: 'center',
  },
  screen: {
    width: '100%',
    height: '85%',
    backgroundColor: '#111',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#444',
    padding: 5,
    justifyContent: 'space-around',
    position: 'relative',
  },
  solvedScreen: {
    backgroundColor: '#1a4a1a',
    borderColor: '#2d5a2d',
  },
  screenContent: {
    height: 4,
    backgroundColor: '#333',
    borderRadius: 2,
  },
  checkmark: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -10 }, { translateY: -10 }],
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(76, 175, 80, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmarkText: {
    color: '#4CAF50',
    fontSize: 14,
    fontWeight: 'bold',
  },
  monitorStand: {
    width: '20%',
    height: '15%',
    backgroundColor: '#444',
    borderRadius: 4,
  },
  keyboard: {
    width: '80%',
    height: '20%',
    backgroundColor: '#333',
    marginTop: 5,
    borderRadius: 4,
    padding: 3,
    justifyContent: 'space-around',
  },
  keyboardRow: {
    height: 1,
    backgroundColor: '#444',
    borderRadius: 0.5,
  },
  mouse: {
    position: 'absolute',
    right: '15%',
    bottom: '15%',
    width: 10,
    height: 15,
    backgroundColor: '#444',
    borderRadius: 5,
  },
  rightSection: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 5,
    maxWidth: 100,
  },
  securityMonitors: {
    width: '100%',
    height: '40%',
    justifyContent: 'space-between',
    gap: 10,
  },
  securityMonitor: {
    width: '90%',
    aspectRatio: 1.5,
    backgroundColor: '#2a2a2a',
    borderRadius: 8,
    padding: 3,
    borderWidth: 1,
    borderColor: '#333',
  },
  monitorScreen: {
    flex: 1,
    backgroundColor: '#111',
    borderRadius: 4,
    padding: 2,
    justifyContent: 'space-around',
  },
  monitorGraph: {
    height: 20,
    backgroundColor: 'rgba(33, 150, 243, 0.2)',
    borderRadius: 4,
    borderTopWidth: 1,
    borderColor: '#2196F3',
  },
  monitorData: {
    height: 2,
    backgroundColor: '#2196F3',
    borderRadius: 1,
    marginVertical: 1,
  },
  securityFeatures: {
    width: '100%',
    alignItems: 'center',
    gap: 10,
  },
  camera: {
    width: 20,
    height: 25,
    alignItems: 'center',
  },
  cameraLens: {
    width: 15,
    height: 15,
    borderRadius: 7.5,
    backgroundColor: '#111',
    borderWidth: 1,
    borderColor: '#444',
  },
  cameraBody: {
    width: 8,
    height: 10,
    backgroundColor: '#333',
    marginTop: -3,
  },
  keypad: {
    width: 40,
    height: 50,
    backgroundColor: '#333',
    borderRadius: 4,
    padding: 3,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  keypadButton: {
    width: 10,
    height: 10,
    backgroundColor: '#444',
    borderRadius: 2,
  },
  firewallStatus: {
    width: '80%',
    alignItems: 'center',
    marginTop: 10,
  },
  firewallLabel: {
    color: '#fff',
    fontSize: 10,
    marginBottom: 3,
  },
  firewallIndicator: {
    width: '100%',
    height: 15,
    borderRadius: 7.5,
    borderWidth: 1,
  },
  firewallActive: {
    backgroundColor: 'rgba(76, 175, 80, 0.2)',
    borderColor: '#4CAF50',
  },
  firewallInactive: {
    backgroundColor: 'rgba(255, 0, 0, 0.2)',
    borderColor: '#FF5252',
  },
  staticEngineer: {
    position: 'absolute',
    width: 30,
    height: 60,
    alignItems: 'center',
    zIndex: 10,
    transform: [{ scale: 0.8 }],
  },
  engineerBody: {
    position: 'absolute',
    top: -15,
  },
  chair: {
    width: 40,
    height: 50,
    position: 'relative',
  },
  chairBack: {
    position: 'absolute',
    width: 30,
    height: 35,
    backgroundColor: '#444',
    borderRadius: 5,
    top: 0,
    left: 5,
  },
  chairSeat: {
    position: 'absolute',
    width: 40,
    height: 10,
    backgroundColor: '#444',
    borderRadius: 5,
    bottom: 15,
  },
  chairBase: {
    position: 'absolute',
    width: 10,
    height: 15,
    backgroundColor: '#333',
    bottom: 5,
    left: 15,
  },
  chairWheels: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 5,
  },
  wheel: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#222',
  },
  sittingBody: {
    height: 30,
    transform: [{ translateY: 5 }],
  },
  sittingLegs: {
    height: 20,
    transform: [{ translateY: -5 }],
  },
  sittingLeg: {
    transform: [{ rotate: '90deg' }],
  },
  head: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FFD5B5',
    position: 'relative',
  },
  hair: {
    position: 'absolute',
    top: -4,
    left: -2,
    width: 28,
    height: 18,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    backgroundColor: '#4A3626',
    transform: [{ rotate: '-5deg' }],
  },
  face: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  glasses: {
    width: 16,
    height: 6,
    backgroundColor: '#2196F3',
    borderRadius: 3,
    marginTop: 4,
  },
  smile: {
    width: 8,
    height: 4,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
    backgroundColor: '#FF69B4',
    marginTop: 2,
  },
  body: {
    width: 30,
    height: 35,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    marginTop: -4,
    position: 'relative',
  },
  labCoat: {
    position: 'absolute',
    top: 0,
    left: -2,
    right: -2,
    bottom: 0,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#EEEEEE',
  },
  badge: {
    position: 'absolute',
    top: 5,
    right: 2,
    width: 10,
    height: 15,
    backgroundColor: '#FF5252',
    borderRadius: 2,
  },
  legs: {
    width: 24,
    height: 25,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  leftLeg: {
    width: 10,
    height: '100%',
    backgroundColor: '#4A4A4A',
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
  },
  rightLeg: {
    width: 10,
    height: '100%',
    backgroundColor: '#4A4A4A',
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#2a2a2a',
    padding: 15,
    borderRadius: 10,
    width: '90%',
    maxWidth: 350,
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  modalTitle: {
    color: '#4CAF50',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  questionText: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 15,
    textAlign: 'center',
  },
  optionButton: {
    backgroundColor: '#3a3a3a',
    padding: 12,
    borderRadius: 5,
    marginVertical: 4,
    borderLeftWidth: 3,
    borderLeftColor: '#4CAF50',
  },
  optionText: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
  },
  bottomPadding: {
    height: TAB_BAR_HEIGHT + 20, // Extra padding at the bottom
  },
  progressContainer: {
    height: 20,
    backgroundColor: '#333',
    borderRadius: 10,
    margin: 10,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#4CAF50',
  },
  progressText: {
    position: 'absolute',
    color: '#fff',
    fontSize: 12,
    width: '100%',
    textAlign: 'center',
    lineHeight: 20,
  },
  hackerAttackBackground: {
    backgroundColor: '#2a1a1a',
  },
  interactiveDesk: {
    borderWidth: 2,
    borderColor: '#4CAF50',
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  hackedScreen: {
    backgroundColor: '#4a1a1a',
    borderColor: '#FF5252',
  },
  hackerText: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -5 }, { translateY: -10 }],
    color: '#FF5252',
    fontSize: 20,
    fontWeight: 'bold',
  },
  alertBadge: {
    backgroundColor: '#FF5250',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
    marginLeft: 10,
  },
  alertText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  tutorialOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
  tutorialBox: {
    backgroundColor: '#2a2a2a',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  tutorialTitle: {
    color: '#4CAF50',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  tutorialText: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 15,
    textAlign: 'center',
    lineHeight: 20,
  },
  tutorialButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignSelf: 'center',
  },
  tutorialButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  successOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
  successBox: {
    backgroundColor: '#2a2a2a',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    borderWidth: 1,
    borderColor: '#4CAF50',
    alignItems: 'center',
  },
  successTitle: {
    color: '#4CAF50',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  successText: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 15,
    textAlign: 'center',
  },
  successIcon: {
    width: 80,
    height: 80,
    backgroundColor: 'rgba(76, 175, 80, 0.2)',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#4CAF50',
    marginTop: 10,
  },
  successIconText: {
    fontSize: 40,
    color: '#4CAF50',
  },
  controls: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 5,
    borderRadius: 10,
    zIndex: 100,
  },
  controlRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlButton: {
    width: 35,
    height: 35,
    backgroundColor: 'rgba(76, 175, 80, 0.8)',
    borderRadius: 17.5,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 3,
  },
  controlButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  controlButtonSpacer: {
    width: 35,
    height: 35,
    margin: 3,
  },
  scoreContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 100,
  },
  scoreText: {
    color: '#4CAF50',
    fontWeight: 'bold',
    fontSize: 16,
  },
  malwareThreat: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 0, 0, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 5,
    borderWidth: 1,
    borderColor: '#FF5252',
    shadowColor: '#FF0000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
  },
  malwareIcon: {
    fontSize: 18,
  },
  helpButton: {
    position: 'absolute',
    top: 10,
    left: 10,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(76, 175, 80, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
  helpButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default PlatformerGame;
