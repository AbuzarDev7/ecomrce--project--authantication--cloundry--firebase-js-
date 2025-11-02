import {createUserWithEmailAndPassword } from "//www.gstatic.com/firebasejs/12.4.0/firebase-auth.js";
import {auth} from "./config.js"

import {
  collection,
  addDoc,
} from "https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js";
import { db } from "./config.js";

let img;


var myWidget = cloudinary.createUploadWidget(
  {
    cloudName: 'dfu6dxt8o',  
    uploadPreset: 'user-img', 
  },
  (error, result) => {
    if (!error && result && result.event === "success") {
      console.log("Upload success:", result.info);
      img = result.info.secure_url; 
    }
  }
);


document.getElementById("upload_widget").addEventListener("click", function () {
  myWidget.open();
}, false);

const form = document.querySelector("#form");

const fullName = document.querySelector("#fullname");
const email = document.querySelector("#inpEmail");
const password = document.querySelector("#inpPassword");
form.addEventListener("submit" ,(eve)=>{
eve.preventDefault();
// const auth = getAuth();
createUserWithEmailAndPassword(auth, email.value, password.value)
  .then(async(userCredential) => {
    const user = userCredential.user;
    try {
        const docRef = await addDoc(collection(db, "users"), {
          fullname: fullName.value,
          email: email.value,
          profile: img,
          uid: user.uid,
        });
        console.log("Document written with ID: ", docRef.id);
        window.location = "login.html"
      } catch (e) {
        console.error("Error adding document: ", e);
      }
    })
console.log(user);

  })
  .catch((error) => {
    // const errorCode = error.code;
    const errorMessage = error.message;
console.log(errorMessage); 


  });
