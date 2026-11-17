import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const ip = req.headers["x-forwarded-for"]
    ?.toString()
    .split(",")[0]
    .trim() || "unknown";

  console.log("Security visit:", {
    ip,
    timestamp: new Date().toISOString()
  });

  return res.status(200).json({ success: true });
}
