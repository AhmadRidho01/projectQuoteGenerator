//  Penjelasan Server-Side API Bridge

// > API Bridging (Menjembatani API)
// Ini adalah istilah paling umum. Node.js berfungsi sebagai "jembatan" antara Client (Browser) dan Third-party API (ZenQuotes/Quotable). Browser tidak lagi bicara langsung ke API luar, tapi bicara ke server Anda sendiri.

// > Backend Proxy (Server-side Proxy)
// Karena Anda bertindak sebagai perantara yang mewakili permintaan browser, server Node.js Anda disebut sebagai Proxy. Bedanya dengan AllOrigins (yang merupakan Public Proxy), metode ini adalah Private Proxy karena Anda yang memiliki dan mengontrol servernya sendiri.

// > BFF (Backend For Frontend)
// Dalam pola desain aplikasi modern, arsitektur ini disebut BFF. Artinya, Anda membuat satu lapisan backend khusus yang bertugas menyiapkan dan merapikan data agar siap dikonsumsi dengan mudah oleh bagian frontend (tampilan).

// > Mengatasi CORS, Browser tidak akan memblokir permintaan karena server Node.js Anda berada di domain/port yang Anda izinkan sendiri.

// > Abstraksi: Jika suatu saat Anda ingin mengganti API ZenQuotes ke API lain, Anda cukup mengubah kode di Node.js tanpa perlu mengubah satu baris pun kode di file JavaScript Browser (Frontend) Anda.
