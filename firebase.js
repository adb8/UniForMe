const { initializeApp } = require("firebase/app");
const { child, getDatabase, onValue, ref, push, remove } = require("firebase/database");

const firebaseConfig = {
    apiKey: "AIzaSyDQJn_6pbqcrmxmGpLI-zGZCx2eV11NAwE",
    authDomain: "uniforme-920fb.firebaseapp.com",
    databaseURL: "https://uniforme-920fb-default-rtdb.firebaseio.com",
    projectId: "uniforme-920fb",
    storageBucket: "uniforme-920fb.appspot.com",
    messagingSenderId: "664960088311",
    appId: "1:664960088311:web:6b8a96ac7d8b98a5bafbf2",
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

module.exports = {
    db: db,
    onValue,
    ref,
    getDatabase,
    child,
    push,
    remove
};
