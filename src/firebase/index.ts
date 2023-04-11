// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { FacebookAuthProvider, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCEtfd42e7DeEwY_TK5JNUJWjqXbymIaP0",
  authDomain: "fly-shoes-store.firebaseapp.com",
  projectId: "fly-shoes-store",
  storageBucket: "fly-shoes-store.appspot.com",
  messagingSenderId: "663807445760",
  appId: "1:663807445760:web:c6afb2669a99d05440c1e5",
  measurementId: "G-X1NTHECM7J"
};

const fbProvider = new FacebookAuthProvider();
const ggProvider = new GoogleAuthProvider();
ggProvider.setCustomParameters({
  'display':'popup'
})
fbProvider.setCustomParameters({
  'display': 'popup'
});

const firebaseApp = initializeApp(firebaseConfig);
const databaseRealTime = getFirestore(firebaseApp);

export {
  firebaseApp,
  fbProvider,
  ggProvider,
  databaseRealTime
};
