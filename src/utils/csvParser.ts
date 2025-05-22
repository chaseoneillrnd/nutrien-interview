import fs from 'fs';
import csvParser from 'csv-parser';
import { HistogramData as HistogramDataType } from '../models/csvModels';

export type CsvRow = Record<string, string>;
export type HistogramData = HistogramDataType;

export const parseCsvFile = async (filePath: string): Promise<CsvRow[]> => {
  return new Promise((resolve, reject) => {
    const results: CsvRow[] = [];
    
    fs.createReadStream(filePath)
      .pipe(csvParser())
      .on('data', (row: CsvRow) => {
        results.push(row);
      })
      .on('end', () => {
        resolve(results);
      })
      .on('error', (err) => {
        reject(err);
      });
  });
};

export const generateHistogram = (data: CsvRow[], columnName: string): HistogramData => {
  const histogram: HistogramData = {};
  
  for (const row of data) {
    const value = row[columnName];
    
    if (value !== undefined) {
      if (histogram[value]) {
        histogram[value] += 1;
      } else {
        histogram[value] = 1;
      }
    }
  }
  
  return histogram;
};

export const getColumnNames = (data: CsvRow[]): string[] => {
  if (data.length === 0) {
    return [];
  }
  
  return Object.keys(data[0]);
};
