import React, { useEffect, useState } from 'react';
import { useAlgorithmStore } from '../store/algorithmStore';
import { algorithmService, checkBackendHealth } from '../services/apiClient';
import { motion } from 'framer-motion';
import { List } from 'lucide-react';

export const AlgorithmSelector = ({ onSelect, selectedId }) => {
  const { algorithms, setAlgorithms } = useAlgorithmStore();
  const [backendUp, setBackendUp] = useState(true);

  useEffect(() => {
    const fetchAlgorithms = async () => {
      try {
        const healthy = await checkBackendHealth();
        setBackendUp(healthy);
        const data = await algorithmService.getAlgorithms();
        setAlgorithms(data);
      } catch (error) {
        console.error('Failed to fetch algorithms:', error);
      }
    };
    fetchAlgorithms();
  }, [setAlgorithms]);

  const categories = { sorting: [], searching: [], graph: [] };

  Object.entries(algorithms).forEach(([key, algo]) => {
    if (categories[algo.category]) {
      categories[algo.category].push({ id: key, ...algo });
    }
  });

  return (
    <div className="bg-white/5 backdrop-blur-xl p-6 rounded-3xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
      <h3 className="text-xl font-bold mb-4 text-white flex items-center gap-2">
        <List className="w-5 h-5 text-purple-400" />
        Library
      </h3>

      {!backendUp && (
        <div className="mb-4 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-yellow-300 text-sm">
          Backend unavailable — using local demo algorithms. Start the backend (port 5000) to enable full features.
        </div>
      )}

      <div className="space-y-6 max-h-[calc(100vh-300px)] overflow-y-auto pr-2 custom-scrollbar">
        {Object.entries(categories).map(([category, algos]) => (
          <div key={category}>
            <h4 className="font-semibold text-gray-400 uppercase tracking-wider text-xs mb-3">{category}</h4>
            <div className="space-y-2">
              {algos.map((algo) => (
                <motion.button
                  whileHover={{ scale: 1.02, x: 5 }}
                  whileTap={{ scale: 0.98 }}
                  key={algo.id}
                  onClick={() => onSelect(algo.id)}
                  className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-300 border ${
                    selectedId === algo.id 
                      ? 'bg-blue-600/20 border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.3)]' 
                      : 'bg-white/5 hover:bg-white/10 border-white/5 hover:border-white/20'
                  }`}
                >
                  <p className={`font-semibold ${selectedId === algo.id ? 'text-blue-300' : 'text-gray-200'}`}>{algo.name}</p>
                  <p className="text-xs text-gray-500 mt-1 opacity-80">O({algo.time_complexity})</p>
                </motion.button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
