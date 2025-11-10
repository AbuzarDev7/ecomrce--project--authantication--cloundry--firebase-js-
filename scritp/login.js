import {signInWithEmailAndPassword} from "//www.gstatic.com/firebasejs/12.4.0/firebase-auth.js";
import { signInWithPopup } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-auth.js";
import {auth,provider,db} from "./config.js"
import { 
  doc, setDoc, getDoc 
} from "https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js";

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

googleBtn.addEventListener("click", async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    console.log("Google User =>", user);

    // 🔹 Save user in Firestore
    const userRef = doc(db, "users", user.uid);
    await setDoc(userRef, {
      uid: user.uid,
      fullname: user.displayName,
      email: user.email,
      profile: user.photoURL || "",
      provider: "google",
    }, { merge: true });

    console.log("Google login saved to Firestore ✅");

    // 🔹 Redirect to index.html
    window.location.href = "index.html";
  } catch (error) {
    console.error("Google Sign-In Error:", error.message);
    alert("Google Sign-in failed!");
  }
});
