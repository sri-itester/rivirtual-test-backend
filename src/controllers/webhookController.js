import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function incomingWebhook(req, res) {
  const { event, phone, direction, message, messageType, timestamp, raw } = req.body || {};

  if (event !== "whatsapp_message") {
    return res.status(400).json({ message: "Unsupported event" });
  }

  // Try to find lead by mobile or whatsapp number
  const lead = phone
    ? await prisma.lead.findFirst({
        where: {
          OR: [{ mobile: phone }, { whatsappNumber: phone }]
        }
      })
    : null;

  // Store event in DB regardless
  const webhookEvent = await prisma.webhookEvent.create({
    data: {
      event,
      phone,
      direction,
      message,
      messageType,
      timestamp: timestamp ? new Date(timestamp) : null,
      matchedLeadId: lead?.id || null,
      raw: raw || req.body
    }
  });

  // If lead found → create an activity
  if (lead) {
    await prisma.activity.create({
      data: {
        leadId: lead.id,
        type: "whatsapp",
        text: message || null
      }
    });
  }

  res.json({ ok: true, eventId: webhookEvent.id, matched: !!lead });
}
