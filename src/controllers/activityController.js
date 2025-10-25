import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function listActivities(req, res) {
  const leadId = parseInt(req.params.id, 10);
  try {
    const activities = await prisma.activity.findMany({
      where: { leadId },
      include: {
        performedBy: { select: { id: true, name: true, email: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    res.json(activities);
  } catch (e) {
    console.error(e);
    res.status(400).json({ message: e.message });
  }
}

export async function addActivity(req, res) {
  const leadId = parseInt(req.params.id, 10);
  const { type, content } = req.body;
  const user = req.user;

  if (!type || !content)
    return res.status(400).json({ message: "type and content are required" });

  try {
    const activity = await prisma.activity.create({
      data: {
        leadId,
        type,
        content,
        performedById: user?.userId || null,
      },
    });
    res.json(activity);
  } catch (e) {
    console.error(e);
    res.status(400).json({ message: e.message });
  }
}
