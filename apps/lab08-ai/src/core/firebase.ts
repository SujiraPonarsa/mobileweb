import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAM_sYTS9hdeQZ3Ml__ovSPffZzc2WWdsc",
  authDomain: "lab08-ai-8d8d2.firebaseapp.com",
  projectId: "lab08-ai-8d8d2",
  storageBucket: "lab08-ai-8d8d2.firebasestorage.app",
  messagingSenderId: "719800972153",
  appId: "1:719800972153:web:8743daba92239b62b1b5a8",
  measurementId: "G-5LXVHMGSB9"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);