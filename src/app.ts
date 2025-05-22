import express, { Request, Response } from 'express';
import path from 'path';
import { createVersionedRouters, createDirectRouter } from './routes';
import HistogramService from './services/histogramService';
import { setupSwagger } from './swagger';

const app = express();

app.use(express.json());

const dataFilePath = path.join(__dirname, '../data/Projection2021.csv');
const histogramService = new HistogramService(dataFilePath);

(async () => {
  try {
    await histogramService.initialize();
    console.log('Histogram service initialized successfully');
  } catch (error) {
    console.error('Failed to initialize histogram service:', error);
    process.exit(1);
  }
})();

const versionedRouters = createVersionedRouters(histogramService);

app.use('/api/v1', versionedRouters.v1);

app.use('/', createDirectRouter(histogramService));


setupSwagger(app);

app.get('/', (req: Request, res: Response) => {
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

export default app;
