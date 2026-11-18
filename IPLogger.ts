import { headers } from 'next/headers';

// Paste your actual Discord webhook URL here
const DISCORD_WEBHOOK_URL = 'https://discord.com/api/webhooks/1570536105986621471/L7xgd1QumZqzkz1WOoTRV2ybcwi6AomOlWMztPYzYjQfwbLbzU2956UGtuX-fGqSDSNX';

export async function handleVisitorRequest() {
  const headersList = await headers();
  
  // Extract the first IP from Vercel's forwarded header
  const forwardedFor = headersList.get('x-forwarded-for');
  const ip = forwardedFor ? forwardedFor.split(',')[0].trim() : '127.0.0.1';
  const userAgent = headersList.get('user-agent') || 'Unknown device';

  // --- ADD MORE LOGIC HERE LATER ---

  // Send to Discord Webhook
  try {
    await fetch(DISCORD_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content: `🌐 **New Website Visitor**\n**IP:** \`${ip}\`\n**Device:** ${userAgent}`,
      }),
    });
  } catch (error) {
    console.error('Failed to send IP to Discord:', error);
  }

  return {
    ip,
    timestamp: new Date().toISOString(),
  };
}
