import "dotenv/config";
import app from "./app";
const PORT = process.env?.PORT || 1338;
app.listen(PORT, () => {
  console.log(`Server Started...\nurl: http://localhost:${PORT}`);
});
