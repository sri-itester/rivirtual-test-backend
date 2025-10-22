import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function listActivities(req, res) {
  const { id: leadId } = req.params;
  const items = await prisma.activity.findMany({
    where: { leadId },
    orderBy: { createdAt: "desc" }
  });
  res.json(items);
}

export async function addActivity(req, res) {
  const { id: leadId } = req.params;
  const { type, text, durationSec, feedback } = req.body;

  if (!type) return res.status(400).json({ message: "type is required" });

  const act = await prisma.activity.create({
    data: {
      leadId,
      type,
      text: text || null,
      durationSec: durationSec || null,
      feedback: feedback || null,
      createdById: req.user?.userId || null
    }
  });

  res.status(201).json(act);
}
