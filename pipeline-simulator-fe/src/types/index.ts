export interface KafkaMessage {
  id: string;
  topic: string;
  partition: number;
  offset: number;
  timestamp: string;
  key: string;
  value: Record<string, any>;
}

export interface SparkMetrics {
  inputRecordsPerSecond: number;
  processedRecordsPerBatch: number;
  averageLatency: number;
  batchesCompleted: number;
  lastBatchTime: string;
}

export interface MongoRecord {
  _id: string;
  userId: string;
  name: string;
  email: string;
  category: string;
  amount: number;
  timestamp: string;
  processed: boolean;
}

export interface Aggregation {
  category: string;
  count: number;
  totalAmount: number;
}

export interface AnalyticsData {
  timestamp: string;
  value: number;
  category: string;
}

export interface KPIData {
  totalRecords: number;
  recordsPerSecond: number;
  averageLatency: number;
  successRate: number;
}

