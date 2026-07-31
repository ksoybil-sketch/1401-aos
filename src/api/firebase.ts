import { initializeApp, getApps } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyBu_no85_O-PlUVqUfsmPyEDGYdegON_YU",
  authDomain: "aos-f954d.firebaseapp.com",
  projectId: "aos-f954d",
  storageBucket: "aos-f954d.firebasestorage.app",
  messagingSenderId: "961617337872",
  appId: "1:961617337872:web:9080896bab889eb3b6f495"
};

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
export const db = getDatabase(app);
export default app;
