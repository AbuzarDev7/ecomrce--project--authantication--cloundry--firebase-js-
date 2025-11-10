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
const userImg = document.querySelector("#userImg");
const loginBtn = document.querySelector(".login-btn");
const logoutBtn = document.querySelector("#logoutBtn");
// const uploadBtn = document.querySelector(".uploadBtn");
const productContainer = document.querySelector("#product-cards");

onAuthStateChanged(auth, (user) => {
  if (user) {
    const uid = user.uid;
    console.log(" Logged in UID:", uid);

    logoutBtn.style.display = "block"
    loginBtn.style.display = "none";
    // uploadBtn.style.display = "block";

    getUserProfile(uid);
    getUserListings(uid); 

  } else {
    console.log("Not logged in");
    userSection.style.display = "none";
    loginBtn.style.display = "block";
    productContainer.innerHTML = "<p>Please log in to see your products.</p>";
  }
});


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

function getUserListings(uid) {
  const q = query(collection(db, "carts"), where("uid", "==", uid)); 
  onSnapshot(q, (snapshot) => {
    const listings = [];
    snapshot.forEach((doc) => {
      listings.push({ ...doc.data(), docid: doc.id });
    });
    console.log(listings);
    renderListings(listings);
  });
}

function renderListings(items) {
  // productContainer.innerHTML = "";

  if (items.length === 0) {
    productContainer.innerHTML = `<p class="no-items">You haven’t uploaded anything yet.</p>`;
    return;
  }

  items.forEach((item) => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.innerHTML = `
       <img src="${item.imageUrl}" alt="${item.title}">
      <div class="card-content">
        <h3>${item.title}</h3>
        <div class="price">Rs${item.price}</div>
        <p>${item.description}</p>
        <a href="#" class="more-btn" data-id="${item.docid}">
          <i class="fa-solid fa-circle-info"></i> More Info
        </a>
      </div>
      <div class="card-footer">
        <div class="location"><i class="fa-solid fa-location-dot"></i> Islamabad</div>
        <i class="fa-regular fa-heart favorite"></i>
      </div>
    `;
    productContainer.appendChild(card);
  });


  const moreInfoBtns = document.querySelectorAll(".more-btn");
  moreInfoBtns.forEach((btn) => {
    btn.addEventListener("click", (event) => {
      event.preventDefault();

      const btns = event.target.closest(".more-btn");
      if (!btns) return;

      const cartInfo = btns.dataset.id;
      // console.log("More info clicked:");
      localStorage.setItem("cartInf", cartInfo);
      console.log(cartInfo);
      window.location = "info.html"
    });
  });
}


logoutBtn.addEventListener("click", () => {
  signOut(auth)
    .then(() => {
      window.location = "login.html";
    })
    .catch(() => {
      alert("Error occurred during logout");
    });
});
async function getDataFromDB(uid, collections) {
  const data = [];

  const q = query(collection(db, collections), where("uid", "==", uid));
  const querySnapshot = uid
    ? await getDocs(q)
    : await getDocs(collection(db, collections));
  querySnapshot.forEach((doc) => {
    data.push({ ...doc.data(), docid: doc.id });
  });
  return data;
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


export {getDataFromDB}
