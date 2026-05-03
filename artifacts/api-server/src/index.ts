import express, { type Express } from "express";
import cors from "cors";
import { tripsRouter } from "./routes/trips.js";

const app: Express = express();
const PORT = process.env.PORT ?? 3001;

app.use(cors());
app.use(express.json());

app.get("/api/healthz", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api", tripsRouter);

app.listen(PORT, () => {
  console.log(`API server running on port ${PORT}`);
});

export default app;
