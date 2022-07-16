import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, getDoc, doc, serverTimestamp, setDoc, updateDoc, arrayUnion, deleteField, deleteDoc, arrayRemove } from 'firebase/firestore/lite';
import { getAuth, onAuthStateChanged, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";

const firebaseConfig = {
    
}

const app = initializeApp(firebaseConfig);
const db = getFirestore(app)
const auth = getAuth(app);
const provider = new GoogleAuthProvider();


var storage = {};
function storeData(data) {
    //stora v storage {data[0]: data[1]} npr. {displayName: 'Example name'}
    storage[data[0]] = data[1];
}
function getData(data) {
    return storage[data];
}



export {app, db, auth, provider, onAuthStateChanged, signInWithPopup, signOut, storeData, getData, collection, setDoc, addDoc, getDocs, getDoc, doc, serverTimestamp, updateDoc, arrayUnion, deleteField, deleteDoc, arrayRemove };