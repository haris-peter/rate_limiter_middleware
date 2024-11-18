
# Rate Limit Middleware Project

This project implements a **Rate Limiting Middleware** for an Express.js application, enhanced with **caching via Redis**. It helps control the number of requests clients can make within a given timeframe, ensuring API reliability and preventing abuse. Redis is used for efficient storage and management of rate limit data, particularly for distributed environments.

## Features
- **Customizable Rate Limits**:
  - Default rate limit for all routes.
  - Specific configurations for user roles or routes (e.g., admin).
- **Caching with Redis**:
  - Fast and scalable tracking of client request counts.
  - Prevents rate limit data loss in distributed deployments.
- **Configurable Responses**:
  - Error messages and headers, including `Retry-After`.
- **Integration**:
  - Seamless integration with any Express.js application.

## Technologies Used
- **Node.js**
- **Express.js**
- **Redis** (for caching rate limit data)
- **Jest** (Testing)
- **Supertest** (HTTP request testing)

## File Structure
```
project/
├── app.js            # Main application file
├── middlewares/
│   └── rate-limiter.js  # Rate limiting middleware
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

## Usage
1. Run the application:
   ```bash
   node app.js
   ```
   The server starts on `http://localhost:3000`.

2. Test the rate limiter:
   - Access `http://localhost:3000/test` multiple times to see rate limiting in action.
   - Monitor Redis keys for stored rate limit data.

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
