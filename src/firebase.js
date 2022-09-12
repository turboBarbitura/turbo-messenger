import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

//Копируется после создания проекта фаербейз. Со всеми ключами.

const firebaseConfig = {
  apiKey: "AIzaSyCaa8bEw6xX3lsqzJW1vYhUbZsYj5UMuJk",
  authDomain: "react-chat-45934.firebaseapp.com",
  projectId: "react-chat-45934",
  storageBucket: "react-chat-45934.appspot.com",
  messagingSenderId: "1067494365713",
  appId: "1:1067494365713:web:85c07d81d513c94dceefb0"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const storage = getStorage();
export const db = getFirestore()