const fetch = require('node-fetch');
const DOMAIN_PATTERN = /^(?=.{4,253}$)(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z](?:[a-z0-9-]{0,61}[a-z0-9])$/i;
const headers = { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' };
const reply = (statusCode, status, message) => ({
  statusCode, headers, body: JSON.stringify(message ? { status, message } : { status })
});
exports.handler = async (event) => {
  if (event.httpMethod && event.httpMethod !== 'GET') return reply(405, 'error', 'Method not allowed');
  const domain = String(event.queryStringParameters?.domain || '').trim().toLowerCase().replace(/\.$/, '');
  if (!DOMAIN_PATTERN.test(domain)) return reply(400, 'error', 'Enter a valid domain name');
  const key = process.env.DYNADOT_API_KEY;
  if (!key) return reply(503, 'error', 'The lookup service is temporarily unavailable');
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);
  try {
    const url = new URL('https://api.dynadot.com/api3.json');
    url.searchParams.set('key', key);
    url.searchParams.set('command', 'search');
    url.searchParams.set('domain0', domain);
    const response = await fetch(url.toString(), { signal: controller.signal, headers: { Accept: 'application/json' } });
    if (!response.ok) return reply(503, 'error', 'The lookup service is temporarily unavailable');
    const data = await response.json();
    const result = data?.SearchResponse?.SearchResults?.[0];
    if (result?.Available === 'yes') return reply(200, 'available');
    if (result?.Available === 'no') return reply(200, 'taken');
    return reply(503, 'error', 'The registrar did not return a usable result');
  } catch (_) {
    return reply(503, 'error', 'The lookup service is temporarily unavailable');
  } finally {
    clearTimeout(timeout);
  }
};
