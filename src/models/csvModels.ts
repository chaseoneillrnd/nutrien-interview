export enum CsvColumnName {
  Attribute = 'Attribute',
  Commodity = 'Commodity',
  CommodityType = 'CommodityType',
  Units = 'Units',
  YearType = 'YearType',
  Year = 'Year',
  Value = 'Value'
}

export interface CsvRowData {
  [CsvColumnName.Attribute]: string;
  [CsvColumnName.Commodity]: string;
  [CsvColumnName.CommodityType]: string;
  [CsvColumnName.Units]: string;
  [CsvColumnName.YearType]: string;
  [CsvColumnName.Year]: string;
  [CsvColumnName.Value]: string;
}

export interface HistogramData {
  [key: string]: number;
}

export interface ColumnsResponse {
  columns: string[];
}

export interface ErrorResponse {
  error: string;
}
