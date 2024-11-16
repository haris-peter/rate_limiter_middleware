// Rate Limiting Middleware
const rateLimit = (config = {}) => {
  const requests = {}; // Store request timestamps for each IP and route

  return (req, res, next) => {
    // Step 1: Identify client and route
    const ip = req.ip; // Get the client's IP address
    const route = req.path; // Get the current route path
    const key = `${ip}:${route}`; // Create a unique key combining IP and route
    const currentTime = Date.now(); // Get the current timestamp

    // Step 2: Determine user type and corresponding rate limits
    const userType = req.user?.userType || "default"; // Get user type or fallback to "default"
    const { limit = 10, timeWindow = 60000 } = config[userType] || config.default || {};

    // Step 3: Initialize or update request history for this key
    if (!requests[key]) {
      requests[key] = []; // Initialize request history for this key
    }

    // Step 4: Filter out old requests that are outside the time window
    requests[key] = requests[key].filter(time => currentTime - time < timeWindow);

    // Step 5: Check if the request exceeds the rate limit
    if (requests[key].length >= limit) {
      return res.status(429).json({
        error: config[route]?.message || "Too Many Requests", // Custom message for the route
        statusCode: 429, // HTTP status code for rate limiting
        limit: limit, // Rate limit for the route
        timeWindow: timeWindow, // Time window for the rate limit
        userType: userType, // User type for the rate limit
      });
    }

    // Step 6: Log the current request timestamp
    requests[key].push(currentTime);

    // Step 7: Proceed to the next middleware or route
    next();
  };
};

module.exports = rateLimit; // Export the middleware for use in other files
