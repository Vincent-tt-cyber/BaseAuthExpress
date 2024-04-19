const express = require("express");
const app = express();

const authRouter = require("./routes/authRoutes.routes");
app.use(express.json());

const PORT = 5000;

app.use("/api", authRouter);

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
