import React, { useState, useEffect, useRef } from 'react';
import { styles } from '../styles/chatsafetygameStyle';
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
            {lives === 1 ? (
              <>
                <Text style={[styles.completionSubtext, { color: '#FFA500' }]}>
                  Ai reușit, dar ai dezvăluit unele informații personale!
                </Text>
                <Text style={[styles.completionDetails, { color: '#FFA500' }]}>
                  Ai supraviețuit, dar ai dat totuși unele date personale. Data viitoare fii mai atent și nu dezvălui nicio informație personală!
                </Text>
              </>
            ) : (
              <>
                <Text style={styles.completionSubtext}>
                  Ai protejat cu succes informațiile tale personale!
                </Text>
                <Text style={styles.completionDetails}>
                  Continuă să fii precaut pe internet și nu da niciodată informații personale străinilor!
                </Text>
              </>
            )}
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
; 