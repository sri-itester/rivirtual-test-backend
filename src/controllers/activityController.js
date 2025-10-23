import { PrismaClient, ActivityType } from "@prisma/client";
const prisma = new PrismaClient();

// GET /leads/:id/activities
export async function listActivities(req, res) {
  const leadId = parseInt(req.params.id, 10);
  if (Number.isNaN(leadId)) return res.status(400).json({ message: "Invalid id" });

  const items = await prisma.activity.findMany({
    where: { leadId },
    orderBy: { createdAt: "desc" },
    include: {
      performedBy: { select: { id: true, name: true, email: true } },
    },
  });
  res.json(items);
}

// POST /leads/:id/activities
export async function addActivity(req, res) {
  const leadId = parseInt(req.params.id, 10);
  if (Number.isNaN(leadId)) return res.status(400).json({ message: "Invalid id" });

  const { type, content, performedById } = req.body;

  if (!type || !Object.keys(ActivityType).includes(type)) {
    return res.status(400).json({ message: "Invalid activity type" });
  }

  const activity = await prisma.activity.create({
    data: {
      leadId,
      type,
      content: content ?? {},
      performedById: performedById ?? null, // can be null for now
    },
  });

  res.status(201).json(activity);
}
