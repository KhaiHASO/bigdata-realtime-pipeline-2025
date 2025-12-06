import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAnalyticsData, useKPIData } from '@/hooks/useSimulationData';
import { BarChart3, TrendingUp, Activity, Zap } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#0A84FF', '#7D5FFF', '#FF9500', '#34C759', '#AF52DE'];

export const Analytics = () => {
  const analyticsData = useAnalyticsData();
  const kpiData = useKPIData();

  // Chuẩn bị dữ liệu cho biểu đồ
  const lineChartData = analyticsData.slice(-20).map(item => ({
    time: new Date(item.timestamp).toLocaleTimeString(),
    value: item.value,
  }));

  const categoryCounts = analyticsData.reduce((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const pieData = Object.entries(categoryCounts).map(([name, value]) => ({
    name,
    value,
  }));

  const barData = analyticsData.slice(-10).map(item => ({
    category: item.category,
    value: item.value,
  }));

  const glassTooltipStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.65)',
    backdropFilter: 'blur(24px)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    borderRadius: '12px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.06)'
  };

  return (
    <div className="space-y-8 animate-[fadein_0.25s_ease]">
      <div>
        <h1 className="text-3xl font-semibold mb-2 text-slate-900 tracking-tight">Bảng Điều Khiển Phân Tích</h1>
        <p className="text-slate-500 tracking-tight">
          Phân tích và trực quan hóa thời gian thực
        </p>
      </div>

      {kpiData && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <Card className="bg-gradient-to-br from-white/70 to-white/40">
            <CardHeader className="pb-2">
              <CardDescription>Tổng Bản Ghi</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold text-slate-900">{kpiData.totalRecords.toLocaleString()}</div>
                <BarChart3 className="h-4 w-4 text-slate-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-white/70 to-white/40">
            <CardHeader className="pb-2">
              <CardDescription>Bản Ghi/giây</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold text-slate-900">{kpiData.recordsPerSecond.toLocaleString()}</div>
                <Activity className="h-4 w-4 text-slate-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-white/70 to-white/40">
            <CardHeader className="pb-2">
              <CardDescription>Độ Trễ Trung Bình</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold text-slate-900">{kpiData.averageLatency.toFixed(2)}ms</div>
                <Zap className="h-4 w-4 text-slate-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-white/70 to-white/40">
            <CardHeader className="pb-2">
              <CardDescription>Tỷ Lệ Thành Công</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold text-slate-900">{kpiData.successRate.toFixed(1)}%</div>
                <TrendingUp className="h-4 w-4 text-slate-500" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Biểu Đồ Đường Thời Gian Thực</CardTitle>
            <CardDescription>Giá trị theo thời gian</CardDescription>
          </CardHeader>
          <CardContent className="p-5">
            <div className="rounded-2xl bg-white/60 backdrop-blur-xl border border-white/30 p-4">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={lineChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis dataKey="time" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip contentStyle={glassTooltipStyle} />
                  <Legend />
                  <Line type="monotone" dataKey="value" stroke="#0A84FF" strokeWidth={2} dot={{ fill: '#0A84FF', r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Phân Bố Theo Danh Mục</CardTitle>
            <CardDescription>Biểu đồ tròn theo danh mục</CardDescription>
          </CardHeader>
          <CardContent className="p-5">
            <div className="rounded-2xl bg-white/60 backdrop-blur-xl border border-white/30 p-4">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${percent ? (percent * 100).toFixed(0) : 0}%`}
                    outerRadius={80}
                    fill="#0A84FF"
                    dataKey="value"
                  >
                    {pieData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={glassTooltipStyle} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Biểu Đồ Cột</CardTitle>
          <CardDescription>Các điểm dữ liệu gần đây</CardDescription>
        </CardHeader>
        <CardContent className="p-5">
          <div className="rounded-2xl bg-white/60 backdrop-blur-xl border border-white/30 p-4">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="category" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip contentStyle={glassTooltipStyle} />
                <Legend />
                <Bar dataKey="value" fill="#0A84FF" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
