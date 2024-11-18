# Rate Limit Middleware Project

This project implements a **Rate Limiting Middleware** for an Express.js application. It includes advanced logging with **Winston** for monitoring, error tracking, and operational insights. Additionally, **Redis** is used for efficient caching and rate limit data management in distributed environments.

## Features
- **Customizable Rate Limits**:
  - Default configurations for all users and routes.
  - Specialized rate limits for roles or endpoints (e.g., admin users).
- **Caching with Redis**:
  - Ensures fast and reliable tracking of rate limits.
  - Suited for distributed systems with shared state.
- **Logging with Winston**:
  - Logs rate limit violations and system errors.
  - Supports file and console transports for flexibility.
- **Configurable Responses**:
  - Adjustable error messages and headers (e.g., `Retry-After`).

## Technologies Used
- **Node.js**
- **Express.js**
- **Redis** (for caching rate limit data)
- **Winston** (for logging)
- **Jest** (Testing)
- **Supertest** (HTTP request testing)

## File Structure
```
project/
├── middlewares/
│   └── rate-limiter.js    # Middleware for rate limiting
├── utils/
│   ├── logger.js          # Winston logger setup
│   └── redisClient.js     # Redis client configuration
├── __tests__/
│   └── rateLimiter.test.js  # Unit tests
├── package.json      # Project metadata
└── README.md         # Project documentation
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
   - Install Redis on your system or use a cloud-hosted Redis service.
   - Start the Redis server.

4. Configure Redis connection in `rate-limiter.js`:
   ```javascript
   const redisClient = redis.createClient({
     host: 'localhost',
     port: 6379,
   });
   ```

5. Configure logging in `logger.js`:
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

## Usage
1. Run the application:
   ```bash
   node app.js
   ```
   The server starts on `http://localhost:3000`.

2. Test the rate limiter:
   - Access `http://localhost:3000/test` multiple times to trigger logging and observe rate limiting.
   - Check `logs/combined.log` for request activity and violations.

## Testing
Run unit tests to validate middleware functionality:
```bash
npm test
```

## Configuration
Customize rate limiting rules in `rateLimitConfig` in `app.js`:
```javascript
const rateLimitConfig = {
  default: {
    limit: 3,
    timeWindow: 60000, // 60 seconds
    message: "Too many requests, please try again later",
  },
  admin: {
    limit: 100,
    timeWindow: 60000,
    message: "Too many requests, please try again later",
  },
};
```

## Contributing
1. Fork the repository.
2. Create a new branch:
   ```bash
   git checkout -b feature-name
   ```
3. Commit changes and submit a pull request.

## License
This project is licensed under the MIT License. See `LICENSE` for details.
