import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyB41lKrMq_WvDCrpwBfIe-yD5fayLTBj5Q",
  authDomain: "loja-2c474.firebaseapp.com",
  projectId: "loja-2c474",
  storageBucket: "loja-2c474.appspot.com",
  messagingSenderId: "878838401872",
  appId: "1:878838401872:web:190720bd827b09e47cfa55"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export { db };


console.log("Funciona PORRRRRRRRRRAAAAA!!!!!")