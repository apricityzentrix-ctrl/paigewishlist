
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createHmac } from "crypto";

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const webhook = process.env.DISCORD_WEBHOOK;
  const secret = process.env.IP_HASH_SECRET;

  if (!webhook || !secret) {
    return res.status(500).json({ error: "Server configuration missing" });
  }

  const forwarded = req.headers["x-forwarded-for"];
  const ip = typeof forwarded === "string"
    ? forwarded.split(",")[0].trim()
    : req.socket.remoteAddress || "unknown";

  const identifier = createHmac("sha256", secret)
    .update(ip)
    .digest("hex")
    .slice(0, 20);

  const discordResponse = await fetch(webhook, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      embeds: [{
        title: "Website Visit",
        color: 3447003,
        fields: [
          { name: "Visitor ID", value: identifier },
          { name: "Event", value: "Visitor consented to analytics" }
        ],
        timestamp: new Date().toISOString()
      }]
    })
  });

  if (!discordResponse.ok) {
    return res.status(502).json({ error: "Webhook failed" });
  }

  return res.status(200).json({ success: true });
}
