import { create } from 'zustand';

interface SimulationState {
  isRunning: boolean;
  startSimulation: () => void;
  stopSimulation: () => void;
  toggleSimulation: () => void;
}

export const useSimulationStore = create<SimulationState>((set) => ({
  isRunning: false,
  startSimulation: () => {
    set({ isRunning: true });
  },
  stopSimulation: () => {
    set({ isRunning: false });
  },
  toggleSimulation: () => {
    set((state) => ({ isRunning: !state.isRunning }));
  },
}));

