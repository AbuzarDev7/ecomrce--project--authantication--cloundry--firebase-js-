import { onAuthStateChanged , signOut  } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-auth.js";
import {auth,db} from "./config.js"
import {
  collection,
  getDocs,
  query,
  where,
} from "https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js";

const userSection = document.querySelector(".user-section");
const userImg = document.querySelector(".userImg");
const loginBtn = document.querySelector("#loginBtn");
const logoutBtn  = document.querySelector("logoutBtn");
onAuthStateChanged(auth, (user) => {
  if (user) {
    const uid = user.uid;
    console.log(uid);
    
    userSection.style.display = "block"
    loginBtn.style.display = "none"

    getDataFromDB(uid)

    
  } else {
    console.log("logi nahi");
  }
});


async function getDataFromDB(uid) {

  const q = query(
    collection(db, "users"),
    where("uid", "==", uid)
   
  );
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    console.log(doc.data());
    userImg.src = doc.data().profile
    
  });
}


logoutBtn.addEventListener("click", () => {
  signOut(auth)
    .then(() => {
      window.location = "login.html";
    })
    .catch((error) => {
      alert("error occured");
    });
});