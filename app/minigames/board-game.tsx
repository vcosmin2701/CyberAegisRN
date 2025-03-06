import React, { useState, useEffect } from 'react';
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

const allChallenges: Challenge[] = [
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
  },
  {
    id: 4,
    text: "Ai primit o ofertă de muncă online care pare prea bine să fie adevărată. Ce faci?",
    options: [
      {
        text: "Aplic imediat pentru că oferta e tentantă",
        isCorrect: false,
        points: -15,
        feedback: "Ofertele prea bune sunt adesea înșelătorii!"
      },
      {
        text: "Verific compania și cer mai multe detalii",
        isCorrect: true,
        points: 25,
        feedback: "Foarte bine! Ai fost precaut și ai verificat oferta!"
      },
      {
        text: "Împărtășesc oferta cu prietenii",
        isCorrect: false,
        points: -10,
        feedback: "Nu distribui oferte suspecte, chiar dacă par tentante!"
      }
    ]
  },
  {
    id: 5,
    text: "Un site îți oferă un premiu mare dacă completezi un formular. Ce faci?",
    options: [
      {
        text: "Completez formularul pentru că e gratis",
        isCorrect: false,
        points: -15,
        feedback: "Premiile 'gratuite' online sunt adesea înșelătorii!"
      },
      {
        text: "Verific legitimitatea site-ului și premiului",
        isCorrect: true,
        points: 20,
        feedback: "Excelent! Ai fost precaut și ai verificat oferta!"
      },
      {
        text: "Împărtășesc cu toți prietenii",
        isCorrect: false,
        points: -10,
        feedback: "Nu distribui oferte suspecte, chiar dacă par tentante!"
      }
    ]
  },
  {
    id: 6,
    text: "Ai primit un mesaj că ai câștigat un concurs la care nu te-ai înscris. Ce faci?",
    options: [
      {
        text: "Răspund pentru a primi premiul",
        isCorrect: false,
        points: -15,
        feedback: "Nu răspunde la mesaje despre premii la concursuri la care nu te-ai înscris!"
      },
      {
        text: "Ignor și blochez numărul",
        isCorrect: true,
        points: 25,
        feedback: "Foarte bine! Ai făcut alegerea corectă pentru siguranța ta!"
      },
      {
        text: "Trimit mai departe la prieteni",
        isCorrect: false,
        points: -10,
        feedback: "Nu distribui mesaje suspecte despre premii!"
      }
    ]
  },
  {
    id: 7,
    text: "Un site îți cere să descarci un program pentru a accesa un serviciu. Ce faci?",
    options: [
      {
        text: "Descarc direct pentru că e necesar",
        isCorrect: false,
        points: -15,
        feedback: "Nu descărca programe de la surse nesigure!"
      },
      {
        text: "Verific sursa și caut alternative sigure",
        isCorrect: true,
        points: 25,
        feedback: "Excelent! Ai verificat legitimitatea programului!"
      },
      {
        text: "Împărtășesc link-ul cu prietenii",
        isCorrect: false,
        points: -10,
        feedback: "Nu distribui link-uri pentru programe nesigure!"
      }
    ]
  },
  {
    id: 8,
    text: "Ai primit un mesaj că contul tău va fi blocat dacă nu faci verificare. Ce faci?",
    options: [
      {
        text: "Fac verificarea imediat",
        isCorrect: false,
        points: -15,
        feedback: "Nu oferi informații personale pentru verificări nesolicitate!"
      },
      {
        text: "Verific legitimitatea mesajului și contactez suportul",
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
    id: 9,
    text: "Un site îți oferă un discount mare pentru un produs. Ce faci?",
    options: [
      {
        text: "Cumpăr imediat pentru că oferta e limitată",
        isCorrect: false,
        points: -15,
        feedback: "Ofertele prea bune sunt adesea înșelătorii!"
      },
      {
        text: "Verific legitimitatea site-ului și ofertei",
        isCorrect: true,
        points: 25,
        feedback: "Excelent! Ai verificat legitimitatea ofertei!"
      },
      {
        text: "Împărtășesc oferta cu prietenii",
        isCorrect: false,
        points: -10,
        feedback: "Nu distribui oferte suspecte!"
      }
    ]
  },
  {
    id: 10,
    text: "Ai primit un mesaj că ai moștenit o sumă mare de bani. Ce faci?",
    options: [
      {
        text: "Răspund pentru a primi banii",
        isCorrect: false,
        points: -15,
        feedback: "Nu răspunde la mesaje despre moșteniri neașteptate!"
      },
      {
        text: "Ignor și blochez numărul",
        isCorrect: true,
        points: 25,
        feedback: "Foarte bine! Ai făcut alegerea corectă pentru siguranța ta!"
      },
      {
        text: "Trimit mai departe la prieteni",
        isCorrect: false,
        points: -10,
        feedback: "Nu distribui mesaje suspecte despre moșteniri!"
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
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [totalChallenges, setTotalChallenges] = useState(0);

  useEffect(() => {
    startNewGame();
  }, []);

  const startNewGame = () => {
    // Select 6 random challenges from the pool
    const shuffled = [...allChallenges].sort(() => 0.5 - Math.random());
    setChallenges(shuffled.slice(0, 6));
    setPosition(0);
    setScore(0);
    setGameOver(false);
    setShowChallenge(false);
    setCurrentChallenge(null);
    setDiceValue(0);
    setCorrectAnswers(0);
    setTotalChallenges(0);
  };

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
        // Show challenge every 4 positions
        if (newPosition % 4 === 0 && newPosition > 0) {
          const randomChallenge = challenges[Math.floor(Math.random() * challenges.length)];
          setCurrentChallenge(randomChallenge);
          setShowChallenge(true);
          setTotalChallenges(prev => prev + 1);
        }
      }
    });
  };

  const handleOptionSelect = (option: { points: number; feedback: string; isCorrect: boolean }) => {
    setScore(score + option.points);
    if (option.isCorrect) {
      setCorrectAnswers(prev => prev + 1);
    }
    setShowChallenge(false);
    setCurrentChallenge(null);
  };

  const resetGame = () => {
    startNewGame();
  };

  const getFeedback = () => {
    const maxPossibleScore = totalChallenges * 25; // Maximum points per challenge
    const scorePercentage = (score / maxPossibleScore) * 100;
    const correctPercentage = (correctAnswers / totalChallenges) * 100;

    let feedback = `Ai răspuns corect la ${correctAnswers} din ${totalChallenges} provocări (${correctPercentage.toFixed(0)}%)\n`;
    feedback += `Scorul tău: ${score} din ${maxPossibleScore} (${scorePercentage.toFixed(0)}%)\n\n`;

    if (scorePercentage >= 80 && correctPercentage >= 80) {
      feedback += "Excelent! Ești un erou al siguranței online! 🏆";
    } else if (scorePercentage >= 60 && correctPercentage >= 60) {
      feedback += "Foarte bine! Ai făcut multe alegeri sigure! 🌟";
    } else if (scorePercentage >= 40 && correctPercentage >= 40) {
      feedback += "Bun! Ai făcut câteva alegeri sigure! 👍";
    } else {
      feedback += "Mai ai de învățat despre siguranța online! 📚";
    }

    return feedback;
  };

  const renderBoard = () => {
    const cells = [];
    for (let i = 0; i < BOARD_SIZE; i++) {
      const isActive = i === position;
      const isVisited = i < position;
      const isChallenge = i % 4 === 0 && i > 0;
      cells.push(
        <View
          key={i}
          style={[
            styles.cell,
            isActive && styles.cellActive,
            isVisited && styles.cellVisited,
            isChallenge && styles.cellChallenge
          ]}
        >
          <Text style={styles.cellText}>{i + 1}</Text>
          {isChallenge && (
            <FontAwesome name="question-circle" size={12} color="#FFA500" />
          )}
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
                    name="question-circle"
                    size={24}
                    color="#8BA5B0"
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
              <View style={styles.statsContainer}>
                <Text style={styles.statsText}>
                  Provocări completate: <Text style={styles.statsHighlight}>{totalChallenges}</Text>
                </Text>
                <Text style={styles.statsText}>
                  Răspunsuri corecte: <Text style={styles.statsHighlight}>{correctAnswers}</Text>
                </Text>
                <Text style={styles.statsText}>
                  Scor final: <Text style={styles.statsHighlight}>{score}</Text>
                </Text>
              </View>
              <Text style={styles.feedbackText}>{getFeedback()}</Text>
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