import { 
  collection, addDoc, Timestamp, getDocs, query, where
} from "https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js"; 
import { auth, db } from "./config.js";
import {
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/12.4.0/firebase-auth.js";

let uploadImg;
let userUID; 
let cart = [];

const form = document.querySelector("#form");
const description = document.querySelector("#description");
const title  = document.querySelector("#title");
const price = document.querySelector("#price");

onAuthStateChanged(auth, (user) => {
  if (user) {
    userUID = user.uid;
    console.log("logged in user UID ==>", userUID);
    getDataFromDB(userUID);
  } else {
    window.location = "login.html";
  }
});

// ✅ Get user-specific data from Firestore
async function getDataFromDB(uid) {
  const q = query(collection(db, "carts"), where("uid", "==", uid));
  cart = [];

  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((docSnap) => {
    cart.push({ ...docSnap.data(), docId: docSnap.id }); // ✅ fixed
  });

  renderCart(cart); // ✅ fixed
}


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

// ✅ Form Submit
form.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (!userUID) {
    alert("User not logged in!");
    return;
  }

  const userData = {
    title: title.value,
    description: description.value,
    price: price.value,
    imageUrl: uploadImg, // ✅ fixed
    time: Timestamp.fromDate(new Date()),
    uid: userUID
  };

  try {
    const docRef = await addDoc(collection(db, "carts"), userData);
    console.log("Document written with ID:", docRef.id);
    cart.push({ ...userData, docId: docRef.id });
    renderCart(cart);
  } catch (e) {
    console.error("Error adding document:", e);
    
  }
  console.log(cart);
});

function renderCart(items) {

  

  items.forEach((item) => {

    const div = document.createElement("div");
    div.classList.add("product-card");
    div.innerHTML += `
      <div class="product">
        <img src="${item.imageUrl}" alt="${item.title}" width="200">
        <div class="product-info">
          <h3>${item.title}</h3>
          <p class="price">$${item.price}</p>
          <p>${item.description}</p>
        </div>
      </div>
    `;
  });
}
