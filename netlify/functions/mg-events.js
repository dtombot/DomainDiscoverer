const crypto = require('crypto');
const { createClient } = require('@supabase/supabase-js');

function getSupabase() {
  const url = process.env.SUPABASE_URL || process.env.REACT_APP_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error('Supabase not configured');
  return createClient(url, key);
}

function verifySignature(sigObj, signingKey) {
  if (!sigObj || !signingKey) return false;
  const ts = String(sigObj.timestamp || sigObj.time || '');
  const token = String(sigObj.token || '');
  const sig = String(sigObj.signature || sigObj.signature || '');
  if (!ts || !token || !sig) return false;
  const hmac = crypto.createHmac('sha256', signingKey);
  hmac.update(ts + token);
  const digest = hmac.digest('hex');
  try { return crypto.timingSafeEqual(Buffer.from(digest, 'hex'), Buffer.from(sig, 'hex')); } catch { return false; }
}

function pickMessageId(ev) {
  const msg = ev.message || {};
  const headers = msg.headers || {};
  return headers['message-id'] || headers['Message-Id'] || ev['message-id'] || ev['Message-Id'] || null;
}

function toTs(ev) {
  const t = ev.timestamp || ev.event_timestamp || null;
  return t ? new Date(Number(t) * 1000).toISOString() : new Date().toISOString();
}

async function updateByMessageId(supabase, messageId, patch) {
  if (!messageId) return { updated: 0 };
  // Try exact match first
  let { error, count } = await supabase
    .from('dd_sent_messages')
    .update(patch, { count: 'exact' })
    .eq('mg_id', messageId);
  if (!error && count > 0) return { updated: count };
  // Fallback: trim angle brackets
  const trimmed = String(messageId).replace(/^<|>$/g, '');
  if (trimmed !== messageId) {
    ({ error, count } = await supabase
      .from('dd_sent_messages')
      .update(patch, { count: 'exact' })
      .eq('mg_id', trimmed));
    if (!error && count > 0) return { updated: count };
  }
  return { updated: 0 };
}

exports.handler = async (event) => {
  try {
    if (event.httpMethod !== 'POST') {
      return { statusCode: 405, body: 'Method Not Allowed' };
    }
    const q = event.queryStringParameters || {};
    const expectSecret = process.env.MG_EVENTS_SECRET;
    if (expectSecret && q.secret !== expectSecret) {
      return { statusCode: 401, body: JSON.stringify({ status: 'error', message: 'Unauthorized' }) };
    }

    const body = JSON.parse(event.body || '{}');
    // Mailgun sends { signature: {...}, 'event-data': {...} }
    const sigObj = body.signature || null;
    const ev = body['event-data'] || body || {};
    const signingKey = process.env.MAILGUN_SIGNING_KEY;
    if (signingKey && !verifySignature(sigObj, signingKey)) {
      return { statusCode: 401, body: JSON.stringify({ status: 'error', message: 'Bad signature' }) };
    }

    const supabase = getSupabase();
    const eventName = ev.event || ev['event'];
    const messageId = pickMessageId(ev);
    const nowIso = toTs(ev);
    const patch = { last_event: eventName, last_event_at: nowIso };

    // Map event → columns
    if (eventName === 'accepted') {
      patch.accepted_at = nowIso;
      patch.status = 'accepted';
    } else if (eventName === 'delivered') {
      patch.delivered_at = nowIso;
      patch.status = 'delivered';
    } else if (eventName === 'opened') {
      patch.opened_at = patch.opened_at || nowIso; // set if null
      patch.status = 'opened';
    } else if (eventName === 'clicked') {
      patch.clicked_at = patch.clicked_at || nowIso;
      patch.status = 'clicked';
    } else if (eventName === 'unsubscribed') {
      patch.unsubscribed_at = nowIso;
      patch.status = 'unsubscribed';
    } else if (eventName === 'complained') {
      patch.complained_at = nowIso;
      patch.status = 'complained';
    } else if (eventName === 'failed') {
      patch.failed_at = nowIso;
      const ds = ev['delivery-status'] || {};
      patch.failure_code = (ds.code != null ? String(ds.code) : null) || ev.code || null;
      patch.failure_reason = ds.message || ds.description || ev.reason || null;
      patch.status = 'failed';
    }

    const { updated } = await updateByMessageId(supabase, messageId, patch);
    if (updated === 0) {
      // Optionally store an orphan record, but skip to reduce writes.
    }

    return { statusCode: 200, body: JSON.stringify({ status: 'ok' }) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ status: 'error', message: err.message }) };
  }
};

