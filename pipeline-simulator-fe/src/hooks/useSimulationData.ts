import { useState, useEffect } from 'react';
import { simulationDataService } from '../services/simulationDataService';
import { useSimulationStore } from '../store/simulationStore';
import type { KafkaMessage, SparkMetrics, MongoRecord, Aggregation, AnalyticsData, KPIData } from '../types';

export const useKafkaMessages = () => {
  const [messages, setMessages] = useState<KafkaMessage[]>([]);
  const isRunning = useSimulationStore((state) => state.isRunning);

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setMessages(simulationDataService.getKafkaMessages());
    }, 500);

    return () => clearInterval(interval);
  }, [isRunning]);

  return messages;
};

export const useSparkMetrics = () => {
  const [metrics, setMetrics] = useState<SparkMetrics | null>(null);
  const isRunning = useSimulationStore((state) => state.isRunning);

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setMetrics(simulationDataService.getSparkMetrics());
    }, 500);

    return () => clearInterval(interval);
  }, [isRunning]);

  return metrics;
};

export const useMongoRecords = () => {
  const [records, setRecords] = useState<MongoRecord[]>([]);
  const isRunning = useSimulationStore((state) => state.isRunning);

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setRecords(simulationDataService.getMongoRecords());
    }, 500);

    return () => clearInterval(interval);
  }, [isRunning]);

  return records;
};

export const useAggregations = () => {
  const [aggregations, setAggregations] = useState<Aggregation[]>([]);
  const isRunning = useSimulationStore((state) => state.isRunning);

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setAggregations(simulationDataService.getAggregations());
    }, 500);

    return () => clearInterval(interval);
  }, [isRunning]);

  return aggregations;
};

export const useAnalyticsData = () => {
  const [data, setData] = useState<AnalyticsData[]>([]);
  const isRunning = useSimulationStore((state) => state.isRunning);

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setData(simulationDataService.getAnalyticsData());
    }, 500);

    return () => clearInterval(interval);
  }, [isRunning]);

  return data;
};

export const useKPIData = () => {
  const [kpi, setKPI] = useState<KPIData | null>(null);
  const isRunning = useSimulationStore((state) => state.isRunning);

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setKPI(simulationDataService.getKPIData());
    }, 500);

    return () => clearInterval(interval);
  }, [isRunning]);

  return kpi;
};

