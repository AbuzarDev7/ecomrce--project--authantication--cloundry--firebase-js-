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

const userProfile = document.querySelector("#userProfile") || document.querySelector(".profile");
const userImg = document.querySelector("#userImg");
const loginBtn = document.querySelector("#loginBtn") || document.querySelector(".login-btn");
const loginBtnLink = document.querySelector("#loginBtnLink");
const logoutBtn = document.querySelector("#logoutBtn");
const productContainer = document.querySelector("#product-cards");

const defaultProducts = [
  {
    docid: "demo1",
    title: "iPhone 13 Pro",
    price: "235,000",
    description: "PTA approved, 256GB storage, perfect battery health — like new!",
    imageUrl: "https://images.unsplash.com/photo-1632661674596-df8be070a5c5?w=500&q=80",
    location: "Lahore"
  },
  {
    docid: "demo2",
    title: "Toyota Corolla",
    price: "7,235,000",
    description: "2019 model, first owner, mint condition, excellent fuel average.",
    imageUrl: "https://www.toyota-central.com/Assets/images/Vehicle/CorollaX/Color/SuperWhite.png",
    location: "Karachi"
  },
  {
    docid: "demo3",
    title: "Honda SP 125",
    price: "296,900",
    description: "Honda SP 125 is powered by a 124cc engine, 10.7bhp power, 11L tank.",
    imageUrl: "https://imgd.aeplcdn.com/424x424/n/cw/ec/194607/sp-125-right-side-view-2.jpeg?isig=0&q=80",
    location: "Karachi"
  },
  {
    docid: "demo4",
    title: "Macbook M4 Pavilion Laptop",
    price: "284,999",
    description: "8-core GPU, 10-core CPU, 16GB RAM, 256GB SSD, new condition.",
    imageUrl: "https://i.guim.co.uk/img/media/9b5a49469b2b33dd2a26a69d77b73d19e22bf9ce/1043_216_4195_2517/master/4195.jpg?width=445&dpr=1&s=none&crop=none",
    location: "Islamabad"
  }
];

onAuthStateChanged(auth, (user) => {
  if (user) {
    const uid = user.uid;
    console.log("Logged in UID:", uid);

    if (userProfile) userProfile.style.display = "flex";
    if (logoutBtn) logoutBtn.style.display = "block";
    if (loginBtn) loginBtn.style.display = "none";
    if (loginBtnLink) loginBtnLink.style.display = "none";

    getUserProfile(uid);
    getUserListings(uid); 

  } else {
    console.log("Not logged in");
    if (userProfile) userProfile.style.display = "none";
    if (logoutBtn) logoutBtn.style.display = "none";
    if (loginBtn) loginBtn.style.display = "block";
    if (loginBtnLink) loginBtnLink.style.display = "inline-block";

    renderListings([]);
  }
});

async function getUserProfile(uid) {
  try {
    const q = query(collection(db, "users"), where("uid", "==", uid));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      const userData = doc.data();
      if (userData.profile && userImg) {
        userImg.src = userData.profile;
      }
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
  }
}

function getUserListings(uid) {
  const q = query(collection(db, "carts"), where("uid", "==", uid)); 
  onSnapshot(q, (snapshot) => {
    const listings = [];
    snapshot.forEach((doc) => {
      listings.push({ ...doc.data(), docid: doc.id });
    });
    console.log("User Listings:", listings);
    renderListings(listings);
  }, (error) => {
    console.error("Error fetching listings:", error);
    renderListings([]);
  });
}

function renderListings(userItems) {
  if (!productContainer) return;
  productContainer.innerHTML = "";

  const allItems = [...defaultProducts, ...userItems];

  allItems.forEach((item) => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.innerHTML = `
       <img src="${item.imageUrl || 'https://via.placeholder.com/250'}" alt="${item.title}">
      <div class="card-content">
        <h3>${item.title}</h3>
        <div class="price">Rs ${item.price}</div>
        <p>${item.description}</p>
        <a href="#" class="more-btn" data-id="${item.docid}">
          <i class="fa-solid fa-circle-info"></i> More Info
        </a>
      </div>
      <div class="card-footer">
        <div class="location"><i class="fa-solid fa-location-dot"></i> ${item.location || 'Islamabad'}</div>
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
      localStorage.setItem("cartInf", cartInfo);
      console.log(cartInfo);
      window.location = "info.html";
    });
  });
}

if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    signOut(auth)
      .then(() => {
        window.location = "login.html";
      })
      .catch((error) => {
        console.error(error);
        alert("Error occurred during logout");
      });
  });
}

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

export { getDataFromDB };
