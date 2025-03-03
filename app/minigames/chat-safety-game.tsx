import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Animated,
  Dimensions,
  Image,
  SafeAreaView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

interface Message {
  id: number;
  text: string;
  isBot: boolean;
  isPersonal: boolean;
  requiresInput?: boolean;
  options?: string[];
}

const messages: Message[] = [
  {
    id: 1,
    text: "Salut! 👋 Vrei să fim prieteni?",
    isBot: true,
    isPersonal: false,
    options: ["Accept cererea", "Refuz cererea"]
  },
  {
    id: 2,
    text: "Bună! Mă bucur că vrei să vorbim! Eu sunt Alex. Tu cum te numești?",
    isBot: true,
    isPersonal: true,
    requiresInput: true
  },
  {
    id: 3,
    text: "Ce faci? Îți place să te joci jocuri online?",
    isBot: true,
    isPersonal: false,
    options: ["Da, îmi place!", "Nu prea"]
  },
  {
    id: 4,
    text: "Super! În ce oraș stai? Poate locuim aproape și ne putem întâlni să ne jucăm!",
    isBot: true,
    isPersonal: true,
    options: ["Nu dau informații personale", "Vreau să răspund"],
    requiresInput: false
  },
  {
    id: 5,
    text: "La ce școală înveți? Poate te cunosc!",
    isBot: true,
    isPersonal: true,
    options: ["Prefer să nu spun", "Vreau să răspund"],
    requiresInput: false
  },
  {
    id: 6,
    text: "Hai să ne întâlnim în parc! Care e numărul tău de telefon să stabilim?",
    isBot: true,
    isPersonal: true,
    options: ["Nu pot să spun asta", "Vreau să răspund"],
    requiresInput: false
  }
];

