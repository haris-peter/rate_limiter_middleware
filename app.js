const express = require('express');
const rateLimit = require('./rate-limiter');
const app = express();

const rateLimitConfig = {
  default: {
    limit: 10,
    timeWindow: 60000,
    message: "Too many requests, please try again later",
  },
  admin: {
    limit: 100,
    timeWindow: 60000,
    message: "Too many requests, please try again later",
  },
};
app.use(rateLimit(rateLimitConfig));

//Test route
app.get('/test', (req, res) => {
  res.send('Test route request received');
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});