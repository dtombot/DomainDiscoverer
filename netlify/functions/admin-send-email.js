exports.handler = async (event) => {
  try {
    if (event.httpMethod !== 'POST') {
      return { statusCode: 405, body: 'Method Not Allowed' };
    }
    const ADMIN_KEY = process.env.ADMIN_DASHBOARD_KEY;
    const provided = event.headers['x-admin-key'] || event.headers['X-Admin-Key'];
    if (ADMIN_KEY && provided !== ADMIN_KEY) {
      return { statusCode: 401, body: JSON.stringify({ status: 'error', message: 'Unauthorized' }) };
    }

    const { to, subject, text, html, replyTo } = JSON.parse(event.body || '{}');
    const apiKey = process.env.MAILGUN_API_KEY;
    const domain = process.env.MAILGUN_DOMAIN;
    const base = (process.env.MAILGUN_BASE || 'https://api.mailgun.net').replace(/\/$/, '');
    const from = process.env.MAILGUN_FROM || `Domain Discoverer <mail@${domain || 'example.com'}>`;
    const fallbackTo = process.env.MAILGUN_TO_DEFAULT;
    if (!apiKey || !domain) {
      return { statusCode: 500, body: JSON.stringify({ status: 'error', message: 'Mailgun not configured' }) };
    }
    const toAddr = (to || fallbackTo || '').trim();
    if (!toAddr) {
      return { statusCode: 400, body: JSON.stringify({ status: 'error', message: 'Missing recipient' }) };
    }
    if (!subject || !(text || html)) {
      return { statusCode: 400, body: JSON.stringify({ status: 'error', message: 'Missing subject or content' }) };
    }

    const params = new URLSearchParams();
    params.append('from', from);
    params.append('to', toAddr);
    params.append('subject', subject);
    if (text) params.append('text', text);
    if (html) params.append('html', html);
    if (replyTo) params.append('h:Reply-To', replyTo);

    const res = await fetch(`${base}/v3/${domain}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + Buffer.from(`api:${apiKey}`).toString('base64'),
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: params.toString()
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      return { statusCode: res.status, body: JSON.stringify({ status: 'error', message: data.message || 'Mailgun error', data }) };
    }
    return { statusCode: 200, body: JSON.stringify({ status: 'ok', data }) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ status: 'error', message: err.message }) };
  }
};
