import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Histogram API v1',
      version: '1.0.0',
      description: 'API v1 for generating histograms from CSV data.',
      contact: {
        name: 'API Support',
        email: 'support@example.com'
      }
    },
    servers: [
      {
        url: '/api/v1',
        description: 'Versioned API v1 (Recommended)'
      },
      {
        url: '/',
        description: 'Direct routes (for backward compatibility)'
      }
    ],
    tags: [
      {
        name: 'Histogram',
        description: 'Histogram operations'
      }
    ],
    components: {}
  },
  apis: ['./src/routes/index.ts', './src/routes/v1/*.ts', './src/app.ts', './src/lambda.ts', './src/swagger-definitions.ts']
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

export const setupSwagger = (app: Express): void => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    swaggerOptions: {
      persistAuthorization: true,
    }
  }));
  
  app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });
  
  app.get('/api-docs-html', (req, res) => {
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>Histogram API v1 - Swagger UI</title>
        <link rel="stylesheet" type="text/css" href="https://unpkg.com/swagger-ui-dist@4.5.0/swagger-ui.css" />
        <style>
          html { box-sizing: border-box; overflow: -moz-scrollbars-vertical; overflow-y: scroll; }
          *, *:before, *:after { box-sizing: inherit; }
          body { margin: 0; background: #fafafa; }
        </style>
      </head>
      <body>
        <div id="swagger-ui"></div>
        <script src="https://unpkg.com/swagger-ui-dist@4.5.0/swagger-ui-bundle.js"></script>
        <script>
          window.onload = function() {
            const ui = SwaggerUIBundle({
              url: "${baseUrl}/api-docs.json",
              dom_id: '#swagger-ui',
              deepLinking: true,
              presets: [
                SwaggerUIBundle.presets.apis,
                SwaggerUIBundle.SwaggerUIStandalonePreset
              ],
              layout: "BaseLayout",
              persistAuthorization: true
            });
            window.ui = ui;
          };
        </script>
      </body>
      </html>
    `;
    res.setHeader('Content-Type', 'text/html');
    res.send(html);
  });
  
  console.log('Swagger documentation available at /api-docs and /api-docs-html');
};
