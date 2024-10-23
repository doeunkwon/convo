import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyA7Xh1Idl4MkXe02REuZQrahUeDWhpDj3c",
  authDomain: "convo-dev-37db9.firebaseapp.com",
  projectId: "convo-dev-37db9",
  storageBucket: "convo-dev-37db9.appspot.com",
  messagingSenderId: "186699353043",
  appId: "1:186699353043:web:8e9fb8eb83d2f6bb313d26",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
