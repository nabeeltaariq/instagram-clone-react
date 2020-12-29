// For Firebase JS SDK v7.20.0 and later, measurementId is optional
import firebase from "firebase";

const firebaseApp = firebase.initializeApp({
  apiKey: "AIzaSyD_dWEwxxEAthoQTHuA-z8bk_bl6phtSL8",
  authDomain: "instagram-clone-react-5f7cf.firebaseapp.com",
  databaseURL:
    "https://instagram-clone-react-5f7cf-default-rtdb.firebaseio.com",
  projectId: "instagram-clone-react-5f7cf",
  storageBucket: "instagram-clone-react-5f7cf.appspot.com",
  messagingSenderId: "68600485576",
  appId: "1:68600485576:web:0570adeed5e3858520f7fd",
  measurementId: "G-DVF49990EW",
});

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { db, auth, storage };
