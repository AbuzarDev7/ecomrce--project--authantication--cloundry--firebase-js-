import { signInWithEmailAndPassword, signInWithPopup } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-auth.js";
import { auth, provider, db } from "./config.js";
import { 
  doc, setDoc 
} from "https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js";

const form = document.querySelector("#form");
const email = document.querySelector("#inpEmail");
const password = document.querySelector("#inpPassword");

if (form) {
  form.addEventListener("submit", (eve) => {
    eve.preventDefault();
    signInWithEmailAndPassword(auth, email.value, password.value)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log("Logged in user:", user);
        window.location = "index.html";
      })
      .catch((error) => {
        console.error("Login Error:", error.message);
        alert("Login failed: " + error.message);
      });
  });
}

const googleBtn = document.querySelector(".social-btn");
if (googleBtn) {
  googleBtn.addEventListener("click", async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      console.log("Google User =>", user);

      const userRef = doc(db, "users", user.uid);
      await setDoc(userRef, {
        uid: user.uid,
        fullname: user.displayName,
        email: user.email,
        profile: user.photoURL || "",
        provider: "google",
      }, { merge: true });

      console.log("Google login saved to Firestore ✅");
      window.location.href = "index.html";
    } catch (error) {
      console.error("Google Sign-In Error:", error.message);
      alert("Google Sign-in failed: " + error.message);
    }
  });
}
