import React, { useState, useEffect } from 'react';
import { styles } from '../styles/ad-detectorStyle';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  Animated,
  Dimensions,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { allAds, AdInfo } from '../../assets/images/ads/images';

function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

export default function AdDetectorGame() {
  const initializeGame = () => {
    const shuffledFake = shuffleArray(allAds.fake).slice(0, 3);
    const shuffledLegit = shuffleArray(allAds.legit).slice(0, 3);
    return shuffleArray([...shuffledFake, ...shuffledLegit]);
  };

  const [ads, setAds] = useState<AdInfo[]>(() => initializeGame());
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [foundFakes, setFoundFakes] = useState<number>(0);
  const [lives, setLives] = useState<number>(2);
  const [gameCompleted, setGameCompleted] = useState<boolean>(false);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [fadeOutAnim] = useState(new Animated.Value(1));
  const [celebrationAnim] = useState(new Animated.Value(0));
  const [gameOverAnim] = useState(new Animated.Value(0));
  const [flipAnimations, setFlipAnimations] = useState<{ [key: number]: Animated.Value }>(() =>
    ads.reduce((acc, ad) => ({ ...acc, [ad.id]: new Animated.Value(0) }), {})
  );

  const resetGame = () => {
    const newAds = initializeGame();
    setAds(newAds);
    setFlippedCards([]);
    setFoundFakes(0);
    setLives(2);
    setGameCompleted(false);
    setGameOver(false);
    fadeOutAnim.setValue(1);
    celebrationAnim.setValue(0);
    gameOverAnim.setValue(0);
    setFlipAnimations(
      newAds.reduce((acc, ad) => ({ ...acc, [ad.id]: new Animated.Value(0) }), {})
    );
  };

  useEffect(() => {
    if (gameCompleted || gameOver) {
      Animated.sequence([
        Animated.timing(fadeOutAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.spring(gameOver ? gameOverAnim : celebrationAnim, {
          toValue: 1,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [gameCompleted, gameOver]);

  const flipCard = (id: number) => {
    const ad = ads.find(a => a.id === id);
    if (!ad || flippedCards.includes(id)) return;

    Animated.spring(flipAnimations[id], {
      toValue: 1,
      friction: 8,
      tension: 10,
      useNativeDriver: true,
    }).start();

    setFlippedCards([...flippedCards, id]);

    if (ad.isFake) {
      const newFoundFakes = foundFakes + 1;
      setFoundFakes(newFoundFakes);
      if (newFoundFakes === 3) {
        setGameCompleted(true);
      }
    } else {
      // Dacă utilizatorul selectează o reclamă legitimă ca fiind falsă
      const newLives = lives - 1;
      setLives(newLives);
      if (newLives === 0) {
        setGameOver(true);
      }
    }
  };

  const getFlipInterpolation = (id: number) => {
    return flipAnimations[id].interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '180deg'],
    });
  };

  const renderCard = (ad: AdInfo) => {
    const flipRotation = getFlipInterpolation(ad.id);
    const flipRotationBack = flipAnimations[ad.id].interpolate({
      inputRange: [0, 1],
      outputRange: ['180deg', '360deg'],
    });

    return (
      <TouchableOpacity
        key={ad.id}
        style={styles.cardContainer}
        onPress={() => flipCard(ad.id)}
        disabled={flippedCards.includes(ad.id)}
      >
        <Animated.View
          style={[
            styles.card,
            {
              transform: [{ rotateY: flipRotation }],
              backfaceVisibility: 'hidden',
            },
          ]}
        >
          <Text style={styles.cardTitle}>{ad.title}</Text>
          <Image
            source={ad.image}
            style={styles.adImage}
            resizeMode="cover"
          />
        </Animated.View>
        <Animated.View
          style={[
            styles.cardBack,
            {
              transform: [{ rotateY: flipRotationBack }],
              backfaceVisibility: 'hidden',
            },
          ]}
        >
          <Text style={styles.explanationText}>{ad.explanation}</Text>
          {ad.isFake && (
            <Text style={styles.fakeIndicator}>
              Reclamă Falsă {foundFakes}/3
            </Text>
          )}
        </Animated.View>
      </TouchableOpacity>
    );
  };

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

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>
          <Text style={styles.title}>Detectorul de Reclame False</Text>
          <Text style={styles.subtitle}>
            Găsește cele 3 reclame false și află de ce sunt înșelătoare!
          </Text>
          {renderLives()}

          <Animated.View 
            style={[
              styles.cardsGrid,
              { opacity: fadeOutAnim }
            ]}
          >
            {ads.map(ad => renderCard(ad))}
          </Animated.View>
        </View>

        {gameCompleted && (
          <Animated.View 
            style={[
              styles.completionMessage,
              {
                transform: [
                  { scale: celebrationAnim },
                  {
                    translateY: celebrationAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [200, 0],
                    }),
                  },
                ],
              },
            ]}
          >
            <FontAwesome name="trophy" size={60} color="#FFD700" style={styles.trophyIcon} />
            <Text style={styles.completionText}>
              Felicitări!
            </Text>
            <Text style={styles.completionSubtext}>
              Ai identificat cu succes toate reclamele false!
            </Text>
            <Text style={styles.completionDetails}>
              Acum ești mai pregătit să identifici și să eviți reclamele înșelătoare în viitor.
            </Text>
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <FontAwesome name="check-circle" size={24} color="#4CAF50" />
                <Text style={styles.statText}>3/3 Reclame False Găsite</Text>
              </View>
              <View style={styles.statItem}>
                <FontAwesome name="star" size={24} color="#FFD700" />
                <Text style={styles.statText}>Expert în Detectarea Fraudelor</Text>
              </View>
            </View>
          </Animated.View>
        )}

        {gameOver && (
          <Animated.View 
            style={[
              styles.completionMessage,
              {
                transform: [
                  { scale: gameOverAnim },
                  {
                    translateY: gameOverAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [200, 0],
                    }),
                  },
                ],
              },
            ]}
          >
            <FontAwesome name="times-circle" size={60} color="#FF4444" style={styles.trophyIcon} />
            <Text style={[styles.completionText, { color: '#FF4444' }]}>
              Ai Pierdut!
            </Text>
            <Text style={styles.completionSubtext}>
              Nu-ți face griji, poți încerca din nou!
            </Text>
            <Text style={styles.completionDetails}>
              Hint: Verifică cu atenție detaliile reclamelor și gândește-te dacă ofertele sunt prea bune pentru a fi adevărate.
            </Text>
            <TouchableOpacity 
              style={styles.retryButton} 
              onPress={resetGame}
            >
              <View style={styles.statItem}>
                <FontAwesome name="refresh" size={24} color="#4CAF50" />
                <Text style={[styles.statText, styles.retryText]}>Încearcă din nou pentru un scor mai bun!</Text>
              </View>
            </TouchableOpacity>
          </Animated.View>
        )}
      </ScrollView>
    </SafeAreaView>
  )
};
