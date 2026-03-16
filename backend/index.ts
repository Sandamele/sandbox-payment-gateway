import "dotenv/config";
// import app from "./app";
import express from "express";
const PORT = process.env?.PORT || 1338;
const app = express();
app.listen(PORT, () => {
  console.log(`Server Started...\nurl: http://localhost:${PORT}`);
});
