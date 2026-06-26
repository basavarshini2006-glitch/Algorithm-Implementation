import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Database, Target } from 'lucide-react';

export const InputForm = ({ onSubmit, algorithmType }) => {
  const [arrayInput, setArrayInput] = useState('5,3,8,1,9,2');
  const [targetInput, setTargetInput] = useState('');
  const [nodesInput, setNodesInput] = useState('A,B,C');
  const [edgesInput, setEdgesInput] = useState('A-B:1, B-C:2, A-C:4');
  const [startInput, setStartInput] = useState('A');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    try {
      setError('');

      const isGraph = ['bfs', 'dfs', 'cycle_detection'].includes(algorithmType);

      if (isGraph) {
        // Parse graph inputs
        const nodes = nodesInput.trim().split(/[\s,]+/).filter(n => n);
        const edges = [];
        if (edgesInput.trim()) {
          const edgeParts = edgesInput.split(',').map(e => e.trim());
          for (const part of edgeParts) {
            if (part.includes('-')) {
              const [edgeStr, weightStr] = part.split(':').map(s => s.trim());
              const [src, dst] = edgeStr.split('-').map(s => s.trim());
              const weight = weightStr ? parseFloat(weightStr) : 1;
              if (src && dst) edges.push([src, dst, weight]);
            }
          }
        }

        if (nodes.length === 0) {
          setError('Enter valid nodes');
          return;
        }

        onSubmit({
          nodes,
          edges,
          start: startInput.trim() || nodes[0]
        });
      } else {
        // Parse array inputs
        const arr = arrayInput
          .trim()
          .split(/[\s,]+/)
          .map(Number)
          .filter((num) => !isNaN(num));

        if (arr.length === 0) {
          setError('Enter valid numbers separated by commas');
          return;
        }

        if (algorithmType?.includes('search') && !targetInput) {
          setError('Enter target value');
          return;
        }

        onSubmit({
          array: arr,
          target: targetInput ? Number(targetInput) : undefined
        });
      }
    } catch (err) {
      setError('Invalid input format');
    }
  };

  return (
    <div className="bg-white/5 backdrop-blur-xl p-6 rounded-3xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.3)] mt-6">
      <h3 className="text-xl font-bold mb-6 text-white flex items-center gap-2">
        <Database className="w-5 h-5 text-blue-400" />
        Input Data
      </h3>

      <div className="grid grid-cols-1 gap-4">
        {['bfs', 'dfs', 'cycle_detection'].includes(algorithmType) ? (
          <>
            <div>
              <label className="block text-gray-400 font-medium mb-2 text-sm">Nodes (comma separated)</label>
              <input
                type="text"
                value={nodesInput}
                onChange={(e) => setNodesInput(e.target.value)}
                placeholder="A, B, C..."
                className="w-full px-4 py-3 bg-[#0a0b10] border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all"
              />
            </div>
            <div>
              <label className="block text-gray-400 font-medium mb-2 text-sm">Edges (format: A-B:1, B-C:2)</label>
              <input
                type="text"
                value={edgesInput}
                onChange={(e) => setEdgesInput(e.target.value)}
                placeholder="A-B:1, B-C:2, A-C:4..."
                className="w-full px-4 py-3 bg-[#0a0b10] border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all"
              />
            </div>
            <div>
              <label className="block text-gray-400 font-medium mb-2 text-sm">Start Node</label>
              <input
                type="text"
                value={startInput}
                onChange={(e) => setStartInput(e.target.value)}
                placeholder="A"
                className="w-full px-4 py-3 bg-[#0a0b10] border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all"
              />
            </div>
          </>
        ) : (
          <>
            <div>
              <label className="block text-gray-400 font-medium mb-2 text-sm">Array Elements (comma separated)</label>
              <input
                type="text"
                value={arrayInput}
                onChange={(e) => setArrayInput(e.target.value)}
                placeholder="5, 3, 8, 1..."
                className="w-full px-4 py-3 bg-[#0a0b10] border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all"
              />
            </div>

            {algorithmType?.includes('search') && (
              <div>
                <label className="block text-gray-400 font-medium mb-2 text-sm flex items-center gap-1">
                  <Target className="w-3 h-3" /> Target Value
                </label>
                <input
                  type="number"
                  value={targetInput}
                  onChange={(e) => setTargetInput(e.target.value)}
                  placeholder="Enter target value"
                  className="w-full px-4 py-3 bg-[#0a0b10] border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all"
                />
              </div>
            )}
          </>
        )}

        <div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSubmit}
            className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_25px_rgba(59,130,246,0.3)] hover:shadow-[0_0_25px_rgba(59,130,246,0.5)] transition-shadow"
          >
            <Play className="w-4 h-4 fill-current" />
            Run
          </motion.button>
        </div>
      </div>
      
      {error && (
        <motion.p 
          initial={{ opacity: 0, y: -10 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="text-red-400 text-sm mt-3 font-medium bg-red-500/10 px-3 py-2 rounded-lg border border-red-500/20 inline-block"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
};
