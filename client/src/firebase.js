// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "e-shop-e6243.firebaseapp.com",
  projectId: "e-shop-e6243",
  storageBucket: "e-shop-e6243.appspot.com",
  messagingSenderId: "685129514604",
  appId: "1:685129514604:web:f92f05e17e27f23881e249",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
