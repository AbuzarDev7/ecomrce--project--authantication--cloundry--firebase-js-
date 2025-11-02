import {signInWithEmailAndPassword} from "//www.gstatic.com/firebasejs/12.4.0/firebase-auth.js";
import { signInWithPopup } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-auth.js";
import {auth,provider} from "./config.js"

const form = document.querySelector("#form");
const email = document.querySelector("#inpEmail");
const password = document.querySelector("#inpPassword");



form.addEventListener("submit" ,(eve)=>{
eve.preventDefault();
    signInWithEmailAndPassword(auth, email.value, password.value)
  .then((userCredential) => {

    const user = userCredential.user;
    console.log(user);
    window.location = "index.html"

  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.log(errorMessage);
  });
})


const googleBtn = document.querySelector(".social-btn");

googleBtn.addEventListener("click",()=>{
signInWithPopup(auth, provider)
  .then((result) => {
window.location = "index.html"
    const user = result.user;
    console.log(user);
  }).catch((error) => {
    
    const errorCode = error.code;
    const errorMessage = error.message;
   console.log(errorMessage);
  });
})
