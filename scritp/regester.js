import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-auth.js";
import { auth, db } from "./config.js";
import {
  collection,
  addDoc,
} from "https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js";

let img = "";

var myWidget;
if (typeof cloudinary !== "undefined") {
  myWidget = cloudinary.createUploadWidget(
    {
      cloudName: 'dfu6dxt8o',  
      uploadPreset: 'user-img', 
      sources: ['local', 'url', 'camera']
    },
    (error, result) => {
      if (!error && result && result.event === "success") {
        console.log("Upload success:", result.info);
        img = result.info.secure_url; 
        
        const uploadBtn = document.getElementById("upload_widget");
        const uploadStatus = document.getElementById("upload_status");
        const imgPreview = document.getElementById("img_preview");
        const previewContainer = document.getElementById("image_preview_container");

        if (uploadBtn) {
          uploadBtn.textContent = "✅ Profile Picture Selected";
          uploadBtn.style.backgroundColor = "#28a745";
        }
        if (uploadStatus) {
          uploadStatus.textContent = "Profile picture uploaded successfully!";
          uploadStatus.style.display = "block";
          uploadStatus.style.color = "#28a745";
        }
        if (imgPreview) imgPreview.src = img;
        if (previewContainer) previewContainer.style.display = "block";
      }
    }
  );
}

const uploadBtn = document.getElementById("upload_widget");
const nativeFileInput = document.getElementById("native_file_input");

if (uploadBtn) {
  uploadBtn.addEventListener("click", function () {
    if (myWidget) {
      myWidget.open();
    } else if (nativeFileInput) {
      nativeFileInput.click();
    } else {
      alert("Cloudinary widget loading... Please try again in a moment.");
    }
  }, false);
}

if (nativeFileInput) {
  nativeFileInput.addEventListener("change", async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const uploadStatus = document.getElementById("upload_status");
    const imgPreview = document.getElementById("img_preview");
    const previewContainer = document.getElementById("image_preview_container");

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
        img = data.secure_url;
        if (uploadBtn) {
          uploadBtn.textContent = "✅ Profile Picture Selected";
          uploadBtn.style.backgroundColor = "#28a745";
        }
        if (uploadStatus) {
          uploadStatus.style.color = "#28a745";
          uploadStatus.textContent = "Profile picture uploaded successfully!";
        }
        if (imgPreview) imgPreview.src = img;
        if (previewContainer) previewContainer.style.display = "block";
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

const form = document.querySelector("#form");
const fullName = document.querySelector("#fullname");
const email = document.querySelector("#inpEmail");
const password = document.querySelector("#inpPassword");

if (form) {
  form.addEventListener("submit", (eve) => {
    eve.preventDefault();
    if (!email.value || !password.value) {
      alert("Please fill in email and password!");
      return;
    }
    createUserWithEmailAndPassword(auth, email.value, password.value)
      .then(async (userCredential) => {
        const user = userCredential.user;
        try {
          const docRef = await addDoc(collection(db, "users"), {
            fullname: fullName ? fullName.value : "",
            email: email.value,
            profile: img || "",
            uid: user.uid,
          });
          console.log("Document written with ID: ", docRef.id);
          alert("Account created successfully!");
          window.location = "login.html";
        } catch (e) {
          console.error("Error adding document: ", e);
          alert("Error saving user data: " + e.message);
        }
      })
      .catch((error) => {
        const errorMessage = error.message;
        console.log(errorMessage);
        alert(errorMessage);
      });
  });
}
