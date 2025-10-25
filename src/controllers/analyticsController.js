import { prisma } from "../prismaClient.js";

export async function getAnalyticsSummary(req, res) {
  try {
    const totalLeads = await prisma.lead.count();

    // Group leads by stage
    const leads = await prisma.lead.findMany({ select: { leadStage: true } });
    const leadsByStageMap = leads.reduce((acc, l) => {
      acc[l.leadStage] = (acc[l.leadStage] || 0) + 1;
      return acc;
    }, {});
    const leadsByStage = Object.entries(leadsByStageMap).map(([stage, count]) => ({
      stage,
      count,
    }));

    // Recent activities (last 7 days)
    const recentActivities = await prisma.activity.count({
      where: {
        createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
      },
    });

    // Upcoming tasks
    const allTasks = await prisma.activity.findMany({
      where: { type: "TASK" },
      select: { content: true },
    });

    const now = new Date();
    const upcomingTasks = allTasks.filter((a) => {
      try {
        const when = new Date(a.content?.when);
        return when > now;
      } catch {
        return false;
      }
    }).length;

    res.json({
      totalLeads,
      leadsByStage, // ✅ Always array
      recentActivities,
      upcomingTasks,
    });
  } catch (e) {
    console.error("Analytics error:", e);
    res.status(500).json({
      message: "Failed to load analytics",
      error: e.message,
    });
  }
}
