import { parseCsvFile, generateHistogram, getColumnNames, CsvRow } from '../utils/csvParser';
import { HistogramData, CsvColumnName } from '../models/csvModels';

class HistogramService {
  private csvData: CsvRow[] | null = null;
  private columnNames: string[] = [];
  private initialized: boolean = false;

  constructor(private dataFilePath: string) {}

  async initialize(): Promise<void> {
    try {
      this.csvData = await parseCsvFile(this.dataFilePath);
      this.columnNames = getColumnNames(this.csvData);
      this.initialized = true;
    } catch (error) {
      console.error('Error initializing histogram service:', error);
      throw error;
    }
  }

  getAvailableColumns(): string[] {
    return this.columnNames;
  }

  hasColumn(columnName: string): boolean {
    return this.columnNames.includes(columnName);
  }

  getHistogramForColumn(columnName: string): HistogramData {
    if (!this.csvData) {
      throw new Error('CSV data not loaded. Call initialize() first.');
    }

    if (!this.hasColumn(columnName)) {
      throw new Error(`Column '${columnName}' does not exist.`);
    }

    return generateHistogram(this.csvData, columnName);
  }
}

export default HistogramService;
