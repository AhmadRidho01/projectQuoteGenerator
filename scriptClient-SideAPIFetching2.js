// 1. SELEKTOR UTAMA
const quoteText = document.querySelector(".quote");
const authorName = document.querySelector(".name");
const quoteBtn = document.querySelector(".features button");
const features = document.querySelector(".features");

// 2. MODIFIKASI STRUKTUR SHARE (Agar tetap ada tampilan "Share on")
const socialIcons = document.querySelectorAll(
  ".twitter, .fb, .instagram, .tiktok",
);
const socialUl = document.createElement("ul");
socialUl.className = "social-icons";
const shareText = document.createElement("p");
shareText.innerText = "Share on:";
Object.assign(shareText.style, {
  margin: "10px 0 5px",
  fontWeight: "600",
  fontStyle: "italic",
});

socialIcons.forEach((icon) => socialUl.appendChild(icon));
features.insertBefore(shareText, quoteBtn);
features.insertBefore(socialUl, quoteBtn);

// --- ---

// Penjelasan Metode Client-Side API Fetching
// > Direct API Call (Pemanggilan API Langsung): Karena browser Anda "berbicara" langsung ke server API (seperti ZenQuotes atau Quotable) tanpa perantara server sendiri. MDN Web Docs menjelaskan ini sebagai penggunaan standar Fetch API.

// > Client-Side Rendering (CSR): Karena seluruh proses pengambilan data dan pembaruan tampilan dilakukan sepenuhnya oleh browser pengguna menggunakan JavaScript.

// > Cross-Origin Request: Karena Anda meminta data dari satu domain (misalnya localhost atau index.html) ke domain lain (zenquotes.io). Inilah yang memicu aturan CORS (Cross-Origin Resource Sharing) yang sering menyebabkan error jika tidak menggunakan Proxy.

// > Static Site Architecture: Metode ini umum digunakan pada situs statis (hanya HTML/CSS/JS) yang tidak memiliki server backend sendiri.

// > Cara Lama (Client-Side): Browser ↔️ API Luar. (Cepat dibuat, tapi rentan masalah keamanan/CORS).

// --- ---

// 3. LOGIKA CACHING QUOTABLE API
// Mengambil 50 kutipan acak sekaligus untuk disimpan di memori (cache)
const targetUrl = "https://api.quotable.io";
let quotesLibrary = [];

async function fetchQuotes() {
  // Efek loading pada tombol berdasarkan selektor .features button
  quoteBtn.classList.add("loading");
  quoteBtn.innerText = "Loading...";
  quoteBtn.disabled = true;

  try {
    const response = await fetch(targetUrl);
    if (!response.ok) throw new Error("Gagal terhubung ke API");

    // Quotable mengembalikan array data langsung jika menggunakan parameter limit
    quotesLibrary = await response.json();

    // Tampilkan kutipan pertama dari hasil fetch
    showNewQuote();
  } catch (error) {
    console.error("Error:", error);
    quoteText.innerText = "Gagal memuat kutipan. Periksa koneksi Anda.";
    authorName.innerText = "Error";
  } finally {
    quoteBtn.innerText = "New Quote";
    quoteBtn.classList.remove("loading");
    quoteBtn.disabled = false;
  }
}

function showNewQuote() {
  // Jika library habis atau kosong, ambil data baru dari server
  if (quotesLibrary.length === 0) return fetchQuotes();

  // Ambil satu data acak dari array quotesLibrary
  const randomIndex = Math.floor(Math.random() * quotesLibrary.length);
  const randomQuote = quotesLibrary[randomIndex];

  // Update DOM berdasarkan selektor .quote dan .name
  quoteText.innerText = randomQuote.content;
  authorName.innerText = randomQuote.author;

  // Hapus kutipan yang sudah dipakai agar tidak muncul dua kali sebelum refresh
  quotesLibrary.splice(randomIndex, 1);
}

// 4. EVENT LISTENER
quoteBtn.addEventListener("click", showNewQuote);

// Jalankan pengambilan data pertama kali saat halaman dimuat
fetchQuotes();
