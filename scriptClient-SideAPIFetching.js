// 1. SELEKTOR UTAMA
const quoteText = document.querySelector(".quote");
const authorName = document.querySelector(".name");
const quoteBtn = document.querySelector(".features button");
const features = document.querySelector(".features");
const soundBtn = document.querySelector(".sound");
const copyBtn = document.querySelector(".copy");
const twitterBtn = document.querySelector(".twitter");
const fbBtn = document.querySelector(".fb");
const igBtn = document.querySelector(".instagram");
const tiktokBtn = document.querySelector(".tiktok");

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

// 3. LOGIKA CACHING ZENQUOTES
const targetUrl = "https://zenquotes.io/api/quotes";
const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(targetUrl)}`;
let quotesLibrary = []; // Tempat menyimpan 50 kutipan

async function fetchQuotes() {
  quoteBtn.classList.add("loading");
  quoteBtn.innerText = "Loading Quotes...";
  quoteBtn.disabled = true;

  try {
    const response = await fetch(proxyUrl);
    if (!response.ok) throw new Error("Network response was not ok");

    const data = await response.json();
    // Simpan 50 kutipan ke memori
    quotesLibrary = JSON.parse(data.contents);

    // Tampilkan kutipan pertama secara acak dari library
    showNewQuote();
  } catch (error) {
    console.error("Error:", error);
    quoteText.innerText = "Failed to load quotes. Please refresh the page.";
  } finally {
    quoteBtn.innerText = "New Quote";
    quoteBtn.classList.remove("loading");
    quoteBtn.disabled = false;
  }
}

function showNewQuote() {
  // Jika library kosong (karena error fetch), coba ambil ulang
  if (quotesLibrary.length === 0) return fetchQuotes();

  // Pilih satu kutipan secara acak dari 50 data yang sudah tersimpan
  const randomIndex = Math.floor(Math.random() * quotesLibrary.length);
  const randomQuote = quotesLibrary[randomIndex];

  quoteText.innerText = randomQuote.q;
  authorName.innerText = randomQuote.a;
}

soundBtn.addEventListener("click", () => {
  let utterance = new SpeechSynthesisUtterance(
    `${quoteText.innerText} by ${authorName.innerText}`,
  );
  speechSynthesis.speak(utterance);
});

copyBtn.addEventListener("click", () => {
  navigator.clipboard.writeText(quoteText.innerText);
});

twitterBtn.addEventListener("click", () => {
  const fullText = `"${quoteText.innerText}" — ${authorName.innerText}`;

  const xUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(fullText)}`;

  window.open(xUrl, "_blank", "width=600,height=400");
});

fbBtn.addEventListener("click", () => {
  const shareUrl = encodeURIComponent(
    "https://ahmadridho01.github.io/projectQuoteGenerator/",
  );

  const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`;

  window.open(fbUrl, "_blank", "width=600,height=400");
});

igBtn.addEventListener("click", () => {
  // Menggabungkan kutipan dan penulis agar yang disalin lebih lengkap
  const fullText = `"${quoteText.innerText}" — ${authorName.innerText}`;

  navigator.clipboard
    .writeText(fullText)
    .then(() => {
      alert("Quote and Author copied! Opening Instagram...");
      window.open("https://www.instagram.com", "_blank");
    })
    .catch((err) => {
      console.error(`Failed to copy text: ${err}`);
    });
});

tiktokBtn.addEventListener("click", () => {
  const fullText = `"${quoteText.innerText}" — ${authorName.innerText}`;

  navigator.clipboard
    .writeText(fullText)
    .then(() => {
      alert("Quote and Author copied! Opening TikTok...");

      // Membuka TikTok setelah salin
      window.open("https://www.tiktok.com", "_blank");
    })
    .catch((err) => {
      alert(`Failed to copy text: ${err}`);
    });
});

// 4. EVENT LISTENER
// Sekarang tombol klik memanggil fungsi showNewQuote (SANGAT CEPAT!)
quoteBtn.addEventListener("click", showNewQuote);

// Ambil library saat halaman pertama kali dibuka
fetchQuotes();
