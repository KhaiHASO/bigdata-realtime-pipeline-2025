import type { KafkaMessage, SparkMetrics, MongoRecord, Aggregation, AnalyticsData, KPIData } from '../types';

// Bộ tạo dữ liệu mô phỏng
export const generateSimulationKafkaMessage = (): KafkaMessage => {
  const topics = ['users', 'transactions', 'events', 'logs'];
  const topic = topics[Math.floor(Math.random() * topics.length)];
  
  const simulationData = {
    userId: `user_${Math.floor(Math.random() * 10000)}`,
    name: `User ${Math.floor(Math.random() * 1000)}`,
    email: `user${Math.floor(Math.random() * 1000)}@example.com`,
    action: ['login', 'purchase', 'view', 'click'][Math.floor(Math.random() * 4)],
    amount: Math.floor(Math.random() * 1000),
    timestamp: new Date().toISOString(),
  };

  return {
    id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    topic,
    partition: Math.floor(Math.random() * 3),
    offset: Math.floor(Math.random() * 100000),
    timestamp: new Date().toISOString(),
    key: simulationData.userId,
    value: simulationData,
  };
};

export const generateSimulationSparkMetrics = (): SparkMetrics => {
  return {
    inputRecordsPerSecond: Math.floor(Math.random() * 5000) + 1000,
    processedRecordsPerBatch: Math.floor(Math.random() * 1000) + 100,
    averageLatency: Math.random() * 100 + 10,
    batchesCompleted: Math.floor(Math.random() * 1000),
    lastBatchTime: new Date().toISOString(),
  };
};

export const generateSimulationMongoRecord = (): MongoRecord => {
  const categories = ['electronics', 'clothing', 'food', 'books', 'toys'];
  const category = categories[Math.floor(Math.random() * categories.length)];
  
  return {
    _id: `mongo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    userId: `user_${Math.floor(Math.random() * 10000)}`,
    name: `User ${Math.floor(Math.random() * 1000)}`,
    email: `user${Math.floor(Math.random() * 1000)}@example.com`,
    category,
    amount: Math.floor(Math.random() * 1000),
    timestamp: new Date().toISOString(),
    processed: Math.random() > 0.1,
  };
};

export const generateSimulationAggregations = (): Aggregation[] => {
  const categories = ['electronics', 'clothing', 'food', 'books', 'toys'];
  return categories.map(category => ({
    category,
    count: Math.floor(Math.random() * 1000) + 100,
    totalAmount: Math.floor(Math.random() * 50000) + 10000,
  }));
};

export const generateSimulationAnalyticsData = (count: number = 20): AnalyticsData[] => {
  const categories = ['electronics', 'clothing', 'food', 'books', 'toys'];
  const data: AnalyticsData[] = [];
  const now = Date.now();
  
  for (let i = count - 1; i >= 0; i--) {
    data.push({
      timestamp: new Date(now - i * 60000).toISOString(),
      value: Math.floor(Math.random() * 1000) + 100,
      category: categories[Math.floor(Math.random() * categories.length)],
    });
  }
  
  return data;
};

export const generateSimulationKPIData = (): KPIData => {
  return {
    totalRecords: Math.floor(Math.random() * 100000) + 50000,
    recordsPerSecond: Math.floor(Math.random() * 5000) + 1000,
    averageLatency: Math.random() * 100 + 10,
    successRate: Math.random() * 10 + 90,
  };
};

// Lớp dịch vụ quản lý việc tạo dữ liệu mô phỏng
export class SimulationDataService {
  private kafkaMessages: KafkaMessage[] = [];
  private sparkMetrics: SparkMetrics | null = null;
  private mongoRecords: MongoRecord[] = [];
  private aggregations: Aggregation[] = [];
  private analyticsData: AnalyticsData[] = [];
  private kpiData: KPIData | null = null;
  private intervals: ReturnType<typeof setInterval>[] = [];
  private isRunning = false;

  start() {
    if (this.isRunning) return;
    this.isRunning = true;

    // Tạo dữ liệu ban đầu
    this.kafkaMessages = Array.from({ length: 10 }, () => generateSimulationKafkaMessage());
    this.sparkMetrics = generateSimulationSparkMetrics();
    this.mongoRecords = Array.from({ length: 20 }, () => generateSimulationMongoRecord());
    this.aggregations = generateSimulationAggregations();
    this.analyticsData = generateSimulationAnalyticsData(30);
    this.kpiData = generateSimulationKPIData();

    // Kafka messages mỗi 1-2 giây
    const kafkaInterval = setInterval(() => {
      const newMessage = generateSimulationKafkaMessage();
      this.kafkaMessages.unshift(newMessage);
      if (this.kafkaMessages.length > 100) {
        this.kafkaMessages.pop();
      }
    }, 1500);

    // Spark metrics mỗi 2 giây
    const sparkInterval = setInterval(() => {
      this.sparkMetrics = generateSimulationSparkMetrics();
    }, 2000);

    // MongoDB records mỗi 3 giây
    const mongoInterval = setInterval(() => {
      const newRecord = generateSimulationMongoRecord();
      this.mongoRecords.unshift(newRecord);
      if (this.mongoRecords.length > 50) {
        this.mongoRecords.pop();
      }
    }, 3000);

    // Aggregations mỗi 5 giây
    const aggInterval = setInterval(() => {
      this.aggregations = generateSimulationAggregations();
    }, 5000);

    // Analytics data mỗi 2 giây
    const analyticsInterval = setInterval(() => {
      const newData = generateSimulationAnalyticsData(1)[0];
      this.analyticsData.push(newData);
      if (this.analyticsData.length > 50) {
        this.analyticsData.shift();
      }
    }, 2000);

    // KPI data mỗi 3 giây
    const kpiInterval = setInterval(() => {
      this.kpiData = generateSimulationKPIData();
    }, 3000);

    this.intervals = [kafkaInterval, sparkInterval, mongoInterval, aggInterval, analyticsInterval, kpiInterval];
  }

  stop() {
    this.isRunning = false;
    this.intervals.forEach(interval => clearInterval(interval));
    this.intervals = [];
  }

  pushKafkaMessage() {
    const newMessage = generateSimulationKafkaMessage();
    this.kafkaMessages.unshift(newMessage);
    if (this.kafkaMessages.length > 100) {
      this.kafkaMessages.pop();
    }
    return newMessage;
  }

  insertMongoRecord() {
    const newRecord = generateSimulationMongoRecord();
    this.mongoRecords.unshift(newRecord);
    if (this.mongoRecords.length > 50) {
      this.mongoRecords.pop();
    }
    return newRecord;
  }

  getKafkaMessages(): KafkaMessage[] {
    return [...this.kafkaMessages];
  }

  getSparkMetrics(): SparkMetrics | null {
    return this.sparkMetrics;
  }

  getMongoRecords(): MongoRecord[] {
    return [...this.mongoRecords];
  }

  getAggregations(): Aggregation[] {
    return [...this.aggregations];
  }

  getAnalyticsData(): AnalyticsData[] {
    return [...this.analyticsData];
  }

  getKPIData(): KPIData | null {
    return this.kpiData;
  }

  isSimulationRunning(): boolean {
    return this.isRunning;
  }
}

// Instance singleton
export const simulationDataService = new SimulationDataService();

