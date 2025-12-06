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
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold">Mô Phỏng Pipeline Dữ Liệu Lớn Thời Gian Thực</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-sm font-mono">
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

