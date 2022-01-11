import firebase from 'firebase';
import 'firebase/database';
import 'firebase/auth';

const config = {

};

export const authConfig = firebase.initializeApp(config);

export const firebaseDb = authConfig.database().ref();
