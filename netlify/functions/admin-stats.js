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
    const duration = (qp.duration || '30d').trim();
    const resolution = (qp.resolution || '').trim();
    // comma-separated event list, or default set
    const events = (qp.events || 'accepted,delivered,opened,clicked,failed,complained,unsubscribed,stored')
      .split(',')
      .map((e) => e.trim())
      .filter(Boolean);

    const params = new URLSearchParams();
    params.append('duration', duration);
    for (const e of events) params.append('event', e);

    if (resolution) params.append('resolution', resolution);
    const url = `${base}/v3/${domain}/stats/total?` + params.toString();
    const res = await fetch(url, {
      headers: { 'Authorization': 'Basic ' + Buffer.from(`api:${apiKey}`).toString('base64') }
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      return { statusCode: res.status, body: JSON.stringify({ status: 'error', message: data.message || 'Mailgun error', data }) };
    }

    // Best-effort aggregation of totals per event across returned items
    const items = data.items || data.stats || [];
    const totals = {};
    for (const e of events) totals[e] = 0;
    for (const it of items) {
      for (const e of events) {
        const val = (it[e] && (it[e].total ?? it[e].count)) || 0;
        totals[e] += Number(val) || 0;
      }
    }

    // Normalize a series: array of { time: epoch_ms, values: {event:count} }
    const series = [];
    for (const it of items) {
      const tStr = it.time || it.timestamp || it['@timestamp'] || it.date || null;
      const t = tStr ? Date.parse(tStr) : null;
      const values = {};
      for (const e of events) {
        values[e] = (it[e] && (it[e].total ?? it[e].count)) || 0;
      }
      series.push({ time: t, values });
    }

    return { statusCode: 200, body: JSON.stringify({ status: 'ok', duration, resolution, totals, series }) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ status: 'error', message: err.message }) };
  }
};
