import firebase from 'firebase';
import 'firebase/database';
import 'firebase/auth';

const config = {
  apiKey: 'AIzaSyBWIXvKL0ZMLfIqMGdz-F-3IkI2NVqm_Uk',
  authDomain: 'mywallet-byclenio.firebaseapp.com',
  projectId: 'mywallet-byclenio',
  storageBucket: 'mywallet-byclenio.appspot.com',
  messagingSenderId: '696127243971',
  appId: '1:696127243971:web:3bc9feaff64c9215a38476',
  measurementId: 'G-PY21X460BX'
};

export const authConfig = firebase.initializeApp(config);

export const firebaseDb = authConfig.database().ref();
