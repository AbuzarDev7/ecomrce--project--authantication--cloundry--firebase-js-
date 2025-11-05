import { onAuthStateChanged, signOut } 
  from "https://www.gstatic.com/firebasejs/12.4.0/firebase-auth.js";
import { auth, db } from "./config.js";
import {
  collection,
  onSnapshot,
  query,
  where,
  getDocs,
} from "https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js";

// const userSection = document.querySelector(".user-section");
const userImg = document.querySelector(".userImg");
const loginBtn = document.querySelector("#loginBtn");
const logoutBtn = document.querySelector("#logoutBtn");
const uploadBtn = document.querySelector(".uploadBtn");
const productContainer = document.querySelector("#product-container");

onAuthStateChanged(auth, (user) => {
  if (user) {
    const uid = user.uid;
    console.log("✅ Logged in UID:", uid);

    logoutBtn.style.display = "block"
    loginBtn.style.display = "none";
    uploadBtn.style.display = "block";

    getUserProfile(uid);
    getUserListings(uid); // 👈 only user-specific products

  } else {
    console.log("❌ Not logged in");
    userSection.style.display = "none";
    loginBtn.style.display = "block";
    productContainer.innerHTML = "<p>Please log in to see your products.</p>";
  }
});

// ✅ User Profile Image
async function getUserProfile(uid) {
  const q = query(collection(db, "users"), where("uid", "==", uid));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    const userData = doc.data();
    if (userData.profile) {
      userImg.src = userData.profile;
    }
  });
}

// ✅ User-Specific Product Listings
function getUserListings(uid) {
  const q = query(collection(db, "carts"), where("uid", "==", uid)); // ✅ filter by user
  onSnapshot(q, (snapshot) => {
    const listings = [];
    snapshot.forEach((doc) => listings.push(doc.data()));
    renderListings(listings);
  });
}

// ✅ Render Function
function renderListings(items) {
  productContainer.innerHTML = "";
  if (items.length === 0) {
    productContainer.innerHTML = `<p class="no-items">You haven’t uploaded anything yet.</p>`;
    return;
  }

  items.forEach((item) => {
    const card = document.createElement("div");
    card.classList.add("product-card");
    card.innerHTML = `
      <img src="${item.imageUrl}" alt="${item.title}" width="350">
      <div class="info">
        <h3>${item.title}</h3>
        <p class="price">$${item.price}</p>
        <p>${item.description}</p>
      </div>
    `;
    productContainer.appendChild(card);
  });
}

// ✅ Logout
logoutBtn.addEventListener("click", () => {
  signOut(auth)
    .then(() => {
      window.location = "login.html";
    })
    .catch(() => {
      alert("Error occurred during logout");
    });
});
