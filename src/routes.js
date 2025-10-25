import express from "express";
import { login } from "./controllers/authController.js";
import { listLeads, getLead, createLead, updateLead, deleteLead } from "./controllers/leadController.js";
import { listActivities, addActivity } from "./controllers/activityController.js";
import { listUsers } from "./controllers/userController.js";
import { incomingWebhook } from "./controllers/webhookController.js";
import { authRequired } from "./middleware/auth.js";
import { getAnalyticsSummary } from "./controllers/analyticsController.js";

const router = express.Router();

// PUBLIC
router.post("/login", login);

// PROTECTED
router.get("/leads", authRequired, listLeads);
router.get("/leads/:id", authRequired, getLead);
router.post("/leads", authRequired, createLead);
router.put("/leads/:id", authRequired, updateLead);
router.delete("/leads/:id", authRequired, deleteLead);

// Activities
router.get("/leads/:id/activities", authRequired, listActivities);
router.post("/leads/:id/activities", authRequired, addActivity);

// Users
router.get("/users", authRequired, listUsers);

// Webhook (no auth)
router.post("/incoming-webhook", incomingWebhook);

// Analytics
router.get("/analytics/summary", authRequired, getAnalyticsSummary);

export default router;
