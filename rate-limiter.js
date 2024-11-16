const rateLimit = (options = {}) => {
    const requests = {}; // Store request timestamps for each IP and route
  
    return (req, res, next) => {
      const ip = req.ip; // Get the client's IP address
      const route = req.path; // Get the current route path
      const key = `${ip}:${route}`; // Combine IP and route for unique identification
      const currentTime = Date.now(); // Current timestamp
  
      // Extract limit and timeWindow from options, with default values
      const limit = options[route]?.limit || 10; // Default limit: 10
      const timeWindow = options[route]?.timeWindow || 60000; // Default time window: 1 minute
  
      if (!requests[key]) {
        requests[key] = []; // Initialize the request history for this key
      }
  
      // Filter out old requests outside the time window
      requests[key] = requests[key].filter(time => currentTime - time < timeWindow);
  
      // Check if the limit has been exceeded
      if (requests[key].length >= limit) {
        return res.status(429).json({
          error: options[route]?.message || "Too Many Requests",
        });
      }
  
      // Log the current request timestamp
      requests[key].push(currentTime);
  
      next(); // Allow the request to continue
    };
  };
  
  module.exports = rateLimit;
  