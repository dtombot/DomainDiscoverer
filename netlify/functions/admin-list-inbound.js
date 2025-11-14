const { createClient } = require('@supabase/supabase-js');

function getSupabase() {
  const url = process.env.SUPABASE_URL || process.env.REACT_APP_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error('Supabase not configured');
  return createClient(url, key);
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

    const limit = Math.min(50, Math.max(1, parseInt(event.queryStringParameters?.limit || '25', 10)));

    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('dd_inbound_messages')
      .select('id, created_at, received_at, from_email, to_email, subject, body_text, body_html')
      .order('received_at', { ascending: false })
      .limit(limit);
    if (error) throw error;

    return { statusCode: 200, body: JSON.stringify({ status: 'ok', messages: data || [] }) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ status: 'error', message: err.message }) };
  }
};

