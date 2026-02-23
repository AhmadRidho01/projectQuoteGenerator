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

// 3. LOGIKA CACHING ZENQUOTES
const targetUrl = "https://zenquotes.io/api/quotes";
const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(targetUrl)}`;
let quotesLibrary = []; // Tempat menyimpan 50 kutipan

async function fetchQuotes() {
  quoteBtn.classList.add("loading");
  quoteBtn.innerText = "Loading Library...";
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

// 4. EVENT LISTENER
// Sekarang tombol klik memanggil fungsi showNewQuote (SANGAT CEPAT!)
quoteBtn.addEventListener("click", showNewQuote);

// Ambil library saat halaman pertama kali dibuka
fetchQuotes();
