const request = {};
let ip = '127.0.0.1';
let timeWindow = 10000; // 10 seconds in milliseconds
let limit = 3;
let currentTime = Date.now();

console.log('--- Starting Rate Limiting Debugging ---');
console.log(request);

// Check if request history exists for this IP
if (!request[ip]) {
  request[ip] = [];
  console.log(`[DEBUG] Request history initialized for IP: ${ip}`);
}
console.log(request);

// Debugging: Show initial request history
console.log(`[DEBUG] Initial request history for IP ${ip}:`, request[ip]);

// Filter out outdated requests (older than the time window)
request[ip] = request[ip].filter(requestTime => {
  const isWithinWindow = currentTime - requestTime < timeWindow;
  if (!isWithinWindow) {
    console.log(`[DEBUG] Request at ${requestTime} removed (outside time window).`);
  }
  return isWithinWindow;
});
console.log(request);

// Debugging: Show filtered request history
console.log(`[DEBUG] Filtered request history for IP ${ip}:`, request[ip]);

// Check if the request limit has been exceeded
if (request[ip].length >= limit) {
  console.error(`[DEBUG] Rate limit exceeded for IP ${ip}. Requests:`, request[ip]);
  console.log('Rate limit exceeded for IP:', ip);
  return console.log('Too many requests, please try again later.'); // Adjusted for standalone debugging
}

// Add the current request time to the history
request[ip].push(currentTime);
console.log(`[DEBUG] Updated request history for IP ${ip}:`, request[ip]);
console.log(request)

// Simulate sending multiple requests with varying intervals:
function sendRequest() {
  currentTime = Date.now();
  console.log(`[DEBUG] Attempting to send request at: ${currentTime}`);
  
  // Apply rate limiting logic
  request[ip] = request[ip].filter(requestTime => {
    const isWithinWindow = currentTime - requestTime < timeWindow;
    if (!isWithinWindow) {
      console.log(`[DEBUG] Request at ${requestTime} removed (outside time window).`);
    }
    return isWithinWindow;
  });

  if (request[ip].length >= limit) {
    console.error(`[DEBUG] Rate limit hit for IP ${ip} at ${currentTime}. Requests:`, request[ip]);
    console.log('Rate limit exceeded for IP:', ip);
    return console.log('Too many requests, please try again later.');
  }

  request[ip].push(currentTime);
  console.log(`[DEBUG] Request accepted at ${currentTime}. Updated history:`, request[ip]);
  console.log(request);
}

console.log('--- Simulating Requests ---');
sendRequest(); // First request
setTimeout(sendRequest, 2000); // Second request after 2 seconds
setTimeout(sendRequest, 4000); // Third request after 4 seconds
setTimeout(sendRequest, 12000); // Fourth request after 12 seconds (first request will be removed)
setTimeout(sendRequest, 15000); // Fifth request after 15 seconds (another request will be removed)
