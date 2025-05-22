# Histogram API

A TypeScript-based API for Nutrien back-end interview exercise.

## Features

- RESTful API for retrieving histogram data from CSV files
- API versioning with `/api/v1/` prefix for future-proof endpoints
- Swagger/OpenAPI documentation
- Unit tests with Jest
- AWS Lambda deployment support via Serverless Framework and AWS CDK
- TypeScript for type safety

## Prerequisites

- Node.js (v14 or later)
- npm (v6 or later)
- AWS CLI (for deployment)
- AWS CDK (for deployment)
- AWS Credentials (for deployment)

## Getting Started

Install Dependencies 

```bash
npm install
```

Run dev server

Start the development server:

```bash
npm run dev
```

The API will be available at http://localhost:3000.

## API Documentation

Swagger documentation is available at http://localhost:3000/api-docs when running locally. The Swagger UI shows both versioned API endpoints (recommended) and direct routes (for backward compatibility).

Two additional HTML viewers are included in the project:
- `swagger-viewer.html`: Loads the Swagger UI from the deployed API
- `swagger-viewer-alt.html`: Contains the Swagger JSON directly embedded in the HTML file

## Available Endpoints

### Versioned API (Recommended)

- `GET /api/v1/columns` - Get all available columns in the CSV data
- `GET /api/v1/{columnName}/histogram` - Get histogram data for a specific column

### Direct Routes (For Backward Compatibility)

- `GET /{columnName}/histogram` - Get histogram data for a specific column (direct route without /api prefix)

## Running Tests

```bash
npm test
```

## Deployment

### Using Serverless Framework

```bash
npm run deploy
```

### Using AWS CDK

1. Bootstrap your AWS environment (first time only):

```bash
npm run cdk:bootstrap
```

2. Deploy the application:

```bash
npm run cdk:deploy
```
