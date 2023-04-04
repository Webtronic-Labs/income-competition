import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/storage'

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyB7H1ZB3DbDQocObdxrv1ped5N2--RDnlw',
  authDomain: 'ranking-sales-app.firebaseapp.com',
  projectId: 'ranking-sales-app',
  storageBucket: 'ranking-sales-app.appspot.com',
  messagingSenderId: '827122306937',
  appId: '1:827122306937:web:f41e3b839588ee596929a8'
}

firebase.initializeApp(firebaseConfig)

const auth = firebase.auth()
const db = firebase.firestore()
const storage = firebase.storage()
const { Timestamp } = firebase.firestore
const usersCollection = db.collection('users')

export { auth, db, storage, Timestamp, usersCollection }
