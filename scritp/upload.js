import { 
  collection, addDoc, Timestamp, getDocs, query, where, 
  deleteDoc, updateDoc, doc 
} from "https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js"; 
import { auth,db } from "./config.js";

const form = document.querySelector("#form");
const description = document.querySelector("#description");
const title  = document.querySelector("#title");
const price = document.querySelector("#price");
const productCard  = document.querySelector(".product-card");
let cart = [];


var myWidget = cloudinary.createUploadWidget(
  {
    cloudName: 'dfu6dxt8o',  
    uploadPreset: 'user-img', 
  },
  (error, result) => {
    if (!error && result && result.event === "success") {
      console.log("Upload success:", result.info);
      img = result.info.secure_url; 
    }
  }
);


document.getElementById("upload_widget").addEventListener("click", function () {
  myWidget.open();
}, false);


form.addEventListener("submit" ,(event)=>{
event.preventDefault();
    console.log(description.value);
    console.log(title.value);
    console.log(title.value);
    console.log(price.value);
})