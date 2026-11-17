import { headers } from 'next/headers';

export async function handleVisitorRequest() {
  const headersList = await headers();
  
  // Extract the IP and optional Vercel location data
  const forwardedFor = headersList.get('x-forwarded-for');
  const ip = forwardedFor ? forwardedFor.split(',')[0].trim() : '127.0.0.1';
  const userAgent = headersList.get('user-agent') || 'Unknown device';

  // --- ADD MORE LOGIC HERE LATER ---

  // Send to Discord Webhook
  const webhookUrl = process.env.https://discord.com/api/webhooks/1570536105986621471/L7xgd1QumZqzkz1WOoTRV2ybcwi6AomOlWMztPYzYjQfwbLbzU2956UGtuX-fGqSDSNX;
  
  if (webhookUrl) {
    try {
      await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: `🌐 **New Website Visitor**\n**IP:** \`${ip}\`\n**Device:** ${userAgent}`,
        }),
      });
    } catch (error) {
      console.error('Failed to send IP to Discord:', error);
    }
  }

  return {
    ip,
    timestamp: new Date().toISOString(),
  };
}
