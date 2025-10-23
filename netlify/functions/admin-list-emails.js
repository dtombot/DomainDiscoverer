exports.handler = async (event) => {
  try {
    if (event.httpMethod !== 'GET') {
      return { statusCode: 405, body: 'Method Not Allowed' };
    }
    const ADMIN_KEY = process.env.ADMIN_DASHBOARD_KEY;
    const provided = event.headers['x-admin-key'] || event.headers['X-Admin-Key'];
    if (ADMIN_KEY && provided !== ADMIN_KEY) {
      return { statusCode: 401, body: JSON.stringify({ status: 'error', message: 'Unauthorized' }) };
    }

    const apiKey = process.env.MAILGUN_API_KEY;
    const domain = process.env.MAILGUN_DOMAIN;
    if (!apiKey || !domain) {
      return { statusCode: 500, body: JSON.stringify({ status: 'error', message: 'Mailgun not configured' }) };
    }

    const limit = Math.min(50, Math.max(1, parseInt(event.queryStringParameters?.limit || '25', 10)));
    const eventFilter = event.queryStringParameters?.event || 'stored';
    const searchParams = new URLSearchParams({ limit: String(limit), event: eventFilter });

    const res = await fetch(`https://api.mailgun.net/v3/${domain}/events?${searchParams}`, {
      headers: { 'Authorization': 'Basic ' + Buffer.from(`api:${apiKey}`).toString('base64') }
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      return { statusCode: res.status, body: JSON.stringify({ status: 'error', message: data.message || 'Mailgun error', data }) };
    }
    return { statusCode: 200, body: JSON.stringify({ status: 'ok', events: data?.items || [] }) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ status: 'error', message: err.message }) };
  }
};

