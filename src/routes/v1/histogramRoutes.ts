import { Router, Request, Response } from 'express';
import HistogramService from '../../services/histogramService';
import { CsvColumnName, ColumnsResponse, HistogramData, ErrorResponse } from '../../models/csvModels';

/**
 * @swagger
 * components:
 *   schemas:
 *     ColumnsList:
 *       type: object
 *       properties:
 *         columns:
 *           type: array
 *           items:
 *             type: string
 *           description: List of column names available in the CSV data
 *     Histogram:
 *       type: object
 *       additionalProperties:
 *         type: number
 *       description: Histogram data with values as keys and counts as values
 *     Error:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *           description: Error message
 */

export const createHistogramRouterV1 = (histogramService: HistogramService): Router => {
  const router = Router();

  /**
   * @swagger
   * /columns:
   *   get:
   *     tags:
   *       - Histogram
   *     summary: Get all available columns
   *     description: Returns a list of all column names available in the CSV data
   *     operationId: getColumns
   *     responses:
   *       200:
   *         description: Successful operation
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ColumnsList'
   *       500:
   *         description: Server error
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  router.get('/columns', (req: Request, res: Response) => {
    try {
      const columns = histogramService.getAvailableColumns();
      res.json({ columns });
    } catch (error) {
      console.error('Error getting columns:', error);
      res.status(500).json({ error: 'Failed to get columns' });
    }
  });

/**
 * @swagger
 * /{columnName}/histogram:
 *   get:
 *     tags:
 *       - Histogram
 *     summary: Get histogram for a specific column
 *     description: Returns histogram data for the specified column
 *     operationId: getHistogram
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
  router.get('/:columnName/histogram', (req: Request, res: Response) => {
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
