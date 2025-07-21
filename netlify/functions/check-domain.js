const fetch = require("node-fetch");

exports.handler = async (event) => {
  const { domain } = event.queryStringParameters;
  if (!domain) {
    return {
      statusCode: 400,
      body: JSON.stringify({ status: "error", message: "No domain specified" }),
    };
  }
  const DYNADOT_API_KEY = process.env.DYNADOT_API_KEY;
  if (!DYNADOT_API_KEY) {
    return {
      statusCode: 500,
      body: JSON.stringify({ status: "error", message: "API key not set" }),
    };
  }
  // CONVERT TO LOWERCASE!
  const domainLc = domain.toLowerCase();
  const url = `https://api.dynadot.com/api3.json?key=${DYNADOT_API_KEY}&command=search&domain0=${encodeURIComponent(domainLc)}`;
  try {
    const response = await fetch(url);
    const data = await response.json();

    if (
      data &&
      data.SearchResponse &&
      Array.isArray(data.SearchResponse.SearchResults) &&
      data.SearchResponse.SearchResults.length > 0 &&
      typeof data.SearchResponse.SearchResults[0].Available !== "undefined"
    ) {
      const isAvailable = data.SearchResponse.SearchResults[0].Available;
      if (isAvailable === "yes") {
        return { statusCode: 200, body: JSON.stringify({ status: "available" }) };
      } else if (isAvailable === "no") {
        return { statusCode: 200, body: JSON.stringify({ status: "taken" }) };
      } else {
        return {
          statusCode: 200,
          body: JSON.stringify({ status: "error", message: "Unknown value for Available", raw: data }),
        };
      }
    } else {
      return {
        statusCode: 200,
        body: JSON.stringify({
          status: "error",
          message: "Could not find availability info in response",
          raw: data,
        }),
      };
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ status: "error", message: error.message }),
    };
  }
};
