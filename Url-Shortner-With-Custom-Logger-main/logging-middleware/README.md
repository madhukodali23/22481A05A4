# Logging Middleware

A reusable logging middleware package for web applications to send logs to a centralized logging server.

## Demo

Here's an example of the URL Shortener application using this logging middleware:

![URL Shortener Demo](../url-shortner/demo-screenshot.png)

_The logging middleware captures all user interactions, form submissions, and navigation events in this URL shortener application._

## Installation

```bash
npm install logging-middleware
```

## Usage

```javascript
import { Log } from "logging-middleware";

// Example usage
try {
  // Your code here
} catch (error) {
  Log("frontend", "error", "component", "An error occurred: " + error.message);
}
```

## API

### Log(stack, level, package, message)

Sends a log entry to the logging server.

- `stack` (string): Can be either "backend" or "frontend"
- `level` (string): Log level - one of "debug", "info", "warn", "error", "fatal"
- `package` (string): The package/module where the log originated
- `message` (string): The log message

### Allowed Values

#### Stack

- "backend"
- "frontend"

#### Level

- "debug"
- "info"
- "warn"
- "error"
- "fatal"

#### Package

##### Backend Only

- "cache"
- "controller"
- "cron job"
- "db"
- "domain"
- "handler"
- "repository"
- "route"
- "service"

##### Frontend Only

- "api"
- "component"
- "hook"
- "page"
- "state"
- "style"

##### Both Backend and Frontend

- "auth"
- "config"
- "middleware"
- "utils"

## Configuration

### Environment Variables

The logging middleware requires an API key to authenticate with the logging server. Set one of the following environment variables:

- `LOGGING_API_KEY` - The preferred environment variable name
- `API_KEY` - Alternative environment variable name

```bash
# In your .env.local file
LOGGING_API_KEY=your-actual-api-key-here
```

If no API key is provided, the middleware will:

- Still attempt to send logs (for backward compatibility)
- Show a warning message for 401 authentication errors
- Continue functioning without crashing your application

### Logging Server Configuration

Configure the logging server endpoint in the middleware configuration. The default endpoint can be modified in the middleware source code.
