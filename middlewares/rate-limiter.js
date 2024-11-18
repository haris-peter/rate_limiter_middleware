const redis= require('../utils/redisClient')
const logger = require('../utils/logger');


// Rate Limiting Middleware
const rateLimit = (config = {}) => {
  return async (req, res, next) => {
    const ip = req.ip;
    const route = req.path; // Get the current route path
    const key = `${ip}:${route}`; // Unique key combining IP and route
    const currentTime = Date.now(); // Current timestamp

    const userType = req.user?.userType || "default"; // Default to "default"
    const { limit = 10, timeWindow = 60000 } = config[userType] || config.default || {};

    try {
      // Increment the request count for the key
      const count = await redis.incr(key);

      // Set expiration time for the key if it's the first request
      if (count === 1) {
        await redis.expire(key, timeWindow / 1000);
      }

      // Check if the request count exceeds the limit
      if (count > limit) {
        const ttl = await redis.ttl(key); // Get the TTL (Time To Live)
        
        // Log the violation
        logger.warn({
          message: 'Rate limit exceeded',
          ip: ip,
          route: route,
          userType: userType,
          method: req.method, // HTTP method (GET, POST, etc.)
          statusCode: 429, // HTTP status code
          count: count, // Number of requests
          limit: limit, // Rate limit
          ttl: ttl, // Time to live for the key in Redis
          timestamp: new Date().toISOString(), // Timestamp of the violation
          headers: req.headers, // Request headers
          body: req.body, // Request body (if available)
        })
        
        // Send response with retry-after header
        return res
          .status(429)
          .set('Retry-After', ttl) // Set retry-after header
          .json({
            error: config[route]?.message || "Too many requests, please try again later",
            statusCode: 429,
            limit: limit,
            timeWindow: timeWindow,
            userType: userType,
          });
      }
    } catch (err) {
      // Handle Redis errors
      console.error("Redis error:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    // Proceed to the next middleware or route handler
    next();
  };
};

module.exports = rateLimit; // Export the middleware
