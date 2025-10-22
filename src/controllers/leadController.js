import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function listLeads(req, res) {
  const leads = await prisma.lead.findMany({ orderBy: { createdAt: "desc" } });
  res.json(leads);
}

export async function getLead(req, res) {
  const { id } = req.params;
  const lead = await prisma.lead.findUnique({ where: { id } });
  if (!lead) return res.status(404).json({ message: "Lead not found" });
  res.json(lead);
}

export async function createLead(req, res) {
  const data = req.body;
  if (!data.firstName || !data.lastName || !data.mobile)
    return res.status(400).json({ message: "Missing required fields" });

  try {
    const lead = await prisma.lead.create({ data });
    res.status(201).json(lead);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

export async function updateLead(req, res) {
  const { id } = req.params;
  const data = req.body;
  try {
    const lead = await prisma.lead.update({ where: { id }, data });
    res.json(lead);
  } catch (e) {
    res.status(404).json({ message: "Lead not found" });
  }
}
