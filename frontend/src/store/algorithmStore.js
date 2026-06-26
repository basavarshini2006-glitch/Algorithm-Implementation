import { create } from 'zustand';

export const useAlgorithmStore = create((set) => ({
  algorithms: {},
  selectedAlgorithm: null,
  loading: false,
  error: null,

  setAlgorithms: (algorithms) => set({ algorithms }),
  setSelectedAlgorithm: (algorithm) => set({ selectedAlgorithm: algorithm }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error })
}));

