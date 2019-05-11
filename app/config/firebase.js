
import * as firebase from "firebase";
import 'firebase/firestore';
import 'firebase/auth'

class Firebase {

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
    return firebase.firestore();
  }

  /**
   * Get Auth
   */
  static getAuth() {
    return firebase.auth();
  }

  /**
   * Get Storage
   */
  static getStorage() {
    return firebase.storage();
  }

  static getImageRef() {
    // Create a child reference
    // Get a reference to the storage service, which is used to create references in your storage bucket
    const storage = this.getStorage();

    // Create a storage reference from our storage service
    const storageRef = storage.ref();
    return storageRef.child('images');
    // imagesRef now points to 'images'
  }

  static getImageFilePoints(fileName) {
    // Points to 'images/space.jpg'
    // Note that you can use variables to create child values
    return this.imagesRef.child(fileName);
  }

  /**
   * Get Firebase to chech inizialaized
   */
  static get firebaseAppsLength() {
    return firebase.apps.length;
  }

}

module.exports = Firebase;

// // Import the Firebase modules that you need in your app.
// import firebase from 'firebase/app';
// // import 'firebase/auth';
// // import 'firebase/database';
// // import 'firebase/datastore';
// import 'firebase/firestore';

// // Initalize and export Firebase.
// const config = {
//     apiKey: "AIzaSyAcpsU9qetEPm-8KGTS5sATbZ7fcaOESFM",
//     authDomain: "get-voice-4d167.firebaseapp.com",
//     databaseURL: "https://get-voice-4d167.firebaseio.com",
//     projectId: "get-voice-4d167",
//     storageBucket: "get-voice-4d167.appspot.com",
//     messagingSenderId: "479996889138"
// };
// export default firebase.initializeApp(config);