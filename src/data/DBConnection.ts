"use client";

import { initializeApp } from "firebase/app";
import {
  connectFirestoreEmulator,
  Firestore,
  getFirestore,
} from "firebase/firestore";

type Optional<Type> = Type | undefined;

export default class DBConnection {
  private static db: Optional<Firestore>;

  public static get() {
    if (this.db) {
      return this.db;
    }
    const firebaseConfig = {
      apiKey: "AIzaSyCtN7R96q0Xa3wasE0b6JQRyb52e0KSINY",
      authDomain: "twilight-imperium-360307.firebaseapp.com",
      projectId: "twilight-imperium-360307",
      storageBucket: "twilight-imperium-360307.appspot.com",
      messagingSenderId: "881312315045",
      appId: "1:881312315045:web:d43e66019ce64ecf623f4c",
    };
    const app = initializeApp(firebaseConfig);
    this.db = getFirestore(app);

    if (location.hostname === "localhost") {
      connectFirestoreEmulator(this.db, "127.0.0.1", 8020);
    }

    return this.db;
  }
}
