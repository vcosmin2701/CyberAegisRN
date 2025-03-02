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
import { FontAwesome } from '@expo/vector-icons';

// Import images directly
const adImages = {
  fake1: require('../../assets/images/ads/Fake1.png'),
  fake2: require('../../assets/images/ads/Fake2.png'),
  fake3: require('../../assets/images/ads/Fake3.png'),
  fake4: require('../../assets/images/ads/Fake4.png'),
  fake5: require('../../assets/images/ads/Fake5.png'),
  fake6: require('../../assets/images/ads/Fake6.png'),
  real1: require('../../assets/images/ads/Real1.png'),
  real2: require('../../assets/images/ads/Real2.png'),
  real3: require('../../assets/images/ads/Real3.png'),
  real4: require('../../assets/images/ads/Real4.png'),
  real5: require('../../assets/images/ads/Real5.png'),
  real6: require('../../assets/images/ads/Real6.png'),
};

interface Ad {
  id: number;
  image: any;
  isFake: boolean;
  explanation: string;
  title: string;
}

const allAds = {
  fake: [
    {
      id: 1,
      image: adImages.fake1,
      isFake: true,
      title: "Câștigă un iPhone 10!",
      explanation: "Această reclamă este falsă deoarece folosește o roată a norocului și promite un iPhone 10 cu un singur click. Textul 'Foarte căcare' și designul strident sunt indicii clare că este o înșelătorie.",
    },
    {
      id: 2,
      image: adImages.fake2,
      isFake: true,
      title: "Câștigă 1 MILION € Instant!",
      explanation: "Reclamă falsă care promite câștiguri instant nerealiste de 1 milion de euro. Folosirea banilor și a termenului 'instant' sunt indicii clare ale unei înșelătorii.",
    },
    {
      id: 3,
      image: adImages.fake3,
      isFake: true,
      title: "Bonus 500% la Cazino!",
      explanation: "Reclamă falsă de cazino care promite bonusuri nerealiste de 500%. Cazinourile online neautorizate folosesc adesea astfel de tactici pentru a atrage utilizatori.",
    },
    {
      id: 4,
      image: adImages.fake4,
      isFake: true,
      title: "Credit Rapid 50.000€",
      explanation: "Reclamă falsă care promite credite rapide fără verificări. Sumele mari și lipsa verificărilor sunt semne clare că este o înșelătorie.",
    },
    {
      id: 5,
      image: adImages.fake5,
      isFake: true,
      title: "Bitcoin x10 Garantat",
      explanation: "Reclamă falsă care promite profit garantat din Bitcoin. Nicio investiție legitimă nu poate garanta profituri, mai ales de 10 ori suma investită.",
    },
    {
      id: 6,
      image: adImages.fake6,
      isFake: true,
      title: "Mercedes C-Class GRATIS",
      explanation: "Reclamă falsă care promite o mașină Mercedes gratuită. Premiile foarte scumpe oferite 'gratuit' sunt de obicei capcane pentru date personale.",
    }
  ],
  legit: [
    {
      id: 7,
      image: adImages.real1,
      isFake: false,
      title: "Mega Image - Oferte de Vară",
      explanation: "Reclamă legitimă de la Mega Image cu reduceri de vară verificabile. Prețurile sunt realiste și promoțiile pot fi verificate în magazine.",
    },
    {
      id: 8,
      image: adImages.real2,
      isFake: false,
      title: "Penny - Prețuri Mici",
      explanation: "Reclamă legitimă de la Penny Market cu oferte la produse de bază. Reducerile sunt realiste și verificabile în magazine.",
    },
    {
      id: 9,
      image: adImages.real3,
      isFake: false,
      title: "Kaufland - Săptămâna Aceasta",
      explanation: "Reclamă legitimă pentru promoțiile săptămânale Kaufland. Ofertele sunt clare și pot fi verificate în catalog și magazine.",
    },
    {
      id: 10,
      image: adImages.real4,
      isFake: false,
      title: "Lidl - Oferte de Joi",
      explanation: "Reclamă legitimă pentru ofertele de joi de la Lidl. Produsele și prețurile sunt transparente și verificabile.",
    },
    {
      id: 11,
      image: adImages.real5,
      isFake: false,
      title: "Carrefour - Fresh",
      explanation: "Reclamă legitimă cu reduceri la produse proaspete de la Carrefour. Prețurile și produsele sunt clar specificate.",
    },
    {
      id: 12,
      image: adImages.real6,
      isFake: false,
      title: "Auchan - Reduceri",
      explanation: "Reclamă legitimă cu promoții Auchan. Ofertele sunt prezentate transparent și au prețuri verificabile în magazine.",
    }
  ]
};

