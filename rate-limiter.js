const Redis = require('ioredis');
const redis = new Redis(); // Initialize Redis client

// Rate Limiting Middleware
const rateLimit = (config = {}) => {
  return async (req, res, next) => {
    // Step 1: Identify client and route
    const ip = req.ip; // Get the client's IP address
    const route = req.path; // Get the current route path
    const key = `${ip}:${route}`; // Unique key combining IP and route
    const currentTime = Date.now(); // Current timestamp

    // Step 2: Determine user type and rate limits
    const userType = req.user?.userType || "default"; // Default to "default" if userType is undefined
    const { limit = 10, timeWindow = 60000 } = config[userType] || config.default || {};

    try {
      // Step 3: Increment the request count for the key
      const count = await redis.incr(key); // Increment the request count in Redis

      // Step 4: Set expiration time for the key if it's the first request
      if (count === 1) {
        await redis.expire(key, timeWindow / 1000); // Set expiration in seconds
      }

      // Step 5: Check if the request count exceeds the limit
      if (count > limit) {
        return res.status(429).json({
          error: config[route]?.message || "Too many requests, please try again later", // Custom or default error message
          statusCode: 429,
          limit: limit,
          timeWindow: timeWindow,
          userType: userType,
        });
      }
    } catch (err) {
      // Step 6: Handle Redis errors
      console.error("Redis error:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    // Step 7: Proceed to the next middleware or route handler
    next();
  };
};

module.exports = rateLimit; // Export the middleware
