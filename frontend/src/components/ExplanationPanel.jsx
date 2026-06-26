import React from 'react';
import { useExecutionStore } from '../store/executionStore';
import { useAlgorithmStore } from '../store/algorithmStore';
import { getActionExplanation, getComplexityInfo } from '../utils/visualizationHelpers';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Cpu, Box, Clock, LayoutGrid } from 'lucide-react';

export const ExplanationPanel = ({ selectedAlgorithm }) => {
  const { states, currentStep } = useExecutionStore();
  const { algorithms } = useAlgorithmStore();
  const currentState = states[currentStep];
  const algorithmInfo = algorithms[selectedAlgorithm];
  const complexityInfo = getComplexityInfo(selectedAlgorithm);

  const getActionColor = (action) => {
    const colors = {
      compare: 'from-orange-500/20 to-red-500/20 border-red-500/30 text-red-400',
      swap: 'from-amber-500/20 to-yellow-500/20 border-amber-500/30 text-amber-400',
      visit: 'from-green-500/20 to-emerald-500/20 border-green-500/30 text-green-400',
      found: 'from-blue-500/20 to-cyan-500/20 border-blue-500/30 text-blue-400',
      complete: 'from-purple-500/20 to-pink-500/20 border-purple-500/30 text-purple-400',
      default: 'from-gray-500/20 to-gray-600/20 border-gray-500/30 text-gray-300'
    };
    return colors[action] || colors.default;
  };

  const getActionIcon = (action) => {
    const icons = {
      compare: '🔄',
      swap: '⬌',
      visit: '✓',
      found: '🎯',
      complete: '✨',
      check: '🔍',
      eliminate_left: '◀️',
      eliminate_right: '▶️',
      merge: '🔗',
      explore: '📍',
      enqueue: '📦',
      update_distance: '📊'
    };
    return icons[action] || '⚙️';
  };

  return (
    <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.3)] h-full overflow-hidden flex flex-col">
      <div className="p-6 border-b border-white/10 flex items-center gap-2">
        <MessageSquare className="w-5 h-5 text-indigo-400" />
        <h3 className="text-xl font-bold text-white">Live Analysis</h3>
      </div>
      
      <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
        {currentState ? (
          <AnimatePresence mode="popLayout">
            <motion.div 
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              {/* Action Badge */}
              <div className={`bg-gradient-to-r ${getActionColor(currentState.action)} p-4 rounded-2xl border backdrop-blur-md`}>
                <div className="flex items-center gap-3">
                  <span className="text-3xl drop-shadow-lg">{getActionIcon(currentState.action)}</span>
                  <div>
                    <p className="text-[10px] font-bold tracking-widest uppercase opacity-80 mb-1">Current Operation</p>
                    <p className="text-xl font-black uppercase tracking-wider">{currentState.action}</p>
                  </div>
                </div>
              </div>

              {/* Detailed Explanation */}
              <div className="bg-[#0a0b10]/80 border-l-4 border-indigo-500 p-5 rounded-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-3 opacity-10"><MessageSquare className="w-16 h-16" /></div>
                <p className="text-xs font-bold text-indigo-400 tracking-wider mb-2 relative z-10 flex items-center gap-2">
                   DETAILED BREAKDOWN
                </p>
                <p className="text-gray-300 leading-relaxed text-sm relative z-10">
                  {getActionExplanation(currentState)}
                </p>
              </div>

              {/* Current Array State */}
              {currentState.array && (
                <div className="bg-white/[0.03] p-5 rounded-2xl border border-white/5">
                  <p className="text-xs font-bold text-gray-400 tracking-wider mb-3 flex items-center gap-2">
                    <LayoutGrid className="w-3 h-3" /> DATA STATE
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {currentState.array.map((num, idx) => (
                      <motion.div
                        key={`${idx}-${num}`}
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        className={`min-w-[40px] h-10 flex items-center justify-center rounded-xl font-mono text-sm shadow-lg border ${
                          currentState.sorted_indices?.includes(idx)
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 scale-110 shadow-emerald-500/20'
                            : currentState.swapped_indices?.includes(idx)
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 scale-110 shadow-amber-500/20'
                            : currentState.compared_indices?.includes(idx)
                            ? 'bg-rose-500/20 text-rose-300 border-rose-500/50 scale-110 shadow-rose-500/20'
                            : 'bg-[#0a0b10] text-gray-400 border-white/10'
                        }`}
                      >
                        {num}
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Complexity Info */}
              {complexityInfo && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/[0.03] p-4 rounded-2xl border border-white/5 flex flex-col justify-center items-center text-center">
                    <Clock className="w-4 h-4 text-orange-400 mb-2 mt-1" />
                    <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-1">Time Complexity</p>
                    <p className="font-mono font-bold text-orange-300 bg-orange-500/10 px-2 py-0.5 rounded w-full">{complexityInfo.timeAvg}</p>
                  </div>
                  <div className="bg-white/[0.03] p-4 rounded-2xl border border-white/5 flex flex-col justify-center items-center text-center">
                    <Box className="w-4 h-4 text-cyan-400 mb-2 mt-1" />
                    <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-1">Space Complexity</p>
                    <p className="font-mono font-bold text-cyan-300 bg-cyan-500/10 px-2 py-0.5 rounded w-full">{complexityInfo.space}</p>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        ) : (
          <div className="text-center py-16 flex flex-col items-center justify-center h-full opacity-50">
            <Cpu className="w-16 h-16 mb-4 text-gray-600" />
            <p className="text-gray-400 text-sm font-medium">Awaiting Execution</p>
            <p className="text-gray-500 text-xs mt-2 max-w-[200px]">Select an algorithm and hit run to view detailed real-time analysis.</p>
          </div>
        )}
      </div>
      
      {/* Legend */}
      <div className="p-4 border-t border-white/10 bg-[#0a0b10]/50 mt-auto">
        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">Color Mapping</p>
        <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs font-medium">
          <div className="flex items-center gap-1.5 min-w-[120px]">
            <span className="w-2.5 h-2.5 rounded bg-gray-600"></span>
            <span className="text-gray-400">Idle Element</span>
          </div>
          <div className="flex items-center gap-1.5 min-w-[120px]">
            <span className="w-2.5 h-2.5 rounded bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.6)]"></span>
            <span className="text-gray-300">Comparing</span>
          </div>
          <div className="flex items-center gap-1.5 min-w-[120px]">
            <span className="w-2.5 h-2.5 rounded bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.6)]"></span>
            <span className="text-gray-300">Swapping</span>
          </div>
          <div className="flex items-center gap-1.5 min-w-[120px]">
            <span className="w-2.5 h-2.5 rounded bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]"></span>
            <span className="text-gray-300">Sorted/Visited</span>
          </div>
        </div>
      </div>
    </div>
  );
};
