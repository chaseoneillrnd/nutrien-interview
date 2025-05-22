import HistogramService from '../services/histogramService';
import * as csvParser from '../utils/csvParser';

jest.mock('../utils/csvParser', () => {
  const original = jest.requireActual('../utils/csvParser');
  
  return {
    ...original,
    parseCsvFile: jest.fn()
  };
});

describe('HistogramService', () => {
  let histogramService: HistogramService;
  const mockCsvData = [
    { Commodity: 'Rice', Year: '2019/20', Value: '2472' },
    { Commodity: 'Rice', Year: '2020/21', Value: '2991' },
    { Commodity: 'Wheat', Year: '2019/20', Value: '1500' },
    { Commodity: 'Wheat', Year: '2020/21', Value: '1600' },
    { Commodity: 'Rice', Year: '2021/22', Value: '2552' }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    
    const mockParseCsvFile = csvParser.parseCsvFile as jest.Mock;
    mockParseCsvFile.mockResolvedValue(mockCsvData);
    
    histogramService = new HistogramService('mock-path.csv');
  });

  describe('initialize', () => {
    it('should load CSV data and extract column names', async () => {
      await histogramService.initialize();
      
      expect(csvParser.parseCsvFile).toHaveBeenCalledWith('mock-path.csv');
      
      expect(histogramService.getAvailableColumns()).toEqual(['Commodity', 'Year', 'Value']);
    });

    it('should throw an error if CSV parsing fails', async () => {
      const error = new Error('CSV parsing failed');
      (csvParser.parseCsvFile as jest.Mock).mockRejectedValue(error);
      
      await expect(histogramService.initialize()).rejects.toThrow(error);
    });
  });

  describe('getHistogramForColumn', () => {
    beforeEach(async () => {
      await histogramService.initialize();
    });

    it('should return histogram data for a valid column', () => {
      const histogram = histogramService.getHistogramForColumn('Commodity');
      
      expect(histogram).toEqual({
        'Rice': 3,
        'Wheat': 2
      });
    });

    it('should throw an error for an invalid column', () => {
      expect(() => {
        histogramService.getHistogramForColumn('InvalidColumn');
      }).toThrow("Column 'InvalidColumn' does not exist.");
    });
  });

  describe('hasColumn', () => {
    beforeEach(async () => {
      await histogramService.initialize();
    });

    it('should return true for existing columns', () => {
      expect(histogramService.hasColumn('Commodity')).toBe(true);
      expect(histogramService.hasColumn('Year')).toBe(true);
      expect(histogramService.hasColumn('Value')).toBe(true);
    });

    it('should return false for non-existing columns', () => {
      expect(histogramService.hasColumn('InvalidColumn')).toBe(false);
    });
  });
});
