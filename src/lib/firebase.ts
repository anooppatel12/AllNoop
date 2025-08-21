
import { initializeApp, getApps, getApp } from "firebase/app";

// Your web app's Firebase configuration
// IMPORTANT: This is a public configuration and is safe to expose.
const firebaseConfig = {
  apiKey: "AIzaSyCunPeh6H5VjztyO0rFP_IVTWjJu1iasfo",
  authDomain: "connect-9cfb7.firebaseapp.com",
  databaseURL: "https://connect-9cfb7-default-rtdb.firebaseio.com/",
  projectId: "connect-9cfb7",
  storageBucket: "connect-9cfb7.appspot.com",
  messagingSenderId: "431305405689",
  appId: "1:431305405689:web:7145969ba83a7cdbed5e28"
};

// Initialize Firebase
export function getFirebaseApp() {
    if (!getApps().length) {
        return initializeApp(firebaseConfig);
    } else {
        return getApp();
    }
}
