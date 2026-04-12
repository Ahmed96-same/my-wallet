import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, setPersistence, browserLocalPersistence } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBvtqTu3A5as2IZCe4nONdyYq6Ntt4O1uw",
  authDomain: "my-wallet-458f7.firebaseapp.com",
  projectId: "my-wallet-458f7",
  storageBucket: "my-wallet-458f7.firebasestorage.app",
  messagingSenderId: "1009616809733",
  appId: "1:1009616809733:web:1fa37c3bfeff9877d7d16c"
};

const app  = initializeApp(firebaseConfig);
export const db   = getFirestore(app);
export const auth = getAuth(app);

// حفظ الجلسة محلياً حتى لا تضيع عند إغلاق التطبيق
setPersistence(auth, browserLocalPersistence).catch(() => {});
