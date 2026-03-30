export default {
  async scheduled(event: any, env: any, ctx: any) {
    const SLA_CHECK_URL = `${env.APP_URL || 'https://it-project-management.vercel.app'}/api/sla-check`;
    const cronSecret = env.SLA_CRON_SECRET;

    if (!cronSecret) {
      console.warn('SLA_CRON_SECRET is not set in Worker environment.');
      return;
    }

    try {
      const response = await fetch(SLA_CHECK_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${cronSecret}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`SLA check failed with status ${response.status}: ${errorText}`);
      } else {
        const data = await response.json();
        console.log(`SLA check successful: ${JSON.stringify(data)}`);
      }
    } catch (error) {
      console.error('Error calling SLA check API:', error);
    }
  },

  async fetch(request: Request, env: any, ctx: any) {
    return new Response('IT Project Management Worker (SLA Cron) is active.', {
      headers: { 'content-type': 'text/plain' },
    });
  },
};
