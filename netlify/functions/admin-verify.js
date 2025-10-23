exports.handler = async (event) => {
  try {
    const ADMIN_KEY = process.env.ADMIN_DASHBOARD_KEY;
    const provided = event.headers['x-admin-key'] || event.headers['X-Admin-Key'];
    if (ADMIN_KEY && provided === ADMIN_KEY) {
      return { statusCode: 200, body: JSON.stringify({ status: 'ok' }) };
    }
    return { statusCode: 401, body: JSON.stringify({ status: 'error', message: 'Unauthorized' }) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ status: 'error', message: err.message }) };
  }
};

