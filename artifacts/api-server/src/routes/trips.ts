import { Router, type IRouter } from "express";
import type { Request, Response } from "express";
import { generateTripSchema, saveTripSchema } from "@workspace/api-zod";
import { db, trips } from "@workspace/db";
import { eq } from "drizzle-orm";
import { generateTravelPlan } from "../services/aiPlanner.js";

export const tripsRouter: IRouter = Router();

tripsRouter.post("/trips/generate", async (req, res) => {
  try {
    const input = generateTripSchema.parse(req.body);
    const plan = await generateTravelPlan(input);
    res.json({ plan });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(400).json({ error: message });
  }
});

tripsRouter.post("/trips", async (req, res) => {
  try {
    const input = saveTripSchema.parse(req.body);
    const [trip] = await db.insert(trips).values({
      title: input.title,
      origin: input.origin,
      destination: input.destination,
      plan: input.plan ?? {},
    }).returning();
    res.json(trip);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(400).json({ error: message });
  }
});

tripsRouter.get("/trips", async (_req, res) => {
  try {
    const all = await db.select().from(trips).orderBy(trips.createdAt);
    res.json(all);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(500).json({ error: message });
  }
});

tripsRouter.get("/trips/:id", async (req: Request<{ id: string }>, res: Response) => {
  try {
    const [trip] = await db.select().from(trips).where(eq(trips.id, req.params.id));
    if (!trip) {
      res.status(404).json({ error: "Not found" });
      return;
    }
    res.json(trip);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(500).json({ error: message });
  }
});
