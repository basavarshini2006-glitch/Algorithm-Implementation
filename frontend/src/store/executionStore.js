import { create } from 'zustand';

export const useExecutionStore = create((set) => ({
  states: [],
  currentStep: 0,
  isPlaying: false,
  speed: 500,

  setStates: (states) => set({ states, currentStep: 0 }),
  setCurrentStep: (step) => set({ currentStep: step }),
  setIsPlaying: (isPlaying) => set({ isPlaying }),
  setSpeed: (speed) => set({ speed }),

  nextStep: () => set((state) => ({
    currentStep: Math.min(state.currentStep + 1, state.states.length - 1)
  })),

  previousStep: () => set((state) => ({
    currentStep: Math.max(state.currentStep - 1, 0)
  })),

  reset: () => set({ currentStep: 0, isPlaying: false })
}));