function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

export default function AdDetectorGame() {
  const [ads] = useState<Ad[]>(() => {
    // Alege random 3 reclame false din cele 6 disponibile
    const shuffledFake = shuffleArray(allAds.fake).slice(0, 3);
    // Alege random 3 reclame legitime din cele 6 disponibile
    const shuffledLegit = shuffleArray(allAds.legit).slice(0, 3);
    // Combină și amestecă cele 6 reclame selectate
    return shuffleArray([...shuffledFake, ...shuffledLegit]);
  });

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
    padding: '5%',
  },
  title: {
    fontSize: Dimensions.get('window').width < 380 ? 24 : 32,
    fontWeight: 'bold',
    color: '#1E1E1E',
    textAlign: 'center',
    marginBottom: '2%',
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  subtitle: {
    fontSize: Dimensions.get('window').width < 380 ? 14 : 18,
    color: '#1E1E1E',
    textAlign: 'center',
    marginBottom: '5%',
    opacity: 0.8,
    paddingHorizontal: '5%',
  },
  cardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
  },
  cardContainer: {
    width: Dimensions.get('window').width > 600 
      ? Dimensions.get('window').width * 0.25 
      : Dimensions.get('window').width * 0.4,
    aspectRatio: 0.75,
    margin: '2%',
    maxWidth: 300,
  },
  card: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    padding: '5%',
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
    padding: '5%',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: Dimensions.get('window').width < 380 ? 12 : 16,
    fontWeight: 'bold',
    color: '#8BA5B0',
    marginBottom: '4%',
    textAlign: 'center',
  },
  adImage: {
    width: '100%',
    height: '80%',
    borderRadius: 8,
    resizeMode: 'contain',
  },
  explanationText: {
    fontSize: Dimensions.get('window').width < 380 ? 12 : 14,
    color: '#8BA5B0',
    textAlign: 'center',
    lineHeight: Dimensions.get('window').width < 380 ? 16 : 20,
  },
  fakeIndicator: {
    fontSize: Dimensions.get('window').width < 380 ? 14 : 16,
    fontWeight: 'bold',
    color: '#FF4444',
    textAlign: 'center',
    marginTop: '5%',
  },
  completionMessage: {
    position: 'absolute',
    top: '50%',
    left: '5%',
    right: '5%',
    maxWidth: 600,
    alignSelf: 'center',
    transform: [{ translateY: -200 }],
    backgroundColor: '#1E1E1E',
    padding: Dimensions.get('window').width < 380 ? 20 : 30,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  trophyIcon: {
    marginBottom: '5%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  completionText: {
    fontSize: Dimensions.get('window').width < 380 ? 28 : 36,
    fontWeight: 'bold',
    color: '#8BA5B0',
    textAlign: 'center',
    marginBottom: '3%',
    textShadowColor: 'rgba(139, 165, 176, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  completionSubtext: {
    fontSize: Dimensions.get('window').width < 380 ? 16 : 20,
    color: '#8BA5B0',
    textAlign: 'center',
    marginBottom: '5%',
    paddingHorizontal: '5%',
  },
  completionDetails: {
    fontSize: Dimensions.get('window').width < 380 ? 14 : 16,
    color: '#8BA5B0',
    textAlign: 'center',
    marginBottom: '8%',
    opacity: 0.8,
    paddingHorizontal: '5%',
  },
  statsContainer: {
    width: '100%',
    marginTop: '5%',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '4%',
  },
  statText: {
    fontSize: Dimensions.get('window').width < 380 ? 14 : 16,
    color: '#8BA5B0',
    marginLeft: 10,
  },
}); 