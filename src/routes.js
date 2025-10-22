import express from "express";
import { login } from "./controllers/authController.js";
import { listLeads, getLead, createLead, updateLead } from "./controllers/leadController.js";
import { authRequired } from "./middleware/auth.js";
import { listActivities, addActivity } from "./controllers/activityController.js";
import { incomingWebhook } from "./controllers/webhookController.js";

const router = express.Router();

// PUBLIC
router.post("/login", login);


// PROTECTED (need token)
router.get("/leads", authRequired, listLeads);
router.get("/leads/:id", authRequired, getLead);
router.post("/leads", authRequired, createLead);
router.put("/leads/:id", authRequired, updateLead);


// ACTIVITIES
router.get("/leads/:id/activities", authRequired, listActivities);
router.post("/leads/:id/activities", authRequired, addActivity);


// WEBHOOK (no auth)
router.post("/incoming-webhook", incomingWebhook);

export default router;
