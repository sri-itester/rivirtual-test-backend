import "dotenv/config";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import router from "./routes.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use("/", router);

app.get("/", (req, res) => {
  res.json({ ok: true, name: "RiVirtual Test Backend" });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`✅ API running on port ${PORT}`));
