import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const ALLOWED_FIELDS = [
  "salutation",
  "firstName",
  "lastName",
  "email",
  "countryCode",
  "mobile",
  "whatsapp",
  "leadType",
  "preferredLanguage",
  "companyName",
  "country",
  "state",
  "city",
  "leadStage",
  "assignedToId", // optional: assign owner
];

// GET /leads
export async function listLeads(req, res) {
  const leads = await prisma.lead.findMany({
    orderBy: { createdAt: "desc" },
  });
  res.json(leads);
}

// GET /leads/:id
export async function getLead(req, res) {
  const id = parseInt(req.params.id, 10);
  if (Number.isNaN(id)) return res.status(400).json({ message: "Invalid id" });

  const lead = await prisma.lead.findUnique({
    where: { id },
  });
  if (!lead) return res.status(404).json({ message: "Lead not found" });
  res.json(lead);
}


// POST /leads
export async function createLead(req, res) {
  const data = Object.fromEntries(
    Object.entries(req.body).filter(([k]) => ALLOWED_FIELDS.includes(k))
  );

  // Required backend validations
  if (!data.firstName || !data.lastName || !data.mobile || !data.country || !data.state || !data.city || !data.leadStage) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const lead = await prisma.lead.create({ data });
    res.status(201).json(lead);
  } catch (e) {
    console.error(e);
    res.status(400).json({ message: e.message });
  }
}

// PUT /leads/:id
export async function updateLead(req, res) {
  const id = parseInt(req.params.id, 10);
  if (Number.isNaN(id)) return res.status(400).json({ message: "Invalid id" });

  const data = Object.fromEntries(
    Object.entries(req.body).filter(([k]) => ALLOWED_FIELDS.includes(k))
  );

  try {
    const lead = await prisma.lead.update({
      where: { id },
      data,
    });
    res.json(lead);
  } catch (e) {
    console.error(e);
    if (e.code === "P2025") return res.status(404).json({ message: "Lead not found" });
    res.status(400).json({ message: e.message });
  }
}

// DELETE /leads/:id
export async function deleteLead(req, res) {
  const id = parseInt(req.params.id, 10);
  if (Number.isNaN(id)) return res.status(400).json({ message: "Invalid id" });

  try {
    await prisma.lead.delete({ where: { id } });
    return res.json({ ok: true });
  } catch (e) {
    console.error(e);
    if (e.code === "P2025") return res.status(404).json({ message: "Lead not found" });
    res.status(400).json({ message: e.message });
  }
}
