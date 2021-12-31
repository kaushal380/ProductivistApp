import * as firebase from 'firebase/compat';
import '@firebase/auth';
import '@firebase/firestore';
import { initializeApp } from "@firebase/app";



  const firebaseConfig = {
    apiKey: "AIzaSyAGJeVOQSyZz49lSulvpI12rFENcjylmrI",
    authDomain: "productivist-47bd5.firebaseapp.com",
    projectId: "productivist-47bd5",
    storageBucket: "productivist-47bd5.appspot.com",
    messagingSenderId: "959219783027",
    appId: "1:959219783027:web:57678cf4fa29709bfa6106",
    measurementId: "G-MSWG4PHVCS"
  }


  if(!firebase.apps.length){
    firebase.initializeApp(firebaseConfig);
  }
  export {firebase};