export default function ChatSafetyGame() {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(-1);
  const [displayedMessages, setDisplayedMessages] = useState<Message[]>([]);
  const [lives, setLives] = useState(2);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(1));
  const [slideAnim] = useState(new Animated.Value(0));
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  const handleInput = () => {
    if (inputText.trim()) {
      const currentMessage = messages[currentMessageIndex];
      setDisplayedMessages([...displayedMessages, {
        id: Date.now(),
        text: inputText,
        isBot: false,
        isPersonal: false
      }]);
      setInputText('');
      setIsTyping(true);
      
      // Simulate typing delay
      setTimeout(() => {
        if (currentMessageIndex < messages.length - 1) {
          setCurrentMessageIndex(currentMessageIndex + 1);
          setDisplayedMessages(prev => [...prev, messages[currentMessageIndex + 1]]);
        } else {
          setGameWon(true);
          animateGameEnd();
        }
        setIsTyping(false);
      }, 1500);

      // Only penalize for sharing personal information if it's not the name input
      if (currentMessage.isPersonal && currentMessageIndex !== 1) {
        const newLives = lives - 1;
        setLives(newLives);
        if (newLives === 0) {
          setGameOver(true);
          animateGameEnd();
        }
      }
    }
  };

  const handleOption = (option: string, message: Message) => {
    if (option === "Refuz cererea") {
      setDisplayedMessages([...displayedMessages, {
        id: Date.now(),
        text: option,
        isBot: false,
        isPersonal: false
      }, {
        id: Date.now() + 1,
        text: "Nu ai vrut să comunicăm... La revedere! 👋",
        isBot: true,
        isPersonal: false
      }]);
      setTimeout(() => {
        setGameWon(true);
        animateGameEnd();
      }, 1500);
      return;
    }

    if (option === "Vreau să răspund") {
      messages[currentMessageIndex].requiresInput = true;
      setDisplayedMessages([...displayedMessages, {
        id: Date.now(),
        text: option,
        isBot: false,
        isPersonal: false
      }]);
      return;
    }

    setDisplayedMessages([...displayedMessages, {
      id: Date.now(),
      text: option,
      isBot: false,
      isPersonal: false
    }]);

    if (message.isPersonal && !option.includes("Nu") && !option.includes("Prefer")) {
      const newLives = lives - 1;
      setLives(newLives);
      if (newLives === 0) {
        setGameOver(true);
        animateGameEnd();
        return;
      }
    }

    setIsTyping(true);
    
    setTimeout(() => {
      if (currentMessageIndex < messages.length - 1) {
        setCurrentMessageIndex(currentMessageIndex + 1);
        setDisplayedMessages(prev => [...prev, messages[currentMessageIndex + 1]]);
      } else if (!message.isPersonal || option.includes("Nu") || option.includes("Prefer")) {
        setGameWon(true);
        animateGameEnd();
      }
      setIsTyping(false);
    }, 1500);
  };

  const animateGameEnd = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  };

  useEffect(() => {
    if (currentMessageIndex === -1) {
      setCurrentMessageIndex(0);
      setDisplayedMessages([messages[0]]);
    }
  }, []);

  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [displayedMessages]);

  const renderLives = () => {
    return (
      <View style={styles.livesContainer}>
        <Text style={styles.livesText}>Vieți rămase: </Text>
        {[...Array(lives)].map((_, index) => (
          <Text key={index} style={styles.calculatorEmoji}>💻</Text>
        ))}
        <Text style={styles.livesCounter}>{lives}/2</Text>
      </View>
    );
  };

  const renderMessage = (message: Message, index: number) => {
    return (
      <View 
        key={index} 
        style={[
          styles.messageContainer,
          message.isBot ? styles.botMessage : styles.userMessage
        ]}
      >
        {message.isBot && (
          <View style={styles.avatarContainer}>
            <View style={styles.avatarBackground}>
              <FontAwesome name="user-circle" size={30} color="#4CAF50" />
            </View>
            <View style={styles.onlineIndicator} />
          </View>
        )}
        <View style={[
          styles.messageBubble,
          message.isBot ? styles.botBubble : styles.userBubble
        ]}>
          <Text style={styles.messageText}>{message.text}</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
        keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 40}
      >
        <ScrollView 
          style={styles.mainScrollView}
          contentContainerStyle={styles.mainScrollViewContent}
          bounces={false}
        >
          <Text style={styles.title}>Chat în Siguranță</Text>
          <Text style={styles.subtitle}>
            Identifică întrebările personale și protejează-ți informațiile!
          </Text>
          {renderLives()}

          <Animated.View style={[styles.gameContainer, { opacity: fadeAnim }]}>
            <ScrollView
              ref={scrollViewRef}
              style={styles.messagesContainer}
              contentContainerStyle={styles.messagesContent}
            >
              {displayedMessages.map((message, index) => renderMessage(message, index))}
              {isTyping && (
                <View style={[styles.messageContainer, styles.botMessage]}>
                  <View style={styles.avatarContainer}>
                    <View style={styles.avatarBackground}>
                      <FontAwesome name="user-circle" size={30} color="#4CAF50" />
                    </View>
                  </View>
                  <View style={[styles.messageBubble, styles.typingBubble]}>
                    <Text style={styles.typingText}>Alex scrie...</Text>
                  </View>
                </View>
              )}
            </ScrollView>

            {currentMessageIndex >= 0 && 
             currentMessageIndex < messages.length && 
             !gameOver && 
             !gameWon && (
              <View style={styles.inputContainer}>
                {messages[currentMessageIndex].requiresInput ? (
                  <View style={styles.textInputContainer}>
                    <TextInput
                      style={styles.textInput}
                      value={inputText}
                      onChangeText={setInputText}
                      placeholder="Scrie un mesaj..."
                      placeholderTextColor="#8BA5B0"
                    />
                    <TouchableOpacity 
                      style={styles.sendButton}
                      onPress={handleInput}
                    >
                      <FontAwesome name="send" size={20} color="#FFFFFF" />
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View style={styles.optionsContainer}>
                    {messages[currentMessageIndex].options?.map((option, index) => (
                      <TouchableOpacity
                        key={index}
                        style={[
                          styles.optionButton,
                          { backgroundColor: option.includes("Nu") ? '#4CAF50' : '#FF4444' }
                        ]}
                        onPress={() => handleOption(option, messages[currentMessageIndex])}
                      >
                        <Text style={styles.optionText}>{option}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>
            )}
          </Animated.View>
        </ScrollView>

        {gameOver && (
          <Animated.View 
            style={[
              styles.completionMessage,
              {
                transform: [
                  { scale: slideAnim },
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
            <FontAwesome name="warning" size={60} color="#FF4444" style={styles.warningIcon} />
            <Text style={[styles.completionText, { color: '#FF4444' }]}>
              Ai fost hackuit!
            </Text>
            <Text style={styles.completionSubtext}>
              Ai oferit prea multe informații personale unui străin pe internet.
            </Text>
            <Text style={styles.completionDetails}>
              Nu da niciodată informații personale (nume complet, adresă, școală, număr de telefon) persoanelor necunoscute de pe internet!
            </Text>
            <TouchableOpacity 
              style={styles.retryButton}
              onPress={() => {
                setCurrentMessageIndex(-1);
                setDisplayedMessages([]);
                setLives(2);
                setGameOver(false);
                setGameWon(false);
                fadeAnim.setValue(1);
                slideAnim.setValue(0);
              }}
            >
              <View style={styles.buttonContent}>
                <FontAwesome name="refresh" size={24} color="#4CAF50" />
                <Text style={styles.retryText}>Încearcă din nou</Text>
              </View>
            </TouchableOpacity>
          </Animated.View>
        )}

        {gameWon && (
          <Animated.View 
            style={[
              styles.completionMessage,
              {
                transform: [
                  { scale: slideAnim },
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
            <FontAwesome name="shield" size={60} color="#4CAF50" style={styles.trophyIcon} />
            <Text style={[styles.completionText, { color: '#4CAF50' }]}>
              Felicitări!
            </Text>
            <Text style={styles.completionSubtext}>
              Ai protejat cu succes informațiile tale personale!
            </Text>
            <Text style={styles.completionDetails}>
              Continuă să fii precaut pe internet și nu da niciodată informații personale străinilor!
            </Text>
            <TouchableOpacity 
              style={[styles.retryButton, { borderColor: '#4CAF50' }]}
              onPress={() => {
                setCurrentMessageIndex(-1);
                setDisplayedMessages([]);
                setLives(2);
                setGameOver(false);
                setGameWon(false);
                fadeAnim.setValue(1);
                slideAnim.setValue(0);
              }}
            >
              <View style={styles.buttonContent}>
                <FontAwesome name="refresh" size={24} color="#4CAF50" />
                <Text style={styles.retryText}>Joacă din nou</Text>
              </View>
            </TouchableOpacity>
          </Animated.View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#8BA5B0',
    paddingTop: Platform.OS === 'android' ? 25 : 0,
  },
  container: {
    flex: 1,
  },
  mainScrollView: {
    flex: 1,
  },
  mainScrollViewContent: {
    padding: windowWidth * 0.05,
    paddingBottom: windowHeight * 0.1,
  },
  title: {
    fontSize: windowWidth < 380 ? 24 : 32,
    fontWeight: 'bold',
    color: '#1E1E1E',
    textAlign: 'center',
    marginTop: windowHeight * 0.02,
    marginBottom: windowHeight * 0.02,
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  subtitle: {
    fontSize: windowWidth < 380 ? 14 : 18,
    color: '#1E1E1E',
    textAlign: 'center',
    marginBottom: windowHeight * 0.02,
    opacity: 0.8,
    paddingHorizontal: '5%',
  },
  gameContainer: {
    flex: 1,
    backgroundColor: '#34495E',
    borderRadius: 20,
    overflow: 'hidden',
    minHeight: windowHeight * 0.65,
    padding: windowWidth * 0.03,
    borderWidth: 2,
    borderColor: '#4CAF50',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  messagesContainer: {
    flex: 1,
    maxHeight: windowHeight * 0.55,
    backgroundColor: '#ECF0F1',
    borderRadius: 15,
    padding: windowWidth * 0.03,
  },
  messagesContent: {
    paddingVertical: windowWidth * 0.03,
    paddingHorizontal: windowWidth * 0.02,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 15,
    alignItems: 'flex-end',
    opacity: 1,
    transform: [{ scale: 1 }],
    marginHorizontal: windowWidth * 0.02,
  },
  botMessage: {
    justifyContent: 'flex-start',
  },
  userMessage: {
    justifyContent: 'flex-end',
  },
  avatarContainer: {
    marginRight: 12,
    marginBottom: 4,
  },
  avatarBackground: {
    backgroundColor: '#34495E',
    borderRadius: 25,
    padding: 8,
    borderWidth: 2,
    borderColor: '#4CAF50',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  onlineIndicator: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 12,
    height: 12,
    backgroundColor: '#4CAF50',
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#1E1E1E',
  },
  messageBubble: {
    maxWidth: '75%',
    padding: 12,
    borderRadius: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  botBubble: {
    backgroundColor: '#3498DB',
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: '#2980B9',
  },
  userBubble: {
    backgroundColor: '#4CAF50',
    borderBottomRightRadius: 4,
    borderWidth: 1,
    borderColor: '#388E3C',
  },
  messageText: {
    color: '#FFFFFF',
    fontSize: 16,
    lineHeight: 22,
    letterSpacing: 0.3,
  },
  inputContainer: {
    borderTopWidth: 1,
    borderTopColor: '#2980B9',
    marginTop: 10,
  },
  textInputContainer: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: '#34495E',
    alignItems: 'center',
    borderRadius: 15,
  },
  textInput: {
    flex: 1,
    backgroundColor: '#2C3E50',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 12,
    color: '#FFFFFF',
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  sendButton: {
    backgroundColor: '#4CAF50',
    width: 45,
    height: 45,
    borderRadius: 22.5,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  optionsContainer: {
    padding: 12,
    backgroundColor: '#34495E',
    borderRadius: 15,
  },
  optionButton: {
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    borderWidth: 1,
  },
  optionText: {
    color: '#FFFFFF',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '500',
  },
  livesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: windowHeight * 0.02,
    backgroundColor: '#1E1E1E',
    padding: windowWidth * 0.02,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  livesText: {
    fontSize: 16,
    color: '#8BA5B0',
    fontWeight: 'bold',
  },
  calculatorEmoji: {
    fontSize: 20,
    marginHorizontal: 4,
  },
  livesCounter: {
    fontSize: 16,
    color: '#8BA5B0',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  completionMessage: {
    position: 'absolute',
    top: '40%',
    left: '5%',
    right: '5%',
    backgroundColor: '#1E1E1E',
    padding: 30,
    borderRadius: 20,
    alignItems: 'center',
    elevation: 10,
  },
  warningIcon: {
    marginBottom: 20,
  },
  trophyIcon: {
    marginBottom: 20,
  },
  completionText: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  completionSubtext: {
    fontSize: 18,
    color: '#8BA5B0',
    textAlign: 'center',
    marginBottom: 15,
  },
  completionDetails: {
    fontSize: 16,
    color: '#8BA5B0',
    textAlign: 'center',
    opacity: 0.8,
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#1E1E1E',
    padding: 15,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#FF4444',
    marginTop: 10,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  retryText: {
    color: '#4CAF50',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 10,
  },
  typingBubble: {
    backgroundColor: '#3498DB',
    paddingVertical: 10,
    paddingHorizontal: 15,
    opacity: 0.8,
  },
  typingText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontStyle: 'italic',
  },
}); 