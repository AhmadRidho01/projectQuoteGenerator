require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT;

app.use(cors());

app.get("/api/quotes", async (req, res) => {
  try {
    const response = await axios.get("https://api.api-ninjas.com", {
      headers: { "X-Api-Key": process.env.NINJA_API_KEY },
    });
    res.json(response.data);
  } catch (error) {
    console.log(
      "Detail Error Ninja:",
      error.response ? error.response.data : error.message,
    );

    res.status(500).json({ error: "Gagal ambil data" });
  }
});

module.exports = app;
