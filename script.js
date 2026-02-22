// 1. Ambil elemen yang dibutuhkan
const features = document.querySelector(".features");
const fullList = document.querySelector(".features ul");
const allIcons = document.querySelectorAll(".features ul li");
const button = document.querySelector(".features button");

// 2. Buat elemen UL baru untuk kategori sosial media
const socialUl = document.createElement("ul");
socialUl.className = "social-icons";

// 3. Buat elemen teks "Share on:"
const shareText = document.createElement("p");
shareText.innerText = "Share on:";
shareText.style.margin = "1px 0"; // Opsional: memberi sedikit jarak
shareText.style.fontWeight = "600";
shareText.style.fontStyle = "italic";

// 4. Pindahkan ikon sosial media (index 2 ke atas) ke UL yang baru
// Kita mulai dari index 2 (twitter, fb, instagram, tiktok)
allIcons.forEach((icon, index) => {
  if (index >= 2) {
    socialUl.appendChild(icon);
  }
});

// 5. Masukkan teks dan UL baru ke dalam container .features
// Kita masukkan sebelum elemen button
features.insertBefore(shareText, button);
features.insertBefore(socialUl, button);
