
import * as firebase from "firebase";
import 'firebase/firestore';
import 'firebase/auth'

export default class Firebase {

  /**
   * Initialises Firebase
   */
  static initialize() {
    firebase.initializeApp({
      apiKey: "AIzaSyAcpsU9qetEPm-8KGTS5sATbZ7fcaOESFM",
      authDomain: "get-voice-4d167.firebaseapp.com",
      databaseURL: "https://get-voice-4d167.firebaseio.com",
      projectId: "get-voice-4d167",
      storageBucket: "get-voice-4d167.appspot.com",
      messagingSenderId: "479996889138"
    });
  }

  /**
   * Get firebase
   */
  static getFirebase() {
    return firebase;
  }

  /**
   * Get Firestore
   */
  static getFirestore() {
    this.checkInitialize();

    return firebase.firestore();
  }

  /**
   * Get Auth
   */
  static getAuth() {
    this.checkInitialize();

    return firebase.auth();
  }

  /**
   * Get Storage
   */
  static getStorage() {
    this.checkInitialize();

    return firebase.storage();
  }

  static checkInitialize() {
    if (!this.firebaseAppsLength) {
      console.log('Firebase NOT Inizialized');
      this.initialize();
    }
  }

  /**
   * Get Firebase to chech inizialaized
   */
  static get firebaseAppsLength() {
    return firebase.apps.length;
  }

}