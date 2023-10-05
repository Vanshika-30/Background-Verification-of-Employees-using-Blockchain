import 'package:firebase_core/firebase_core.dart' show FirebaseOptions;
import 'package:flutter/foundation.dart'
    show defaultTargetPlatform, kIsWeb, TargetPlatform;

class DefaultFirebaseOptions {
  static FirebaseOptions get currentPlatform {
    if (kIsWeb) {
      return web;
    }
    switch (defaultTargetPlatform) {
      case TargetPlatform.android:
        return android;
      case TargetPlatform.iOS:
        throw UnsupportedError(
          'DefaultFirebaseOptions have not been configured for ios - '
          'you can reconfigure this by running the FlutterFire CLI again.',
        );
      case TargetPlatform.macOS:
        throw UnsupportedError(
          'DefaultFirebaseOptions have not been configured for macos - '
          'you can reconfigure this by running the FlutterFire CLI again.',
        );
      default:
        throw UnsupportedError(
          'DefaultFirebaseOptions are not supported for this platform.',
        );
    }
  }

  static const FirebaseOptions web = FirebaseOptions(
      apiKey: "AIzaSyCfcGpA4_9pJ5ls35ozIuupj3t3UpA-dfE",
      authDomain: "final-year-project-b8303.firebaseapp.com",
      databaseURL:
          "https://final-year-project-b8303-default-rtdb.asia-southeast1.firebasedatabase.app",
      projectId: "final-year-project-b8303",
      storageBucket: "final-year-project-b8303.appspot.com",
      messagingSenderId: "1082358269382",
      appId: "1:1082358269382:web:361d027b51349902399ec7");

  static const FirebaseOptions android = FirebaseOptions(
      apiKey: "AIzaSyCfcGpA4_9pJ5ls35ozIuupj3t3UpA-dfE",
      authDomain: "final-year-project-b8303.firebaseapp.com",
      databaseURL:
          "https://final-year-project-b8303-default-rtdb.asia-southeast1.firebasedatabase.app",
      projectId: "final-year-project-b8303",
      storageBucket: "final-year-project-b8303.appspot.com",
      messagingSenderId: "1082358269382",
      appId: "1:1082358269382:web:361d027b51349902399ec7");
}
