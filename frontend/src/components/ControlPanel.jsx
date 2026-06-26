import React from 'react';
import { useExecutionStore } from '../store/executionStore';
import { Play, Pause, SkipBack, SkipForward, RotateCcw, SlidersHorizontal } from 'lucide-react';
import { motion } from 'framer-motion';

export const ControlPanel = () => {
  const { currentStep, isPlaying, setIsPlaying, setSpeed, speed, states, reset, nextStep, previousStep } =
    useExecutionStore();

  return (
    <div className="bg-white/5 backdrop-blur-xl p-6 rounded-3xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
      <h3 className="text-xl font-bold mb-6 text-white flex items-center gap-2">
        <SlidersHorizontal className="w-5 h-5 text-pink-400" />
        Playback
      </h3>

      <div className="space-y-6">
        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsPlaying(!isPlaying)}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold transition-colors ${
              isPlaying 
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50 hover:bg-amber-500/30' 
                : 'bg-green-500/20 text-green-300 border border-green-500/50 hover:bg-green-500/30'
            }`}
          >
            {isPlaying ? <><Pause className="w-4 h-4 fill-current" /> Pause</> : <><Play className="w-4 h-4 fill-current" /> Play</>}
          </motion.button>
          
          <div className="flex bg-[#0a0b10] border border-white/10 rounded-xl overflow-hidden p-1">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={previousStep}
              className="px-3 py-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
            >
              <SkipBack className="w-4 h-4" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={nextStep}
              className="px-3 py-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
            >
              <SkipForward className="w-4 h-4" />
            </motion.button>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05, rotate: -15 }}
            whileTap={{ scale: 0.95 }}
            onClick={reset}
            className="px-4 py-3 bg-red-500/20 text-red-400 rounded-xl hover:bg-red-500/30 font-semibold border border-red-500/50 transition-colors flex items-center justify-center"
          >
            <RotateCcw className="w-4 h-4" />
          </motion.button>
        </div>

        <div className="flex flex-col gap-3 p-4 bg-[#0a0b10] rounded-2xl border border-white/5">
          <div className="flex items-center justify-between">
            <label className="text-gray-400 font-medium text-sm flex items-center gap-2">
               Speed
            </label>
            <span className="text-blue-300 font-mono text-xs bg-blue-500/10 px-2 py-0.5 rounded">{speed}ms</span>
          </div>
          <input
            type="range"
            min="100"
            max="2000"
            step="100"
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            className="w-full accent-blue-500"
          />
        </div>

        <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 p-4 rounded-2xl border border-white/10">
          <div className="flex justify-between text-xs text-gray-400 mb-2 font-medium tracking-wider">
            <span>PROGRESS</span>
            <span>{states.length > 0 ? `${currentStep + 1} / ${states.length}` : '0 / 0'}</span>
          </div>
          <div className="w-full bg-[#0a0b10] rounded-full h-2">
            <div 
              className="flex font-mono text-xs font-bold items-center justify-center bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
              style={{ width: states.length > 0 ? `${((currentStep + 1) / states.length) * 100}%` : '0%' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
