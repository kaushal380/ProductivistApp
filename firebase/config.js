import * as firebase from 'firebase/compat';
import '@firebase/auth';
import '@firebase/firestore';
import { initializeApp } from "@firebase/app";



  const firebaseConfig = {
    apiKey: "AIzaSyB-rPyQd-9DE0Y6uekFBLUEuFrAFFxt1_g",
    authDomain: "productivist-32b3b.firebaseapp.com",
    projectId: "productivist-32b3b",
    storageBucket: "productivist-32b3b.appspot.com",
    messagingSenderId: "255526153482",
    appId: "1:255526153482:web:92bc8bf7759d98e4581ef3",
    measurementId: "G-577QV7WB02"
  }


  if(!firebase.apps.length){
    firebase.initializeApp(firebaseConfig);
  }
  export {firebase};