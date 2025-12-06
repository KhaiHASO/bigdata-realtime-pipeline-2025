import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useSimulationStore } from '@/store/simulationStore';
import { simulationDataService } from '@/services/simulationDataService';
import { ArrowRight, Database, MessageSquare, Zap, BarChart3 } from 'lucide-react';
import { useState } from 'react';

export const Overview = () => {
  const { isRunning, toggleSimulation } = useSimulationStore();
  const [tooltip, setTooltip] = useState<string | null>(null);

  const handleRunSimulation = () => {
    if (!isRunning) {
      toggleSimulation();
      simulationDataService.start();
    }
  };

  const pipelineSteps = [
    {
      name: 'CSV/Nguồn Dữ Liệu',
      icon: Database,
      description: 'Thu thập dữ liệu từ nhiều nguồn khác nhau',
      color: 'bg-blue-500',
    },
    {
      name: 'Kafka',
      icon: MessageSquare,
      description: 'Message broker cho dữ liệu streaming',
      color: 'bg-green-500',
    },
    {
      name: 'Spark Streaming',
      icon: Zap,
      description: 'Công cụ xử lý stream dữ liệu thời gian thực',
      color: 'bg-yellow-500',
    },
    {
      name: 'MongoDB',
      icon: Database,
      description: 'Cơ sở dữ liệu NoSQL lưu trữ dữ liệu đã xử lý',
      color: 'bg-emerald-500',
    },
    {
      name: 'Bảng Điều Khiển',
      icon: BarChart3,
      description: 'Phân tích và trực quan hóa dữ liệu',
      color: 'bg-purple-500',
    },
  ];

  return (
    <div className="space-y-8 animate-[fadein_0.25s_ease]">
      <div>
        <h1 className="text-3xl font-semibold mb-2 text-slate-900 tracking-tight">Tổng Quan Pipeline</h1>
        <p className="text-slate-500 tracking-tight">
          Biểu diễn trực quan của pipeline xử lý dữ liệu lớn thời gian thực
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Luồng Pipeline</CardTitle>
          <CardDescription>
            Click vào từng thành phần để tìm hiểu thêm về vai trò của nó trong pipeline
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center gap-6 flex-wrap py-8">
            {pipelineSteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={step.name} className="flex items-center gap-4">
                  <div
                    className="relative"
                    onMouseEnter={() => setTooltip(step.name)}
                    onMouseLeave={() => setTooltip(null)}
                  >
                    <div className={`
                      ${step.color} 
                      w-24 h-24 rounded-xl flex items-center justify-center 
                      text-white shadow-lg hover:scale-110 transition-all duration-300 cursor-pointer
                    `}>
                      <Icon size={32} />
                    </div>
                    {tooltip === step.name && (
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-4 py-2.5 bg-white/70 backdrop-blur-xl text-slate-900 text-sm rounded-xl whitespace-nowrap z-10 shadow-[0_8px_32px_rgba(0,0,0,0.06)] border border-white/40">
                        {step.description}
                      </div>
                    )}
                    <div className="text-center mt-2 text-sm font-medium text-slate-900 tracking-tight">
                      {step.name}
                    </div>
                  </div>
                  {index < pipelineSteps.length - 1 && (
                    <ArrowRight className="text-slate-500 animate-[pulse_1.4s_ease-in-out]" size={24} />
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Điều Khiển Mô Phỏng</CardTitle>
          <CardDescription>
            Bắt đầu mô phỏng để xem luồng dữ liệu thời gian thực qua pipeline
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Button onClick={handleRunSimulation} disabled={isRunning}>
              {isRunning ? 'Mô Phỏng Đang Chạy...' : 'Chạy Mô Phỏng'}
            </Button>
            <div className="text-sm text-slate-500 tracking-tight">
              {isRunning 
                ? '✓ Mô phỏng đang hoạt động. Dữ liệu đang được tạo theo thời gian thực.'
                : 'Click nút để bắt đầu tạo dữ liệu mô phỏng trên tất cả các thành phần.'}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="bg-gradient-to-br from-white/70 to-white/40">
          <CardHeader>
            <CardTitle>Cách Hoạt Động</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-slate-900">
            <p>1. Dữ liệu được tạo từ các nguồn mô phỏng (mô phỏng CSV)</p>
            <p>2. Tin nhắn chảy qua các Kafka topics</p>
            <p>3. Spark Streaming xử lý dữ liệu theo thời gian thực</p>
            <p>4. Dữ liệu đã xử lý được lưu trữ trong MongoDB</p>
            <p>5. Bảng điều khiển phân tích trực quan hóa kết quả</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-white/70 to-white/40">
          <CardHeader>
            <CardTitle>Tính Năng</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-slate-900">
            <p>✓ Tạo dữ liệu thời gian thực</p>
            <p>✓ Metrics và giám sát trực tiếp</p>
            <p>✓ Bảng điều khiển tương tác</p>
            <p>✓ Không cần backend</p>
            <p>✓ Pipeline hoàn toàn mô phỏng</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
