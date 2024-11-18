const fs = require('fs');
const path = require('path');
const { createLogger, format, transports } = require("winston");

// Path to the logs folder
const logsDir = path.join(__dirname, '../logs');

// Create logs folder if it doesn't exist
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

const logger = createLogger({
  level: "info", 
  format: format.combine(
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    format.json()
  ),
  transports: [
    new transports.Console(),
    new transports.File({ filename: path.join(logsDir, 'rate-limiting.log') }),
  ],
});

logger.add(new transports.Console({ level: 'warn' }));

module.exports = logger;
