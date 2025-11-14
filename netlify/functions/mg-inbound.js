const crypto = require('crypto');
const { createClient } = require('@supabase/supabase-js');

function getSupabase() {
  const url = process.env.SUPABASE_URL || process.env.REACT_APP_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error('Supabase not configured');
  return createClient(url, key);
}

function parseForm(body, isBase64Encoded) {
  const raw = isBase64Encoded ? Buffer.from(body, 'base64').toString('utf8') : body || '';
  // Mailgun forwards as application/x-www-form-urlencoded for HTTP forward
  // Attempt to parse conservatively
  try {
    const params = new URLSearchParams(raw);
    const obj = {};
    for (const [k, v] of params.entries()) obj[k] = v;
    return obj;
  } catch {
    return {};
  }
}

function safeParseJSON(text) {
  try { return JSON.parse(text); } catch { return null; }
}

function extractHeader(list, name) {
  if (!Array.isArray(list)) return null;
  const lower = name.toLowerCase();
  for (const pair of list) {
    if (!Array.isArray(pair) || pair.length < 2) continue;
    const k = String(pair[0] || '').toLowerCase();
    if (k === lower) return String(pair[1] || '');
  }
  return null;
}

function verifyMailgunSignature(ts, token, sig, signingKey) {
  if (!ts || !token || !sig || !signingKey) return false;
  const hmac = crypto.createHmac('sha256', signingKey);
  hmac.update(String(ts) + String(token));
  const digest = hmac.digest('hex');
  return crypto.timingSafeEqual(Buffer.from(digest, 'hex'), Buffer.from(sig, 'hex'));
}

exports.handler = async (event) => {
  try {
    if (event.httpMethod !== 'POST') {
      return { statusCode: 405, body: 'Method Not Allowed' };
    }

    // Optional shared secret in query string as an extra gate
    const q = event.queryStringParameters || {};
    const expectSecret = process.env.MG_INBOUND_SECRET;
    if (expectSecret && q.secret !== expectSecret) {
      return { statusCode: 401, body: JSON.stringify({ status: 'error', message: 'Unauthorized' }) };
    }

    // Parse payload
    const data = parseForm(event.body, event.isBase64Encoded);

    // Verify Mailgun signature if configured
    const signingKey = process.env.MAILGUN_SIGNING_KEY;
    if (signingKey) {
      const ok = verifyMailgunSignature(data.timestamp, data.token, data.signature, signingKey);
      if (!ok) {
        return { statusCode: 401, body: JSON.stringify({ status: 'error', message: 'Bad signature' }) };
      }
    }

    // Extract headers from message-headers (JSON array of [key, value])
    const hdrs = safeParseJSON(data['message-headers']);
    const msgId = extractHeader(hdrs, 'Message-Id');
    const inReplyTo = extractHeader(hdrs, 'In-Reply-To');
    const references = extractHeader(hdrs, 'References');

    const row = {
      mg_timestamp: data.timestamp ? Number(data.timestamp) : null,
      mg_token: data.token || null,
      mg_signature: data.signature || null,
      message_id: msgId || null,
      in_reply_to: inReplyTo || null,
      references_hdr: references || null,
      from_email: data.sender || data.from || '',
      to_email: data.recipient || data.to || '',
      subject: data.subject || null,
      body_text: data['stripped-text'] || data['body-plain'] || null,
      body_html: data['stripped-html'] || data['body-html'] || null,
      headers: hdrs,
      envelope: safeParseJSON(data.envelope) || null,
      route_recipient: data.recipient || null,
      raw: data,
    };

    const supabase = getSupabase();
    const { data: inserted, error } = await supabase
      .from('dd_inbound_messages')
      .insert(row)
      .select('id')
      .single();
    if (error) throw error;

    return { statusCode: 200, body: JSON.stringify({ status: 'ok', id: inserted.id }) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ status: 'error', message: err.message }) };
  }
};

