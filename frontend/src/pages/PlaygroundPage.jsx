import React, { useState, useEffect } from 'react';
import { useExecutionStore } from '../store/executionStore';
import { useAlgorithmStore } from '../store/algorithmStore';
import { algorithmService } from '../services/apiClient';
import { AlgorithmSelector } from '../components/AlgorithmSelector';
import { InputForm } from '../components/InputForm';
import { VisualizationCanvas } from '../components/VisualizationCanvas';
import { ControlPanel } from '../components/ControlPanel';
import { ExplanationPanel } from '../components/ExplanationPanel';
import { TutorialMode } from '../components/TutorialMode';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Settings2, BookOpen, Activity, ArrowLeft } from 'lucide-react';

export const PlaygroundPage = () => {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showTutorial, setShowTutorial] = useState(false);
  const [graphData, setGraphData] = useState(null);
  const { setStates, states, currentStep, isPlaying, speed, nextStep } = useExecutionStore();
  const { algorithms } = useAlgorithmStore();

  useEffect(() => {
    if (!isPlaying || states.length === 0) return;

    const interval = setInterval(() => {
      nextStep();
    }, speed);

    return () => clearInterval(interval);
  }, [isPlaying, speed, states.length, nextStep]);

  const handleAlgorithmSelect = (algorithmId) => {
    setSelectedAlgorithm(algorithmId);
    setError('');
    setStates([]);
  };

  const handleRunAlgorithm = async (input) => {
    try {
      setError('');
      setLoading(true);

      const request = { algorithm: selectedAlgorithm };
      const isGraph = ['bfs', 'dfs', 'cycle_detection'].includes(selectedAlgorithm);

      if (isGraph) {
        if (input.nodes && input.edges) {
          request.nodes = input.nodes;
          request.edges = input.edges;
          if (input.start) request.start = input.start;
        } else if (Array.isArray(input.array) && input.array.length > 0) {
          const nodes = input.array.map((v) => String(v));
          const edges = [];
          for (let i = 0; i < nodes.length - 1; i++) edges.push([nodes[i], nodes[i + 1], 1]);
          request.nodes = nodes;
          request.edges = edges;
          request.start = nodes[0];
        } else {
          if (input.nodes) request.nodes = input.nodes;
          if (input.edges) request.edges = input.edges;
          if (input.start) request.start = input.start;
        }
      } else {
        request.input_data = input.array;
        if (input.target !== undefined) request.target = input.target;
      }

      const data = await algorithmService.runAlgorithm(request);

      // Update states in store
      setStates(data.states || []);

      // Update graph data for visualization
      if (isGraph) {
        const nodes = data.nodes || request.nodes || null;
        const edges = data.edges || request.edges || null;
        setGraphData(nodes || edges ? { nodes, edges } : null);
      } else {
        setGraphData(null);
      }
    } catch (err) {
      setError('Error running algorithm: ' + (err?.message || err));
    } finally {
      setLoading(false);
    }
  };

  const algorithmInfo = selectedAlgorithm ? algorithms[selectedAlgorithm] : null;

  return (
    <div className="min-h-screen bg-[#0f1016] text-white overflow-x-hidden font-sans pb-10">
      {/* Background Blur Elements */}
      <div className="fixed top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-600/20 rounded-full blur-[150px] mix-blend-screen pointer-events-none z-0" />
      <div className="fixed bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-purple-600/20 rounded-full blur-[150px] mix-blend-screen pointer-events-none z-0" />

      <nav className="relative z-50 bg-[#0f1016]/80 backdrop-blur-2xl border-b border-white/10 sticky top-0">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <Link to="/" className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">Playground</h1>
              <p className="text-xs text-gray-400 font-medium">Interactive Algorithm Workspace</p>
            </div>
          </div>
          {selectedAlgorithm && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowTutorial(!showTutorial)}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-full font-semibold transition-all duration-300 border ${
                showTutorial
                  ? 'bg-blue-600/20 border-blue-500/50 text-blue-300'
                  : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
              }`}
            >
              {showTutorial ? (
                <><Activity className="w-4 h-4" /> Visualizer Workspace</>
              ) : (
                <><BookOpen className="w-4 h-4" /> Interactive Tutorial</>
              )}
            </motion.button>
          )}
        </div>
      </nav>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        <AnimatePresence mode="wait">
          {showTutorial && selectedAlgorithm && algorithms[selectedAlgorithm] &&
           (algorithms[selectedAlgorithm].name === 'Bubble Sort' ||
            algorithms[selectedAlgorithm].name === 'Merge Sort' ||
            algorithms[selectedAlgorithm].name === 'Quick Sort') ? (
            <motion.div
              key="tutorial"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <TutorialMode algorithmId={selectedAlgorithm} algorithms={algorithms} />
            </motion.div>
          ) : (
            <motion.div
              key="workspace"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {error && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mb-6 bg-red-500/10 border border-red-500/50 p-4 rounded-xl text-red-400 flex items-center gap-3 backdrop-blur-md"
                >
                  <Activity className="w-5 h-5 flex-shrink-0" />
                  <p>{error}</p>
                </motion.div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-4 xl:grid-cols-12 gap-6">
                {/* Left Sidebar - Algorithm Library */}
                <div className="md:col-span-4 xl:col-span-3 space-y-6 h-fit">
                  <AlgorithmSelector onSelect={handleAlgorithmSelect} selectedId={selectedAlgorithm} />
                  
                  <AnimatePresence>
                    {algorithmInfo && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white/5 backdrop-blur-xl p-5 rounded-2xl border border-white/10 relative overflow-hidden"
                      >
                        <div className="absolute top-0 right-0 p-4 opacity-10"><Settings2 className="w-24 h-24" /></div>
                        <h4 className="font-bold text-white mb-2 text-lg relative z-10">{algorithmInfo.name}</h4>
                        <p className="text-sm text-gray-400 mb-4 leading-relaxed relative z-10">{algorithmInfo.description}</p>
                        <div className="space-y-3 pt-3 border-t border-white/10 relative z-10">
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-500">Time</span>
                            <span className="font-mono text-blue-300 bg-blue-500/10 px-2 py-0.5 rounded">{algorithmInfo.time_complexity}</span>
                          </div>
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-500">Space</span>
                            <span className="font-mono text-purple-300 bg-purple-500/10 px-2 py-0.5 rounded">{algorithmInfo.space_complexity}</span>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Main Content - Visualization & Input */}
                <div className="md:col-span-4 xl:col-span-6 space-y-6">
                  <div className="bg-white/5 backdrop-blur-xl p-6 rounded-3xl border border-white/10 flex flex-col h-[500px]">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-bold flex items-center gap-2">
                        <Activity className="w-5 h-5 text-blue-400" />
                        Visualization Canvas
                      </h3>
                      {loading && <span className="text-xs text-blue-400 animate-pulse bg-blue-400/10 px-3 py-1 rounded-full">Executing...</span>}
                    </div>
                    
                    <div className="flex-1 bg-[#0a0b10] rounded-2xl border border-white/5 overflow-hidden relative">
                      {states.length > 0 ? (
                        <div className="absolute inset-0 p-4 overflow-auto">
                          <VisualizationCanvas state={states[currentStep]} type={selectedAlgorithm?.includes('sort') ? 'sorting' : selectedAlgorithm?.includes('search') ? 'searching' : 'graph'} graphData={graphData} />
                        </div>
                      ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500">
                          <Activity className="w-12 h-12 mb-3 opacity-30" />
                          <p className="text-sm">Select an algorithm and click "Run" to visualize</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {selectedAlgorithm && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                      <InputForm onSubmit={handleRunAlgorithm} algorithmType={selectedAlgorithm} />
                    </motion.div>
                  )}
                </div>

                {/* Right Column - Controls & Analysis */}
                <div className="md:col-span-4 xl:col-span-3 space-y-6 h-fit">
                  <ControlPanel onRun={handleRunAlgorithm} />
                  <ExplanationPanel selectedAlgorithm={selectedAlgorithm} />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
