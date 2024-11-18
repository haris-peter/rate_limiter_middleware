
# Rate Limit Middleware Project

This project implements a **Rate Limiting Middleware** for an Express.js application. It uses **Redis** for caching and **Winston** for structured logging, enabling effective rate-limiting and operational monitoring in distributed environments.

## Features
- **Customizable Rate Limits**:
  - Default and role-specific configurations.
- **Redis Integration**:
  - Efficient storage and retrieval of rate-limiting data.
- **Advanced Logging**:
  - Using Winston for both file and console logging.
- **Configurable Responses**:
  - Adjustable error messages and `Retry-After` headers.

## File Structure
```
project/
├── middlewares/
│   └── rate-limiter.js    # Middleware for rate limiting
├── utils/
│   ├── logger.js          # Winston logger setup
│   └── redisClient.js     # Redis client configuration
├── __tests__/
│   └── rateLimiter.test.js  # Unit tests for rate limiting
├── package.json           # Project metadata
└── README.md              # Project documentation
```

## Installation
1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd rate-limit-middleware
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up Redis:
   - Install Redis locally or use a cloud-hosted service.
   - Update the Redis configuration in `utils/redisClient.js` if needed.

## Configuration
### Rate Limiting
Configure rate limits in `rate-limiter.js`:
```javascript
const rateLimitConfig = {
  default: {
    limit: 3,
    timeWindow: 60000, // in milliseconds
    message: "Too many requests, please try again later",
  },
  admin: {
    limit: 100,
    timeWindow: 60000,
    message: "Too many requests, please try again later",
  },
};
```

### Logger
The `logger.js` file in `utils/` defines the Winston logger:
```javascript
const { createLogger, format, transports } = require('winston');

const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp(),
    format.json()
  ),
  transports: [
    new transports.Console(),
    new transports.File({ filename: 'logs/error.log', level: 'error' }),
    new transports.File({ filename: 'logs/combined.log' }),
  ],
});

module.exports = logger;
```

### Redis Client
The `redisClient.js` file in `utils/` handles Redis connection:
```javascript
const redis = require('redis');

const redisClient = redis.createClient({
  host: 'localhost',
  port: 6379,
});

redisClient.on('error', (err) => {
  console.error('Redis error:', err);
});

module.exports = redisClient;
```

## Usage
1. Run the application:
   ```bash
   node app.js
   ```
   The server will start on `http://localhost:3000`.

2. Test the middleware by accessing `http://localhost:3000/test`. Redis will manage request counts, and logs will capture details in `logs/`.

## Testing
Run tests to validate functionality:
```bash
npm test
```

## Contributing
1. Fork the repository.
2. Create a feature branch:
   ```bash
   git checkout -b feature-name
   ```
3. Commit changes and submit a pull request.

## License
This project is licensed under the MIT License.
