const fetch = require('node-fetch'); // Netlify already includes this

exports.handler = async function(event, context) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const { token } = JSON.parse(event.body);

  if (!token) {
    return { statusCode: 400, body: "No token provided" };
  }

  // Use Netlify environment variable for secret key
  const secretKey = process.env.TURNSTILE_SECRET_KEY;

  // Verify token with Cloudflare
  const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `secret=${secretKey}&response=${token}`
  });

  const data = await response.json();

  if (data.success) {
    return { statusCode: 200, body: JSON.stringify({ success: true }) };
  } else {
    return { statusCode: 403, body: JSON.stringify({ success: false, error: data["error-codes"] }) };
  }
};
