import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Modal, TextInput, Alert } from 'react-native';
import EngineerCharacter from './EngineerCharacter';
import MovementController from './MovementController';

interface HackerLabProps {
  visible: boolean;
  onComplete: () => void;
  onExit: () => void;
}

const HackerLab: React.FC<HackerLabProps> = ({ visible, onComplete, onExit }) => {
  const [position, setPosition] = useState({ left: 40, top: 150 });
  const [showComputer, setShowComputer] = useState(false);
  const [showCabinet, setShowCabinet] = useState(false);
  const [password, setPassword] = useState('');
  const [foundPassword, setFoundPassword] = useState(false);
  
  const correctPassword = 'CyberAegis2024!';

  const handleComputerPress = () => {
    if (Math.abs(position.left - 300) < 50 && Math.abs(position.top - 150) < 50) {
      setShowComputer(true);
    }
  };

  const handleCabinetPress = () => {
    if (Math.abs(position.left - 100) < 50 && Math.abs(position.top - 250) < 50) {
      setShowCabinet(true);
      setFoundPassword(true);
    }
  };

  const handlePasswordSubmit = () => {
    if (password === correctPassword) {
      onComplete();
    } else {
      Alert.alert('Parolă incorectă', 'Încearcă să găsești parola corectă în laborator.');
    }
  };

  const handlePositionChange = (newPosition: { left: number; top: number }) => {
    // Verifică limitele laboratorului
    const maxLeft = 350;
    const maxTop = 400;
    const newLeft = Math.max(0, Math.min(newPosition.left, maxLeft));
    const newTop = Math.max(0, Math.min(newPosition.top, maxTop));
    
    setPosition({ left: newLeft, top: newTop });
  };

  return (
    <Modal visible={visible} animationType="fade">
      <View style={styles.container}>
        <Text style={styles.title}>Laboratorul Hackerului</Text>
        
        {/* Exit Button */}
        <TouchableOpacity style={styles.exitButton} onPress={onExit}>
          <Text style={styles.exitText}>← Înapoi</Text>
        </TouchableOpacity>

        {/* Hacker's Computer */}
        <TouchableOpacity 
          style={styles.computer}
          onPress={handleComputerPress}
        >
          <View style={styles.monitor}>
            <View style={styles.screen} />
          </View>
          <View style={styles.base} />
        </TouchableOpacity>

        {/* File Cabinet */}
        <TouchableOpacity 
          style={styles.cabinet}
          onPress={handleCabinetPress}
        >
          <View style={styles.cabinetDoor} />
        </TouchableOpacity>

        {/* Server Racks */}
        <View style={styles.serverRack}>
          {[...Array(5)].map((_, i) => (
            <View key={i} style={styles.server} />
          ))}
        </View>

        {/* Character */}
        <EngineerCharacter position={position} />

        {/* Computer Screen Modal */}
        <Modal visible={showComputer} transparent animationType="fade">
          <View style={styles.computerModal}>
            <View style={styles.computerContent}>
              <Text style={styles.computerTitle}>Terminal Acces</Text>
              <TextInput
                style={styles.passwordInput}
                placeholder="Introdu parola"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity 
                style={styles.submitButton}
                onPress={handlePasswordSubmit}
              >
                <Text style={styles.submitText}>Conectare</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setShowComputer(false)}
              >
                <Text style={styles.closeText}>Închide</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Cabinet Note Modal */}
        <Modal visible={showCabinet} transparent animationType="fade">
          <View style={styles.cabinetModal}>
            <View style={styles.noteContent}>
              <Text style={styles.noteTitle}>Notă Găsită</Text>
              <Text style={styles.noteText}>
                Parolă administrator:{'\n'}
                {correctPassword}{'\n\n'}
                * Conține litere mari și mici{'\n'}
                * Include anul curent{'\n'}
                * Are un caracter special{'\n'}
                * Este memorabilă
              </Text>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setShowCabinet(false)}
              >
                <Text style={styles.closeText}>Închide</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Movement Controller */}
        <MovementController
          initialPosition={position}
          onPositionChange={handlePositionChange}
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    padding: 20,
  },
  title: {
    fontSize: 24,
    color: '#00ff00',
    textAlign: 'center',
    marginTop: 20,
  },
  exitButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    padding: 10,
    zIndex: 1,
  },
  exitText: {
    color: '#00ff00',
    fontSize: 18,
  },
  computer: {
    position: 'absolute',
    right: 100,
    top: 150,
  },
  monitor: {
    width: 80,
    height: 60,
    backgroundColor: '#333',
    borderRadius: 5,
  },
  screen: {
    width: 70,
    height: 50,
    backgroundColor: '#000',
    margin: 5,
  },
  base: {
    width: 40,
    height: 10,
    backgroundColor: '#333',
    marginLeft: 20,
  },
  cabinet: {
    position: 'absolute',
    left: 100,
    top: 250,
    width: 60,
    height: 100,
    backgroundColor: '#444',
  },
  cabinetDoor: {
    width: 50,
    height: 90,
    margin: 5,
    backgroundColor: '#333',
  },
  serverRack: {
    position: 'absolute',
    right: 30,
    top: 50,
    width: 80,
    height: 300,
    backgroundColor: '#333',
    padding: 5,
  },
  server: {
    width: 70,
    height: 50,
    backgroundColor: '#222',
    marginVertical: 5,
    borderRadius: 3,
  },
  computerModal: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  computerContent: {
    width: '80%',
    backgroundColor: '#000',
    padding: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#00ff00',
  },
  computerTitle: {
    color: '#00ff00',
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 20,
  },
  passwordInput: {
    backgroundColor: '#111',
    color: '#00ff00',
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#00ff00',
    marginBottom: 20,
  },
  submitButton: {
    backgroundColor: '#00ff00',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  submitText: {
    color: '#000',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  closeButton: {
    backgroundColor: '#333',
    padding: 10,
    borderRadius: 5,
  },
  closeText: {
    color: '#fff',
    textAlign: 'center',
  },
  cabinetModal: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  noteContent: {
    width: '80%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
  },
  noteTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  noteText: {
    fontSize: 16,
    marginBottom: 20,
    lineHeight: 24,
  },
});

export default HackerLab; 