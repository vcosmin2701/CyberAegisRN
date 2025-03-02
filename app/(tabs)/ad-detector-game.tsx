import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  Animated,
  Dimensions,
} from 'react-native';
import { adImages } from '../../assets/images/ads';
import { FontAwesome } from '@expo/vector-icons';

interface Ad {
  id: number;
  image: any;
  isFake: boolean;
  explanation: string;
  title: string;
}

const ads: Ad[] = [
  {
    id: 1,
    image: adImages.fake1,
    isFake: true,
    title: "Câștigă iPhone 15 GRATIS!",
    explanation: "Această reclamă este falsă deoarece promite un produs scump gratuit fără condiții clare. De obicei, astfel de oferte sunt folosite pentru a colecta date personale sau pentru fraude.",
  },
  {
    id: 2,
    image: adImages.legit1,
    isFake: false,
    title: "Reduceri Black Friday - eMAG",
    explanation: "Aceasta este o reclamă legitimă de la un comerciant cunoscut, cu reduceri în perioada specifică Black Friday.",
  },
  {
    id: 3,
    image: adImages.fake2,
    isFake: true,
    title: "Câștigă 10,000€ în 24 ore!",
    explanation: "Reclamă falsă care promite câștiguri nerealiste într-un timp foarte scurt. Este o tactică comună în schemele piramidale sau înșelătorii.",
  },
  {
    id: 4,
    image: adImages.legit2,
    isFake: false,
    title: "Lidl - Oferte săptămânale",
    explanation: "Reclamă legitimă cu oferte săptămânale de la un lanț de magazine cunoscut.",
  },
  {
    id: 5,
    image: adImages.fake3,
    isFake: true,
    title: "Tratament miraculos - vindecă orice boală!",
    explanation: "Reclamă falsă care promite vindecări miraculoase. Afirmațiile medicale exagerate sunt semne clare de înșelătorie.",
  },
  {
    id: 6,
    image: adImages.legit3,
    isFake: false,
    title: "Kaufland - Promoții locale",
    explanation: "Reclamă legitimă cu promoții locale de la un supermarket cunoscut.",
  },
];

export default function AdDetectorGame() {
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [foundFakes, setFoundFakes] = useState<number>(0);
  const [gameCompleted, setGameCompleted] = useState<boolean>(false);
  const [fadeOutAnim] = useState(new Animated.Value(1));
  const [celebrationAnim] = useState(new Animated.Value(0));
  const [flipAnimations] = useState<{ [key: number]: Animated.Value }>(() =>
    ads.reduce((acc, ad) => ({ ...acc, [ad.id]: new Animated.Value(0) }), {})
  );

  useEffect(() => {
    if (gameCompleted) {
      Animated.sequence([
        Animated.timing(fadeOutAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.spring(celebrationAnim, {
          toValue: 1,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [gameCompleted]);

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
    }
  };

  const getFlipInterpolation = (id: number) => {
    return flipAnimations[id].interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '180deg'],
    });
  };

  const renderCard = (ad: Ad) => {
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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Detectorul de Reclame False</Text>
      <Text style={styles.subtitle}>
        Găsește cele 3 reclame false și află de ce sunt înșelătoare!
      </Text>
      
      <Animated.View 
        style={[
          styles.cardsGrid,
          { opacity: fadeOutAnim }
        ]}
      >
        {ads.map(ad => renderCard(ad))}
      </Animated.View>

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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#8BA5B0',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1E1E1E',
    textAlign: 'center',
    marginBottom: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  subtitle: {
    fontSize: 18,
    color: '#1E1E1E',
    textAlign: 'center',
    marginBottom: 30,
    opacity: 0.8,
  },
  cardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  cardContainer: {
    width: Dimensions.get('window').width * 0.4,
    height: 200,
    margin: 10,
  },
  card: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    padding: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  cardBack: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    padding: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#8BA5B0',
    marginBottom: 8,
    textAlign: 'center',
  },
  adImage: {
    width: '100%',
    height: '80%',
    borderRadius: 8,
  },
  explanationText: {
    fontSize: 14,
    color: '#8BA5B0',
    textAlign: 'center',
  },
  fakeIndicator: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF4444',
    textAlign: 'center',
    marginTop: 10,
  },
  completionMessage: {
    position: 'absolute',
    top: '50%',
    left: '5%',
    right: '5%',
    transform: [{ translateY: -200 }],
    backgroundColor: '#1E1E1E',
    padding: 30,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  trophyIcon: {
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  completionText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#8BA5B0',
    textAlign: 'center',
    marginBottom: 10,
    textShadowColor: 'rgba(139, 165, 176, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  completionSubtext: {
    fontSize: 20,
    color: '#8BA5B0',
    textAlign: 'center',
    marginBottom: 20,
  },
  completionDetails: {
    fontSize: 16,
    color: '#8BA5B0',
    textAlign: 'center',
    marginBottom: 30,
    opacity: 0.8,
  },
  statsContainer: {
    width: '100%',
    marginTop: 20,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  statText: {
    fontSize: 16,
    color: '#8BA5B0',
    marginLeft: 10,
  },
}); 