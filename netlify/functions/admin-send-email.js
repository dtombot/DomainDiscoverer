const { createClient } = require('@supabase/supabase-js');

function getSupabase() {
  const url = process.env.SUPABASE_URL || process.env.REACT_APP_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

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
    // Normalize content: if HTML looks like plain text, convert newlines to <br/>
    let textBody = text || null;
    let htmlBody = html || null;
    if (htmlBody && !/<\s*[a-z!\/][^>]*>/i.test(htmlBody)) {
      const escapeHTML = (s) => (s || '').replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
      htmlBody = `<div>${escapeHTML(htmlBody).replace(/\r?\n/g, '<br/>')}</div>`;
      if (!textBody) textBody = (text || html) || null;
    }
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
    if (!subject || !(textBody || htmlBody)) {
      return { statusCode: 400, body: JSON.stringify({ status: 'error', message: 'Missing subject or content' }) };
    }

    const params = new URLSearchParams();
    params.append('from', from);
    params.append('to', toAddr);
    params.append('subject', subject);
    if (textBody) params.append('text', textBody);
    if (htmlBody) params.append('html', htmlBody);
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
    // Best-effort: store sent message in Supabase
    try {
      const supabase = getSupabase();
      if (supabase) {
        const row = {
          to_email: toAddr,
          from_email: from,
          subject,
          body_text: textBody || null,
          body_html: htmlBody || null,
          reply_to: replyTo || null,
          provider: 'mailgun',
          mg_id: data.id || null,
          status: 'queued',
          raw: data,
        };
        await supabase.from('dd_sent_messages').insert(row);
      }
    } catch (_) {
      // ignore storage failures
    }
    return { statusCode: 200, body: JSON.stringify({ status: 'ok', data }) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ status: 'error', message: err.message }) };
  }
};
