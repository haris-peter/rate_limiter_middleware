const rateLimit = (limit, timeWindow, options = {}) => {
    const requests = {};  // Store request timestamps per IP address
    const defaultMessage = "Too Many Requests";  // Default message
    const errorMessage = options.message || defaultMessage;  // Use custom or default message
  
    return (req, res, next) => {
      const ip = req.ip;  // Get the IP address of the client
      const currentTime = Date.now();  // Get the current timestamp
  
      if (!requests[ip]) {
        requests[ip] = [];  // Initialize the IP entry if it doesn't exist
      }
  
      // Filter out old requests
      requests[ip] = requests[ip].filter(time => currentTime - time < timeWindow);
  
      // Check if the limit is exceeded
      if (requests[ip].length >= limit) {
        return res.status(429).json({ error: errorMessage });  // Respond with the custom error message
      }
  
      // Log the current request time
      requests[ip].push(currentTime);
  
      next();  // Proceed to the next middleware or route handler
    };
  };
  
  module.exports = rateLimit;
  