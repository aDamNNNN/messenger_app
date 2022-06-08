// Import the functions you need from the SDKs you need
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore'
//import "firebase/auth"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAr7j6ncHyAIYhw6HGol6oGkYEjq4gknP8",
  authDomain: "chat-7ae9d.firebaseapp.com",
  projectId: "chat-7ae9d",
  storageBucket: "chat-7ae9d.appspot.com",
  messagingSenderId: "259102587667",
  appId: "1:259102587667:web:a16c91c5512234b06178e6"
};

// Initialize Firebase

const app = !firebase.apps.length ? firebase.initializeApp(firebaseConfig) : firebase.app();

const auth = app.auth()

export {auth, firebase};