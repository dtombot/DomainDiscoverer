function isAllowedMailgunUrl(u) {
  try {
    const url = new URL(u);
    return /(^|\.)mailgun\.net$/.test(url.hostname);
  } catch {
    return false;
  }
}

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
    const base = (process.env.MAILGUN_BASE || 'https://api.mailgun.net').replace(/\/$/, '');
    if (!apiKey || !domain) {
      return { statusCode: 500, body: JSON.stringify({ status: 'error', message: 'Mailgun not configured' }) };
    }

    const qp = event.queryStringParameters || {};
    const urlParam = qp.url;
    const keyParam = qp.key;
    let targetUrl = '';
    if (urlParam && isAllowedMailgunUrl(urlParam)) {
      targetUrl = urlParam;
    } else if (keyParam) {
      targetUrl = `${base}/v3/domains/${encodeURIComponent(domain)}/messages/${encodeURIComponent(keyParam)}`;
    } else {
      return { statusCode: 400, body: JSON.stringify({ status: 'error', message: 'Missing url or key' }) };
    }

    const res = await fetch(targetUrl, {
      headers: {
        'Authorization': 'Basic ' + Buffer.from(`api:${apiKey}`).toString('base64'),
        'Accept': 'application/json'
      }
    });
    const data = await res.json().catch(async () => ({ raw: await res.text() }));
    if (!res.ok) {
      return { statusCode: res.status, body: JSON.stringify({ status: 'error', message: data.message || 'Mailgun error', data }) };
    }
    return { statusCode: 200, body: JSON.stringify({ status: 'ok', message: data }) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ status: 'error', message: err.message }) };
  }
};

