import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyBvk9QTsnyPeETSgsiqvsW2tTa2yUKrCfE",
  authDomain: "lab06-expense-66d4a.firebaseapp.com",
  projectId: "lab06-expense-66d4a",
  storageBucket: "lab06-expense-66d4a.firebasestorage.app",
  messagingSenderId: "222834633909",
  appId: "1:222834633909:web:548566e50473f4b049a2fc",
  measurementId: "G-BMRGEDKN8X"
};

const app = initializeApp(firebaseConfig);

export default app;