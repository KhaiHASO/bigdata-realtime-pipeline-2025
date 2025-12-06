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
    <div className="space-y-8 animate-[fadein_0.25s_ease]">
      <div>
        <h1 className="text-3xl font-semibold mb-2 text-slate-900 tracking-tight">Giao Diện Spark Streaming (Mô Phỏng)</h1>
        <p className="text-slate-500 tracking-tight">
          Metrics thời gian thực và trạng thái xử lý batch
        </p>
      </div>

      {metrics ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-gradient-to-br from-white/70 to-white/40">
              <CardHeader>
                <CardTitle className="text-lg">Bản Ghi Đầu Vào/giây</CardTitle>
                <CardDescription>Throughput</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-[#0A84FF]">
                  {metrics.inputRecordsPerSecond.toLocaleString()}
                </div>
                <p className="text-sm text-slate-500 mt-2 tracking-tight">
                  Bản ghi mỗi giây
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-white/70 to-white/40">
              <CardHeader>
                <CardTitle className="text-lg">Đã Xử Lý/Batch</CardTitle>
                <CardDescription>Kích thước batch</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-[#7D5FFF]">
                  {metrics.processedRecordsPerBatch.toLocaleString()}
                </div>
                <p className="text-sm text-slate-500 mt-2 tracking-tight">
                  Bản ghi mỗi batch
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-white/70 to-white/40">
              <CardHeader>
                <CardTitle className="text-lg">Độ Trễ Trung Bình</CardTitle>
                <CardDescription>Thời gian xử lý</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-[#FF9500]">
                  {metrics.averageLatency.toFixed(2)}ms
                </div>
                <p className="text-sm text-slate-500 mt-2 tracking-tight">
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
            <CardContent className="p-5">
              <div className="rounded-2xl bg-white/60 backdrop-blur-xl border border-white/30 p-4">
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={batchHistory}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                    <XAxis dataKey="time" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.65)',
                        backdropFilter: 'blur(24px)',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        borderRadius: '12px',
                        boxShadow: '0 8px 32px rgba(0,0,0,0.06)'
                      }} 
                    />
                    <Line
                      type="monotone"
                      dataKey="records"
                      stroke="#0A84FF"
                      strokeWidth={2}
                      dot={{ fill: '#0A84FF', r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Trạng Thái Batch</CardTitle>
              <CardDescription>Các batch hoàn thành gần đây</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 bg-white/40 backdrop-blur-xl border border-white/40 rounded-xl">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-[#0A84FF]" />
                    <span className="font-medium text-slate-900">Batch #{metrics.batchesCompleted}</span>
                  </div>
                  <div className="text-sm text-slate-500">
                    {new Date(metrics.lastBatchTime).toLocaleTimeString()}
                  </div>
                </div>
                <div className="text-sm text-slate-500 tracking-tight">
                  Tổng số batch đã hoàn thành: {metrics.batchesCompleted.toLocaleString()}
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      ) : (
        <Card>
          <CardContent className="py-8 text-center text-slate-500 tracking-tight">
            Bắt đầu mô phỏng để xem metrics Spark Streaming
          </CardContent>
        </Card>
      )}
    </div>
  );
};
