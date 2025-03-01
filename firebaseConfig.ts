import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "",
  authDomain: "cyberaegiesrn.firebaseapp.com",
  projectId: "cyberaegiesrn",
  storageBucket: "cyberaegiesrn.appspot.com",
  messagingSenderId: "",
  appId: "",
};

// Inițializează Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
