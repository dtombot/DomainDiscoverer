const { createClient } = require("@supabase/supabase-js");

const SUPABASE_URL = "https://wbfjkakpdrgewocqqott.supabase.co";
// Use Service Role key for backend/admin, or anon key for frontend/public
const SUPABASE_KEY =
  process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

exports.handler = async (event) => {
  try {
    // Accept "list" param: "expiring", "auctions", "handreg"
    // fallback to "valuable_domains" if not present
    const list =
      (event.queryStringParameters &&
        event.queryStringParameters.list &&
        event.queryStringParameters.list.toLowerCase()) ||
      "expiring";
    const limit =
      event.queryStringParameters && event.queryStringParameters.limit
        ? parseInt(event.queryStringParameters.limit)
        : 5; // Default: 5 for free users

    // Table and columns per list type
    let table, selectCols, orderCol;
    if (list === "expiring") {
      table = "dd_expiring_domains";
      selectCols = "domain, tld, age, value, inserted_at";
      orderCol = "inserted_at";
    } else if (list === "auctions") {
      table = "dd_auction_domains";
      selectCols =
        "domain, tld, age, value, auction_end, current_bid, platform, inserted_at";
      orderCol = "auction_end";
    } else if (list === "handreg") {
      table = "dd_handreg_domains";
      selectCols = "domain, tld, tag, value, inserted_at";
      orderCol = "inserted_at";
    } else {
      // Fallback for legacy or general list
      table = "dd_valuable_domains";
      selectCols = "*";
      orderCol = "added_at";
    }

    const { data, error } = await supabase
      .from(table)
      .select(selectCols)
      .order(orderCol, { ascending: false })
      .limit(limit);

    if (error) throw error;

    return {
      statusCode: 200,
      body: JSON.stringify({ domains: data }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ status: "error", message: err.message }),
    };
  }
};
