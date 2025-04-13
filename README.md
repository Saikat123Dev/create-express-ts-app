# Create Express TypeScript App

A CLI tool to scaffold a production-ready Express.js application with TypeScript, following best practices.

## Features

- **TypeScript** with proper configuration
- **Express.js** with a well-structured architecture
- **MongoDB** integration with Mongoose (optional)
- **Authentication** with JWT
- **Error Handling** middleware
- **Request Validation** using Zod
- **Logging** system
- **Environment Configuration**
- **API Documentation** with Swagger/OpenAPI (optional)
- **Testing** setup with Jest
- **Docker** support (optional)
- **ESLint** and **Prettier** configuration

## Quick Start

```bash
# Using npx (recommended)
npx create-express-ts-app my-api

# Or install globally
npm install -g create-express-ts-app
create-express-ts-app my-api
```

Follow the interactive prompts to configure your project.

## Project Structure

The generated project follows a clean architecture:

```
my-api/
├── src/
│   ├── config/       # Application configuration
│   ├── controllers/  # Request handlers
│   ├── middleware/   # Express middleware
│   ├── models/       # Data models
│   ├── routes/       # Route definitions
│   ├── services/     # Business logic
│   ├── types/        # TypeScript type definitions
│   ├── utils/        # Utility functions
│   ├── app.ts        # Express app setup
│   └── server.ts     # Entry point
├── tests/            # Test files
├── .env.example      # Environment variables example
├── .eslintrc.js      # ESLint configuration
├── .prettierrc       # Prettier configuration
├── jest.config.js    # Jest configuration
├── package.json      # Dependencies and scripts
└── tsconfig.json     # TypeScript configuration
```

## Options

During the setup, you can choose to:

- Enable/disable MongoDB integration
- Enable/disable Swagger documentation
- Enable/disable Docker support

## Available Scripts

In your generated project, you can run:

- `npm run dev` - Start development server with hot-reload
- `npm run build` - Build for production
- `npm start` - Run production build
- `npm test` - Run tests
- `npm run lint` - Lint code

## License

MIT