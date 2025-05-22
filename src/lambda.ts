import serverless from 'serverless-http';
import { APIGatewayProxyEvent, Context, APIGatewayProxyResult } from 'aws-lambda';
import express from 'express';
import path from 'path';
import { createVersionedRouters, createDirectRouter } from './routes';
import HistogramService from './services/histogramService';
import { setupSwagger } from './swagger';

const app = express();

app.use(express.json());

const dataFilePath = path.join(__dirname, '../data/Projection2021.csv');
const histogramService = new HistogramService(dataFilePath);

let isInitialized = false;
const initializeService = async () => {
  if (!isInitialized) {
    try {
      await histogramService.initialize();
      console.log('Histogram service initialized successfully');
      isInitialized = true;
    } catch (error) {
      console.error('Failed to initialize histogram service:', error);
      throw error;
    }
  }
};

// Create versioned routers
const versionedRouters = createVersionedRouters(histogramService);

// Mount versioned API routes
app.use('/api/v1', versionedRouters.v1);

// Add direct routes without the /api prefix
app.use('/', createDirectRouter(histogramService));


setupSwagger(app);

app.get('/', (req, res) => {
  const columns = histogramService.getAvailableColumns();
  const baseUrl = `${req.protocol}://${req.get('host')}`;
  
  res.json({
    message: 'Histogram API Service',
    documentation: {
      swagger: `${baseUrl}/api-docs`,
      swaggerHtml: `${baseUrl}/api-docs-html`,
      swaggerJson: `${baseUrl}/api-docs.json`
    },
    availableEndpoints: {
      columns: `${baseUrl}/api/v1/columns`,
      histograms: {
        withVersionedApiPrefix: columns.map(column => `${baseUrl}/api/v1/${column}/histogram`),
        direct: columns.map(column => `${baseUrl}/${column}/histogram`)
      }
    }
  });
});

export const handler = async (event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> => {
  console.log('Received event:', JSON.stringify(event, null, 2));
  
  try {
    await initializeService();
    
    const serverlessHandler = serverless(app);
    
    const response = await serverlessHandler(event, context);
    
    return response as APIGatewayProxyResult;
  } catch (error) {
    console.error('Error processing request:', error);
    
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' }),
      headers: {
        'Content-Type': 'application/json'
      }
    };
  }
};
