This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, set up the logging middleware:

```bash
./setup-logging.sh
```

This will install the logging-middleware as a local dependency. If you encounter permission issues, you may need to make the script executable with `chmod +x setup-logging.sh`.

Then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Logging Middleware Integration

This project integrates a custom logging middleware that thoroughly logs all application functionality:

- URL creation and management
- Form submissions and validation
- Navigation events
- Redirects
- Error handling
- State management

The logs are sent to a central logging service. Configure the logging endpoint in the logging middleware configuration.

### Log Categories

Logs are categorized by:

- Stack: Always 'frontend'
- Level: 'debug', 'info', 'warn', 'error', or 'fatal'
- Package: Different areas of the application such as 'component', 'page', 'state', etc.

### Customizing Logs

You can modify the logging configuration in `src/utils/logger/index.js`.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
