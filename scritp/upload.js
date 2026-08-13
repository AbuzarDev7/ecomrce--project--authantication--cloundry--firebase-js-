import { 
  collection, addDoc, Timestamp 
} from "https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js"; 

import { auth, db } from "./config.js";
import { onAuthStateChanged } 
  from "https://www.gstatic.com/firebasejs/12.4.0/firebase-auth.js";

let uploadImg = "";
let userUID = "";
let myWidget = null;

const form = document.querySelector("#form");
const description = document.querySelector("#description");
const title  = document.querySelector("#title");
const price = document.querySelector("#price");
const uploadBtn = document.getElementById("upload_widget");
const nativeFileInput = document.getElementById("native_file_input");
const uploadStatus = document.getElementById("upload_status");
const imgPreview = document.getElementById("img_preview");
const previewContainer = document.getElementById("image_preview_container");

onAuthStateChanged(auth, (user) => {
  if (user) {
    userUID = user.uid;
    console.log("Logged in user UID =>", userUID);
  } else {
    window.location = "login.html";
  }
});

function handleUploadSuccess(url) {
  uploadImg = url;
  if (uploadBtn) {
    uploadBtn.textContent = "✅ Image Selected";
    uploadBtn.style.backgroundColor = "#28a745";
  }
  if (uploadStatus) {
    uploadStatus.style.color = "#28a745";
    uploadStatus.textContent = "Image uploaded successfully!";
    uploadStatus.style.display = "block";
  }
  if (imgPreview) {
    imgPreview.src = url;
  }
  if (previewContainer) {
    previewContainer.style.display = "block";
  }
}

if (uploadBtn) {
  uploadBtn.addEventListener("click", function () {
    // Try opening Cloudinary widget first
    if (typeof cloudinary !== "undefined") {
      try {
        if (!myWidget) {
          myWidget = cloudinary.createUploadWidget(
            {
              cloudName: 'dfu6dxt8o',
              uploadPreset: 'user-img',
              sources: ['local', 'url', 'camera']
            },
            (error, result) => {
              if (error) {
                console.warn("Cloudinary widget error, falling back to file picker:", error);
                if (nativeFileInput) nativeFileInput.click();
                return;
              }
              if (result && result.event === "success") {
                handleUploadSuccess(result.info.secure_url);
              }
            }
          );
        }
        myWidget.open();
        return;
      } catch (err) {
        console.warn("Widget open error, launching direct file picker:", err);
      }
    }
    // Fallback to native file input
    if (nativeFileInput) {
      nativeFileInput.click();
    }
  }, false);
}

if (nativeFileInput) {
  nativeFileInput.addEventListener("change", async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (uploadStatus) {
      uploadStatus.style.display = "block";
      uploadStatus.style.color = "#007bff";
      uploadStatus.textContent = "Uploading image to Cloudinary... ⏳";
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "user-img");

    try {
      const response = await fetch("https://api.cloudinary.com/v1_1/dfu6dxt8o/image/upload", {
        method: "POST",
        body: formData
      });
      const data = await response.json();

      if (data.secure_url) {
        handleUploadSuccess(data.secure_url);
      } else {
        throw new Error(data.error?.message || "Upload failed");
      }
    } catch (error) {
      console.error("Direct Upload Error:", error);
      if (uploadStatus) {
        uploadStatus.style.color = "#dc3545";
        uploadStatus.textContent = "Upload failed: " + error.message;
      }
      alert("Failed to upload image: " + error.message);
    }
  });
}

if (form) {
  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!userUID) {
      alert("User not logged in!");
      return;
    }
    if (!uploadImg) {
      alert("Please upload an image first by clicking 'Select & Upload Image'!");
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
      if (typeof Swal !== "undefined") {
        await Swal.fire({
          title: "Good job!",
          text: "Product uploaded successfully!",
          icon: "success"
        });
      } else {
        alert("Product uploaded successfully!");
      }
      window.location = "index.html"; 
    } catch (error) {
      console.error("Error adding document:", error);
      alert("Failed to upload product: " + error.message);
    }
  });
}
