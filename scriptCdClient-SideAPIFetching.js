// ========================================
// QUOTE GENERATOR - OPTIMIZED VERSION
// ========================================

/**
 * Quote Generator Module
 * Uses IIFE to avoid global scope pollution
 */
const QuoteGenerator = (() => {
  // ============ CONSTANTS ============
  const CONFIG = {
    API_URL: "https://zenquotes.io/api/quotes",
    PROXY_URL: "https://api.allorigins.win/get?url=",
    SHARE_URL: "https://ahmadridho01.github.io/projectQuoteGenerator/",
    MIN_QUOTES: 10, // Minimum quotes before refetch
    DEBOUNCE_DELAY: 300, // ms
  };

  const MESSAGES = {
    LOADING: "Loading Quotes...",
    NEW_QUOTE: "New Quote",
    FETCH_ERROR: "Failed to load quotes. Please try again.",
    COPY_SUCCESS: "Copied to clipboard!",
    COPY_ERROR: "Failed to copy. Please try manually.",
    NO_SPEECH: "Speech synthesis not supported in this browser.",
  };

  // ============ STATE ============
  let quotesLibrary = [];
  let currentQuoteIndex = -1;
  let isFetching = false;
  let isSpeaking = false;

  // ============ DOM ELEMENTS ============
  const elements = {
    quoteText: document.querySelector(".quote"),
    authorName: document.querySelector(".name"),
    quoteBtn: document.querySelector(".features button"),
    features: document.querySelector(".features"),
    soundBtn: document.querySelector(".sound"),
    copyBtn: document.querySelector(".copy"),
    twitterBtn: document.querySelector(".twitter"),
    fbBtn: document.querySelector(".fb"),
    igBtn: document.querySelector(".instagram"),
    tiktokBtn: document.querySelector(".tiktok"),
  };

  // ============ UTILITY FUNCTIONS ============

  /**
   * Debounce function to prevent rapid clicks
   */
  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  };

  /**
   * Show notification to user
   */
  const showNotification = (message, type = "info") => {
    // You can replace this with a toast library like Toastify
    const notification = document.createElement("div");
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 15px 25px;
      background: ${type === "error" ? "#e74c3c" : "#27ae60"};
      color: white;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      z-index: 9999;
      animation: slideIn 0.3s ease;
    `;

    document.body.appendChild(notification);
    setTimeout(() => {
      notification.style.animation = "slideOut 0.3s ease";
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  };

  /**
   * Update button state
   */
  const setButtonState = (button, loading, text) => {
    button.disabled = loading;
    button.classList.toggle("loading", loading);
    if (text) button.innerText = text;
  };

  /**
   * Validate quote object
   */
  const isValidQuote = (quote) => {
    return quote && typeof quote.q === "string" && typeof quote.a === "string";
  };

  // ============ API FUNCTIONS ============

  /**
   * Fetch quotes from API with error handling
   */
  async function fetchQuotes() {
    if (isFetching) return;

    isFetching = true;
    setButtonState(elements.quoteBtn, true, MESSAGES.LOADING);

    const proxyUrl = `${CONFIG.PROXY_URL}${encodeURIComponent(CONFIG.API_URL)}`;

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

      const response = await fetch(proxyUrl, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const quotes = JSON.parse(data.contents);

      // Validate quotes
      if (!Array.isArray(quotes) || quotes.length === 0) {
        throw new Error("Invalid quotes data received");
      }

      quotesLibrary = quotes.filter(isValidQuote);

      if (quotesLibrary.length === 0) {
        throw new Error("No valid quotes found");
      }

      // Show first quote
      showNewQuote();
      showNotification(`${quotesLibrary.length} quotes loaded!`, "success");
    } catch (error) {
      console.error("Fetch Error:", error);

      let errorMessage = MESSAGES.FETCH_ERROR;
      if (error.name === "AbortError") {
        errorMessage = "Request timeout. Please check your connection.";
      }

      elements.quoteText.innerText = errorMessage;
      elements.authorName.innerText = "";
      showNotification(errorMessage, "error");
    } finally {
      isFetching = false;
      setButtonState(elements.quoteBtn, false, MESSAGES.NEW_QUOTE);
    }
  }

  /**
   * Display a random quote from library
   */
  function showNewQuote() {
    // Refetch if library is low
    if (quotesLibrary.length < CONFIG.MIN_QUOTES) {
      return fetchQuotes();
    }

    // Get random quote (avoid repeating the same quote)
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * quotesLibrary.length);
    } while (newIndex === currentQuoteIndex && quotesLibrary.length > 1);

    currentQuoteIndex = newIndex;
    const quote = quotesLibrary[currentQuoteIndex];

    // Animate quote change
    elements.quoteText.style.opacity = "0";
    elements.authorName.style.opacity = "0";

    setTimeout(() => {
      elements.quoteText.innerText = quote.q;
      elements.authorName.innerText = quote.a;
      elements.quoteText.style.opacity = "1";
      elements.authorName.style.opacity = "1";
    }, 200);
  }

  // ============ FEATURE FUNCTIONS ============

  /**
   * Text-to-Speech with status indication
   */
  function speakQuote() {
    if (!("speechSynthesis" in window)) {
      showNotification(MESSAGES.NO_SPEECH, "error");
      return;
    }

    // Stop if already speaking
    if (isSpeaking) {
      speechSynthesis.cancel();
      isSpeaking = false;
      elements.soundBtn.classList.remove("speaking");
      return;
    }

    const text = `${elements.quoteText.innerText} by ${elements.authorName.innerText}`;
    const utterance = new SpeechSynthesisUtterance(text);

    utterance.onstart = () => {
      isSpeaking = true;
      elements.soundBtn.classList.add("speaking");
    };

    utterance.onend = () => {
      isSpeaking = false;
      elements.soundBtn.classList.remove("speaking");
    };

    utterance.onerror = () => {
      isSpeaking = false;
      elements.soundBtn.classList.remove("speaking");
      showNotification("Speech error occurred", "error");
    };

    speechSynthesis.speak(utterance);
  }

  /**
   * Copy quote to clipboard
   */
  async function copyQuote(showNotif = true) {
    const fullText = `"${elements.quoteText.innerText}" — ${elements.authorName.innerText}`;

    try {
      await navigator.clipboard.writeText(fullText);
      if (showNotif) {
        showNotification(MESSAGES.COPY_SUCCESS, "success");
      }
      elements.copyBtn.classList.add("copied");
      setTimeout(() => elements.copyBtn.classList.remove("copied"), 1000);
      return true;
    } catch (error) {
      console.error("Copy failed:", error);
      if (showNotif) {
        showNotification(MESSAGES.COPY_ERROR, "error");
      }
      return false;
    }
  }

  /**
   * Share to social media (generic function)
   */
  async function shareToSocial(platform) {
    const fullText = `"${elements.quoteText.innerText}" — ${elements.authorName.innerText}`;
    const encodedText = encodeURIComponent(fullText);
    const encodedUrl = encodeURIComponent(CONFIG.SHARE_URL);

    const urls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodedText}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    };

    if (urls[platform]) {
      // Direct share untuk Twitter & Facebook
      window.open(
        urls[platform],
        "_blank",
        "width=600,height=400,noopener,noreferrer",
      );
    } else {
      // Copy + open untuk Instagram & TikTok
      const platformUrls = {
        instagram: "https://www.instagram.com",
        tiktok: "https://www.tiktok.com",
      };

      if (platformUrls[platform]) {
        const copySuccess = await copyQuote(false); // false = jangan tampilkan notifikasi copy

        if (copySuccess) {
          const platformName =
            platform.charAt(0).toUpperCase() + platform.slice(1);
          showNotification(`Quote copied! Opening ${platformName}...`, "info");

          setTimeout(() => {
            window.open(
              platformUrls[platform],
              "_blank",
              "noopener,noreferrer",
            );
          }, 500);
        } else {
          showNotification(MESSAGES.COPY_ERROR, "error");
        }
      }
    }
  }

  // ============ DOM SETUP ============

  /**
   * Initialize social share UI
   */
  function setupSocialUI() {
    const socialIcons = elements.features.querySelectorAll(
      ".twitter, .fb, .instagram, .tiktok",
    );

    if (socialIcons.length === 0) return;

    const socialUl = document.createElement("ul");
    socialUl.className = "social-icons";

    const shareText = document.createElement("p");
    shareText.innerText = "Share on:";
    Object.assign(shareText.style, {
      margin: "10px 0 5px",
      fontWeight: "600",
      fontStyle: "italic",
    });

    socialIcons.forEach((icon) => {
      const li = document.createElement("li");
      li.appendChild(icon);
      socialUl.appendChild(li);
    });

    elements.features.insertBefore(shareText, elements.quoteBtn);
    elements.features.insertBefore(socialUl, elements.quoteBtn);
  }

  /**
   * Add CSS animations
   */
  function injectStyles() {
    const style = document.createElement("style");
    style.textContent = `
      @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
      @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
      }
      .quote, .name {
        transition: opacity 0.3s ease;
      }
      .speaking {
        animation: pulse 1s infinite;
      }
      @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
      }
      .copied {
        animation: bounce 0.5s ease;
      }
      @keyframes bounce {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.2); }
      }
    `;
    document.head.appendChild(style);
  }

  // ============ EVENT LISTENERS ============

  function attachEventListeners() {
    // Debounced new quote button
    const debouncedNewQuote = debounce(showNewQuote, CONFIG.DEBOUNCE_DELAY);
    elements.quoteBtn.addEventListener("click", debouncedNewQuote);

    // Feature buttons
    elements.soundBtn.addEventListener("click", speakQuote);
    elements.copyBtn.addEventListener("click", copyQuote);

    // Social share buttons
    elements.twitterBtn.addEventListener("click", () =>
      shareToSocial("twitter"),
    );
    elements.fbBtn.addEventListener("click", () => shareToSocial("facebook"));
    elements.igBtn.addEventListener("click", () => shareToSocial("instagram"));
    elements.tiktokBtn.addEventListener("click", () => shareToSocial("tiktok"));

    // Keyboard shortcuts
    document.addEventListener("keydown", (e) => {
      if (e.key === " " && e.ctrlKey) {
        e.preventDefault();
        showNewQuote();
      } else if (e.key === "c" && e.ctrlKey && e.shiftKey) {
        e.preventDefault();
        copyQuote();
      }
    });
  }

  // ============ INITIALIZATION ============

  function init() {
    // Validate DOM elements
    if (!elements.quoteText || !elements.authorName || !elements.quoteBtn) {
      console.error("Required DOM elements not found!");
      return;
    }

    injectStyles();
    setupSocialUI();
    attachEventListeners();
    fetchQuotes(); // Initial fetch

    console.log("Quote Generator initialized successfully!");
    console.log("Shortcuts: Ctrl+Space (New Quote), Ctrl+Shift+C (Copy)");
  }

  // Wait for DOM to be fully loaded
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  // ============ PUBLIC API ============
  return {
    fetchQuotes,
    showNewQuote,
    getQuotesCount: () => quotesLibrary.length,
    getCurrentQuote: () => quotesLibrary[currentQuoteIndex] || { q: "", a: "" },
  };
})();

// Export for module usage (optional)
if (typeof module !== "undefined" && module.exports) {
  module.exports = QuoteGenerator;
}
