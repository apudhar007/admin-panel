import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBoz7W1jMWPJi6wPTgh5Q4sojvc1AJk9xo",
  authDomain: "admin-panel-df8ff.firebaseapp.com",
  projectId: "admin-panel-df8ff",
  storageBucket: "admin-panel-df8ff.appspot.com",
  messagingSenderId: "324878160217",
  appId: "1:324878160217:web:1b59b254380798d55dfc48",
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
