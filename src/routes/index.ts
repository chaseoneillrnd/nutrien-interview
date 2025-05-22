import { Router } from 'express';
import HistogramService from '../services/histogramService';
import { createHistogramRouterV1 } from './v1/histogramRoutes';

/**
 * Creates and configures all API routes with proper versioning
 * @param histogramService The histogram service instance
 * @returns An object containing all versioned routers
 */
export const createVersionedRouters = (histogramService: HistogramService) => {
  // Create v1 router
  const v1Router = Router();
  v1Router.use('/', createHistogramRouterV1(histogramService));

  // Return all versioned routers
  return {
    v1: v1Router
  };
};

/**
 * Creates a router for direct (non-versioned) routes
 * @param histogramService The histogram service instance
 * @returns Router for direct routes
 */
export const createDirectRouter = (histogramService: HistogramService): Router => {
  const router = Router();

  /**
   * @swagger
   * /{columnName}/histogram:
   *   get:
   *     tags:
   *       - Histogram
   *     summary: Get histogram for a specific column (direct route)
   *     description: Returns histogram data for the specified column using the direct route without /api prefix
   *     operationId: getHistogramDirect
   *     parameters:
   *       - name: columnName
   *         in: path
   *         description: Name of the column to get histogram for
   *         required: true
   *         schema:
   *           $ref: '#/components/schemas/ColumnName'
   *     responses:
   *       200:
   *         description: Successful operation
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Histogram'
   *       404:
   *         description: Column not found
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       500:
   *         description: Server error
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  router.get('/:columnName/histogram', (req, res) => {
    try {
      const { columnName } = req.params;
      
      if (!histogramService.hasColumn(columnName)) {
        return res.status(404).json({ 
          error: `Column '${columnName}' not found` 
        });
      }
      
      const histogram = histogramService.getHistogramForColumn(columnName);
      res.json(histogram);
    } catch (error) {
      console.error('Error getting histogram:', error);
      res.status(500).json({ error: 'Failed to generate histogram' });
    }
  });

  return router;
};
