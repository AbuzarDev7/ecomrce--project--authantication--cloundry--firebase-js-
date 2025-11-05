import { 
  collection, addDoc, Timestamp 
} from "https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js"; 

import { auth, db } from "./config.js";
import { onAuthStateChanged } 
  from "https://www.gstatic.com/firebasejs/12.4.0/firebase-auth.js";

let uploadImg;
let userUID;

const form = document.querySelector("#form");
const description = document.querySelector("#description");
const title  = document.querySelector("#title");
const price = document.querySelector("#price");


onAuthStateChanged(auth, (user) => {
  if (user) {
    userUID = user.uid;
    console.log("Logged in user UID =>", userUID);
  } else {
    window.location = "login.html";
  }
});


var myWidget = cloudinary.createUploadWidget(
  {
    cloudName: 'dfu6dxt8o',
    uploadPreset: 'user-img',
  },
  (error, result) => {
    if (!error && result && result.event === "success") {
      console.log("Upload success:", result.info);
      uploadImg = result.info.secure_url;
    }
  }
);


document.getElementById("upload_widget").addEventListener("click", function () {
  myWidget.open();
}, false);

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (!userUID) {
    alert("User not logged in!");
    return;
  }
  if (!uploadImg) {
    alert("Please upload an image first!");
    return;
  }

  const productData = {
    title: title.value,
    description: description.value,
    price: price.value,
    imageUrl: uploadImg,
    time: Timestamp.fromDate(new Date()),
    uid: userUID
  };

  try {
    await addDoc(collection(db, "carts"), productData);
 Swal.fire({
  title: "Good job!",
  text: "cart is upload succesfull",
  icon: "success"
});
    window.location = "index.html"; 
  } catch (error) {
    console.error("Error adding document:", error);
    alert("Failed to upload product!");
  }
});
