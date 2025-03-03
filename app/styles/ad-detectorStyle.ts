import { StyleSheet, Dimensions } from 'react-native';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export const styles = StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: '#8BA5B0',
    },
    scrollView: {
      flex: 1,
    },
    scrollViewContent: {
      flexGrow: 1,
      paddingBottom: 80, // Space for navigation bar
    },
    container: {
      flex: 1,
      paddingHorizontal: '5%', // Folosește procentaj în loc de pixel fix
      justifyContent: 'center',
      alignItems: 'center',
  
    },
    title: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#1E1E1E',
      textAlign: 'center',
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
    cardsGrid: {
      flex: 1, 
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',
      alignItems: 'center',
      gap: 10, // Adaugă spațiu automat între elemente
    },
    cardContainer: {
      flex: 1, // Ocupă un spațiu flexibil în container
      aspectRatio: 0.75, // Menține proporțiile
      margin: 10, // Înlocuiește calculul de margine cu Dimensions
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
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: '5%',
      maxWidth: 600,
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
    retryButton: {
      backgroundColor: '#1E1E1E',
      padding: 15,
      borderRadius: 10,
      borderWidth: 2,
      borderColor: '#4CAF50',
      marginTop: 10,
    },
    retryText: {
      color: '#4CAF50',
      fontWeight: 'bold',
    },
  })