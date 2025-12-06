import { useSimulationStore } from '@/store/simulationStore';
import { simulationDataService } from '@/services/simulationDataService';
import { useClock } from '@/hooks/useClock';
import { Button } from '@/components/ui/button';
import { Play, Square } from 'lucide-react';
import { useEffect } from 'react';

export const Header = () => {
  const { isRunning, toggleSimulation } = useSimulationStore();
  const time = useClock();

  useEffect(() => {
    if (isRunning) {
      simulationDataService.start();
    } else {
      simulationDataService.stop();
    }
  }, [isRunning]);

  const handleToggle = () => {
    toggleSimulation();
  };

  return (
    <header className="sticky top-0 z-50 w-full glass-strong rounded-b-3xl shadow-[0_4px_24px_rgba(0,0,0,0.05)] border-b border-white/30 mx-3 mt-3">
      <div className="flex h-20 items-center justify-between px-8">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-semibold text-[#0A0A0A] tracking-tight">Mô Phỏng Pipeline Dữ Liệu Lớn Thời Gian Thực</h1>
          {isRunning && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-white/40 rounded-full border border-white/50">
              <div className="w-2 h-2 bg-[#0A84FF] rounded-full animate-[pulse_1.4s_ease-in-out]"></div>
              <span className="text-xs text-[#6B7280] font-medium tracking-tight">Đang chạy</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-4">
          <div className="text-sm font-mono text-[#6B7280] px-4 py-2 bg-white/30 rounded-full border border-white/40">
            {time.toLocaleTimeString()}
          </div>
          <Button
            onClick={handleToggle}
            variant={isRunning ? "destructive" : "default"}
            size="sm"
          >
            {isRunning ? (
              <>
                <Square className="mr-2 h-4 w-4" />
                Dừng Mô Phỏng
              </>
            ) : (
              <>
                <Play className="mr-2 h-4 w-4" />
                Bắt Đầu Mô Phỏng
              </>
            )}
          </Button>
        </div>
      </div>
    </header>
  );
};

