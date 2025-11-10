import { db, auth } from "./config.js";
import {
  doc,
  getDoc,
  deleteDoc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-auth.js";

// Get the cart item ID from localStorage
const itemID = localStorage.getItem("cartInf");
if (!itemID) {
  alert("No product selected!");
  window.location = "index.html";
}


const imgEl = document.querySelector(".image-container img");
const titleEl = document.querySelector(".title");
const priceEl = document.querySelector(".price");
const oldPriceEl = document.querySelector(".old-price");
const descEl = document.querySelector(".description");
const editBtn = document.querySelector(".edit");
const deleteBtn = document.querySelector(".delete");

async function loadProduct(currentUserUid) {
  const docRef = doc(db, "carts", itemID);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    alert("Product not found!");
    window.location = "index.html";
    return;
  }

  const data = docSnap.data();


  imgEl.src = data.imageUrl || "https://via.placeholder.com/200";
  titleEl.textContent = data.title || "No Title";
  priceEl.textContent = `$${data.price || 0}`;
  oldPriceEl.textContent = data.oldPrice ? `$${data.oldPrice}` : "";
  descEl.textContent = data.description || "No description";


  if (data.uid !== currentUserUid) {
    editBtn.style.display = "none";
    deleteBtn.style.display = "none";
  } else {
    editBtn.style.display = "inline-block";
    deleteBtn.style.display = "inline-block";
  }
}

// Edit product
editBtn.addEventListener("click", async () => {
  const newTitle = prompt("Enter new title:", titleEl.textContent);
  const newDesc = prompt("Enter new description:", descEl.textContent);
  const newPrice = prompt("Enter new price:", priceEl.textContent.replace("$",""));
  const newOldPrice = prompt("Enter old price (optional):", oldPriceEl.textContent.replace("$",""));

  if (!newTitle || !newDesc || !newPrice) {
    alert("Title, Description, and Price are required!");
    return;
  }

  try {
    const docRef = doc(db, "carts", itemID);
    await updateDoc(docRef, {
      title: newTitle,
      description: newDesc,
      price: Number(newPrice),
      oldPrice: newOldPrice ? Number(newOldPrice) : null
    });
    alert("Product updated!");
    loadProduct(auth.currentUser.uid); // reload
  } catch (error) {
    console.error("Error updating product:", error);
    alert("Failed to update product: " + error.message);
  }
});


deleteBtn.addEventListener("click", async () => {
  if (!confirm("Are you sure you want to delete this product?")) return;

  try {
    const docRef = doc(db, "carts", itemID);
    await deleteDoc(docRef);
    alert("Product deleted!");
    window.location = "index.html";
  } catch (error) {
    console.error("Error deleting product:", error);
    alert("Failed to delete product: " + error.message);
  }
});


onAuthStateChanged(auth, (user) => {
  if (user) {
    loadProduct(user.uid);
  } else {
    alert("Please log in to view this page!");
    window.location = "login.html";
  }
});
