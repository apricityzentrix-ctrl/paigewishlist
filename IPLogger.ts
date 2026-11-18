import { headers } from 'next/headers';

const DISCORD_WEBHOOK_URL = 'https://discord.com/api/webhooks/1570536105986621471/L7xgd1QumZqzkz1WOoTRV2ybcwi6AomOlWMztPYzYjQfwbLbzU2956UGtuX-fGqSDSNX';

export async function handleVisitorRequest() {
  const headersList = await headers();
  
  // Grab the first IP using  before calling .trim()
  const forwardedFor = headersList.get('x-forwarded-for');
  const ip = forwardedFor ? forwardedFor.split(',')[0].trim() : '127.0.0.1';
  const userAgent = headersList.get('user-agent') || 'Unknown device';

  try {
    const response = await fetch(DISCORD_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store', // Prevents Next.js from caching the webhook request
      body: JSON.stringify({
        content: `🌐 **New Website Visitor**\n**IP:** \`${ip}\`\n**Device:** ${userAgent}`,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Discord Webhook Error:', response.status, errorText);
    }
  } catch (error) {
    console.error('Fetch failed:', error);
  }

  return {
    ip,
    timestamp: new Date().toISOString(),
  };
}
