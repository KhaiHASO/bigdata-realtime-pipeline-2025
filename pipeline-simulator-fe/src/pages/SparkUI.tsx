import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useSparkMetrics } from '@/hooks/useSimulationData';
import { Zap, CheckCircle2 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useState, useEffect } from 'react';

export const SparkUI = () => {
  const metrics = useSparkMetrics();
  const [batchHistory, setBatchHistory] = useState<Array<{ time: string; records: number }>>([]);

  useEffect(() => {
    if (metrics) {
      setBatchHistory((prev) => {
        const newHistory = [
          ...prev,
          {
            time: new Date().toLocaleTimeString(),
            records: metrics.processedRecordsPerBatch,
          },
        ];
        return newHistory.slice(-20);
      });
    }
  }, [metrics]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Giao Diện Spark Streaming (Mô Phỏng)</h1>
        <p className="text-muted-foreground">
          Metrics thời gian thực và trạng thái xử lý batch
        </p>
      </div>

      {metrics ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Bản Ghi Đầu Vào/giây</CardTitle>
                <CardDescription>Throughput</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">
                  {metrics.inputRecordsPerSecond.toLocaleString()}
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Bản ghi mỗi giây
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Đã Xử Lý/Batch</CardTitle>
                <CardDescription>Kích thước batch</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">
                  {metrics.processedRecordsPerBatch.toLocaleString()}
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Bản ghi mỗi batch
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Độ Trễ Trung Bình</CardTitle>
                <CardDescription>Thời gian xử lý</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-yellow-600">
                  {metrics.averageLatency.toFixed(2)}ms
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Độ trễ xử lý trung bình
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Lịch Sử Xử Lý Batch
              </CardTitle>
              <CardDescription>
                Bản ghi đã xử lý mỗi batch theo thời gian
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={batchHistory}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="records"
                    stroke="#8884d8"
                    strokeWidth={2}
                    dot={{ fill: '#8884d8' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Trạng Thái Batch</CardTitle>
              <CardDescription>Các batch hoàn thành gần đây</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                    <span className="font-medium">Batch #{metrics.batchesCompleted}</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {new Date(metrics.lastBatchTime).toLocaleTimeString()}
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  Tổng số batch đã hoàn thành: {metrics.batchesCompleted.toLocaleString()}
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      ) : (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            Bắt đầu mô phỏng để xem metrics Spark Streaming
          </CardContent>
        </Card>
      )}
    </div>
  );
};
