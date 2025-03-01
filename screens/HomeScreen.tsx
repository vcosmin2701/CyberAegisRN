// import React from "react";
// import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
// import { StackScreenProps } from "@react-navigation/stack";
// import { auth } from "../../firebaseConfig";

// type RootStackParamList = {
//   Login: undefined;
//   Home: undefined;
// };

// type Props = StackScreenProps<RootStackParamList, "Home">;

// const HomeScreen: React.FC<Props> = ({ navigation }) => {
//   const handleLogout = () => {
//     auth.signOut();
//     navigation.replace("Login");
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Bine ai venit!</Text>
//       <Text style={styles.email}>{auth.currentUser?.email}</Text>
//       <TouchableOpacity style={styles.button} onPress={handleLogout}>
//         <Text style={styles.buttonText}>Deconectare</Text>
//       </TouchableOpacity>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flex: 1, justifyContent: "center", alignItems: "center" },
//   title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
//   email: { fontSize: 18, marginBottom: 20 },
//   button: { backgroundColor: "red", padding: 10, width: "80%", borderRadius: 5 },
//   buttonText: { color: "white", textAlign: "center", fontWeight: "bold" },
// });

// export default HomeScreen;
