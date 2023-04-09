import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

const config = {
    apiKey: "AIzaSyCFl2DRcmHYx1bhdbv2xkCb0QLUyh_pvk8",
    authDomain: "crown-clothing-ff1da.firebaseapp.com",
    projectId: "crown-clothing-ff1da",
    storageBucket: "crown-clothing-ff1da.appspot.com",
    messagingSenderId: "431556373687",
    appId: "1:431556373687:web:ed0e4ffb2676abba35f132",
    measurementId: "G-1RFQNMWFC3"
};

export const createUsersProfileDocument = async (userAuth, additionalData) => {

    if(!userAuth) return;

    const userRef = firestore.doc(`users/${userAuth.uid}`);

    const snapShot = await userRef.get();


    if(!snapShot.exists) {
        const {displayName, email} = userAuth;
        const createdAt = new Date();

        try {
            await userRef.get({
                displayName,
                email,
                createdAt,
                ...additionalData
            });
        } catch(error) {
            console.log('error creating user', error.message);
        }
    }

    return userRef;
};

firebase.initializeApp(config);

export const auth = firebase.auth();
export const firestore = firebase.firestore();

const provider = new firebase.auth.GoogleAuthProvider();
provider.setCustomParameters({ prompt: 'select_account'});
export const signInWithGoogle = () => auth.signInWithPopup(provider);



export default firebase;
