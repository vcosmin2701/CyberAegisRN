// import React, { useState } from "react";
// import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
// import { StackScreenProps } from "@react-navigation/stack";
// import { auth } from "../../firebaseConfig";
// import { signInWithEmailAndPassword } from "firebase/auth";

// type RootStackParamList = {
//   Login: undefined;
//   SignUp: undefined;
//   Home: undefined;
// };

// type Props = StackScreenProps<RootStackParamList, "Login">;

// const LoginScreen: React.FC<Props> = ({ navigation }) => {
//   const [email, setEmail] = useState<string>("");
//   const [password, setPassword] = useState<string>("");
//   const [error, setError] = useState<string>("");

//   const handleLogin = async () => {
//     try {
//       await signInWithEmailAndPassword(auth, email, password);
//       navigation.replace("Home");
//     } catch (error: unknown) {
//       if (error instanceof Error) {
//         setError(error.message);
//       } else {
//         setError("A apărut o eroare necunoscută.");
//       }
//     }

//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Login</Text>
//       <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={styles.input} />
//       <TextInput placeholder="Parolă" value={password} onChangeText={setPassword} secureTextEntry style={styles.input} />
//       {error ? <Text style={styles.errorText}>{error}</Text> : null}
//       <TouchableOpacity style={styles.button} onPress={handleLogin}>
//         <Text style={styles.buttonText}>Autentificare</Text>
//       </TouchableOpacity>
//       <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
//         <Text style={styles.linkText}>Nu ai cont? Creează unul aici!</Text>
//       </TouchableOpacity>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
//   title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
//   input: { width: "80%", padding: 10, borderWidth: 1, borderColor: "#ccc", marginVertical: 10, borderRadius: 5 },
//   button: { backgroundColor: "blue", padding: 10, width: "80%", borderRadius: 5, marginTop: 10 },
//   buttonText: { color: "white", textAlign: "center", fontWeight: "bold" },
//   linkText: { color: "blue", marginTop: 10 },
//   errorText: { color: "red", marginBottom: 10 },
// });

// export default LoginScreen;
