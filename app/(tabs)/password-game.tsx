import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  ScrollView,
  Animated,
  TouchableOpacity,
  Alert,
} from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { FontAwesome } from '@expo/vector-icons';

interface Rule {
  id: number;
  description: string;
  validator: (password: string, userName?: string) => boolean;
  points: number;
}

const passwordRules: Rule[] = [
  {
    id: 1,
    description: 'Parola trebuie să aibă cel puțin 8 caractere',
    validator: (password) => password.length >= 8,
    points: 10,
  },
  {
    id: 2,
    description: 'Parola trebuie să conțină cel puțin o literă mare',
    validator: (password) => /[A-Z]/.test(password),
    points: 15,
  },
  {
    id: 3,
    description: 'Parola trebuie să conțină cel puțin o literă mică',
    validator: (password) => /[a-z]/.test(password),
    points: 15,
  },
  {
    id: 4,
    description: 'Parola trebuie să conțină cel puțin un număr',
    validator: (password) => /[0-9]/.test(password),
    points: 20,
  },
  {
    id: 5,
    description: 'Parola trebuie să conțină cel puțin un caracter special (!@#$%^&*)',
    validator: (password) => /[!@#$%^&*]/.test(password),
    points: 25,
  },
  {
    id: 6,
    description: 'Parola nu poate conține numele tău',
    validator: (password, userName) => 
      userName ? !password.toLowerCase().includes(userName.toLowerCase()) : true,
    points: 15,
  },
  {
    id: 7,
    description: 'Parola nu poate conține secvențe comune (123, abc)',
    validator: (password) => 
      !/(123|abc|password|qwerty)/i.test(password),
    points: 20,
  },
  {
    id: 8,
    description: 'Parola nu poate avea caractere repetate de 3 sau mai multe ori',
    validator: (password) => !/(.)\1{2,}/.test(password),
    points: 20,
  },
];

export default function PasswordGame() {
  const [password, setPassword] = useState('');
  const [userName, setUserName] = useState('');
  const [score, setScore] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [strength] = useState(new Animated.Value(0));
  const drawerAnimation = useState(new Animated.Value(0))[0];

  const handlePasswordFocus = () => {
    if (!userName.trim()) {
      Alert.alert(
        "Nume lipsă",
        "Te rog să-ți introduci numele înainte de a crea o parolă.",
        [{ text: "OK" }]
      );
      return false;
    }
    return true;
  };

  useEffect(() => {
    if (!password) {
      setScore(0);
      return;
    }
    
    const totalPoints = passwordRules.reduce((acc, rule) => acc + rule.points, 0);
    const currentPoints = passwordRules.reduce((acc, rule) => 
      acc + (rule.validator(password, userName) ? rule.points : 0), 0);
    
    const strengthPercentage = (currentPoints / totalPoints) * 100;
    
    Animated.timing(strength, {
      toValue: strengthPercentage,
      duration: 300,
      useNativeDriver: false,
    }).start();

    setScore(currentPoints);
  }, [password, userName]);

  useEffect(() => {
    Animated.timing(drawerAnimation, {
      toValue: showSuggestions ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [showSuggestions]);

  const getStrengthColor = () => {
    const currentValue = (strength as any)._value;
    if (currentValue < 30) return '#FF4444';
    if (currentValue < 60) return '#FFA000';
    if (currentValue < 80) return '#FFEB3B';
    return '#4CAF50';
  };

  const toggleSuggestions = () => {
    setShowSuggestions(!showSuggestions);
  };

  const copyPassword = async () => {
    if (password) {
      try {
        await Clipboard.setStringAsync(password);
        Alert.alert('Succes!', 'Parola a fost copiată în clipboard!');
      } catch (error) {
        Alert.alert('Eroare', 'Nu am putut copia parola în clipboard.');
      }
    }
  };

  const failedRules = passwordRules.filter(
    rule => !rule.validator(password, userName)
  );

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Jocul Parolei Sigure</Text>
        
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Numele tău:</Text>
          <TextInput
            style={styles.input}
            value={userName}
            onChangeText={setUserName}
            placeholder="Introdu numele tău"
            placeholderTextColor="#6B8590"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Parola ta:</Text>
          <View style={styles.passwordInputContainer}>
            <TextInput
              style={[styles.input, styles.passwordInput]}
              value={password}
              onChangeText={setPassword}
              placeholder="Creează o parolă puternică"
              placeholderTextColor="#6B8590"
              secureTextEntry={!showPassword}
              onFocus={() => {
                if (!handlePasswordFocus()) {
                  return;
                }
              }}
            />
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={() => setShowPassword(!showPassword)}
            >
              <FontAwesome
                name={showPassword ? 'eye' : 'eye-slash'}
                size={24}
                color="#6B8590"
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.strengthContainer}>
          <Animated.View
            style={[
              styles.strengthBar,
              {
                width: strength.interpolate({
                  inputRange: [0, 100],
                  outputRange: ['0%', '100%'],
                }),
                backgroundColor: getStrengthColor(),
              },
            ]}
          />
        </View>

        <Text style={styles.scoreText}>
          Scor: {score} / {passwordRules.reduce((acc, rule) => acc + rule.points, 0)}
        </Text>

        <TouchableOpacity 
          style={styles.suggestionButton} 
          onPress={toggleSuggestions}
        >
          <Text style={styles.suggestionButtonText}>
            {failedRules.length} sugestii rămase
          </Text>
          <FontAwesome
            name={showSuggestions ? 'chevron-up' : 'chevron-down'}
            size={20}
            color="#6B8590"
            style={styles.suggestionArrow}
          />
        </TouchableOpacity>

        <Animated.View style={[
          styles.suggestionsContainer,
          {
            maxHeight: drawerAnimation.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 300]
            }),
            opacity: drawerAnimation,
            marginBottom: drawerAnimation.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 16]
            })
          }
        ]}>
          <ScrollView>
            {failedRules.map((rule) => (
              <View key={rule.id} style={styles.ruleItem}>
                <FontAwesome
                  name="times-circle"
                  size={24}
                  color="#FF4444"
                />
                <Text style={styles.ruleText}>{rule.description}</Text>
              </View>
            ))}
          </ScrollView>
        </Animated.View>

        {score === passwordRules.reduce((acc, rule) => acc + rule.points, 0) && (
          <TouchableOpacity style={styles.copyButton} onPress={copyPassword}>
            <Text style={styles.copyButtonText}>Copiază Parola</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#8BA5B0',
  },
  card: {
    flex: 1,
    backgroundColor: '#1E1E1E',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#8BA5B0',
    textAlign: 'center',
    marginBottom: 24,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  inputContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 18,
    color: '#8BA5B0',
    marginBottom: 8,
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#333',
    borderRadius: 12,
    padding: 16,
    color: '#8BA5B0',
    fontSize: 16,
    borderWidth: 2,
    borderColor: '#6B8590',
  },
  passwordInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#333',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#6B8590',
  },
  passwordInput: {
    flex: 1,
    backgroundColor: 'transparent',
    borderWidth: 0,
  },
  eyeIcon: {
    padding: 16,
  },
  strengthContainer: {
    height: 10,
    backgroundColor: '#333',
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#6B8590',
  },
  strengthBar: {
    height: '100%',
  },
  scoreText: {
    fontSize: 20,
    color: '#8BA5B0',
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: '600',
  },
  suggestionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#333',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#6B8590',
  },
  suggestionButtonText: {
    color: '#8BA5B0',
    fontSize: 18,
    fontWeight: '600',
    marginRight: 8,
  },
  suggestionArrow: {
    marginLeft: 8,
  },
  suggestionsContainer: {
    overflow: 'hidden',
  },
  ruleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#333',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: '#6B8590',
  },
  ruleText: {
    flex: 1,
    color: '#8BA5B0',
    marginLeft: 12,
    fontSize: 16,
  },
  copyButton: {
    backgroundColor: '#6B8590',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
    borderWidth: 2,
    borderColor: '#8BA5B0',
  },
  copyButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
}); 