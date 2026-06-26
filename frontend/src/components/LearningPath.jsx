import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, CheckCircle2, Lock, Zap, TrendingUp, Award } from 'lucide-react';
import axios from 'axios';

export const LearningPath = ({ userLevel = 'beginner' }) => {
  const [path, setPath] = useState(null);
  const [completedAlgorithms, setCompletedAlgorithms] = useState([]);
  const [nextRecommendation, setNextRecommendation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLearningPath();
  }, [userLevel]);

  const fetchLearningPath = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:5000/api/learning-path/${userLevel}`
      );
      setPath(response.data.path);

      // Get recommendation
      const recResponse = await axios.post(
        'http://localhost:5000/api/learning-path/recommend',
        {
          completed_algorithms: completedAlgorithms,
          level: userLevel
        }
      );
      setNextRecommendation(recResponse.data);
    } catch (error) {
      console.error('Failed to load learning path:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsCompleted = (algorithm) => {
    setCompletedAlgorithms([...completedAlgorithms, algorithm]);
  };

  if (loading || !path) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading learning path...</p>
        </div>
      </div>
    );
  }

  const totalAlgorithms = path.reduce((sum, module) => sum + module.algorithms.length, 0);
  const progressPercentage = (completedAlgorithms.length / totalAlgorithms) * 100;

  return (
    <div className="space-y-8">
      {/* Overall Progress */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 p-8 rounded-3xl"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-blue-400" />
              {userLevel.charAt(0).toUpperCase() + userLevel.slice(1)} Learning Path
            </h2>
            <p className="text-gray-400">
              Progress: {completedAlgorithms.length} of {totalAlgorithms} algorithms
            </p>
          </div>
          <div className="text-right">
            <p className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
              {Math.round(progressPercentage)}%
            </p>
            <p className="text-sm text-gray-400 mt-2">Complete</p>
          </div>
        </div>

        <div className="w-full bg-black/30 rounded-full h-3 overflow-hidden">
          <motion.div
            className="h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </motion.div>

      {/* Next Recommendation */}
      {nextRecommendation && nextRecommendation.recommended_algorithm && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-r from-amber-600/20 to-orange-600/20 border border-amber-500/30 p-6 rounded-2xl"
        >
          <div className="flex items-start gap-4">
            <Zap className="w-6 h-6 text-amber-400 flex-shrink-0 mt-1" />
            <div className="flex-1">
              <h3 className="font-bold text-white mb-1">Next: Study {nextRecommendation.recommended_algorithm}</h3>
              <p className="text-sm text-amber-300">
                Module: <strong>{nextRecommendation.module}</strong>
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Learning Modules */}
      <div className="space-y-6">
        {path.map((module, moduleIdx) => (
          <motion.div
            key={moduleIdx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: moduleIdx * 0.1 }}
            className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden"
          >
            {/* Module Header */}
            <div className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 p-6 border-b border-white/10">
              <h3 className="text-lg font-bold text-white mb-2">
                {moduleIdx + 1}. {module.title}
              </h3>
              <p className="text-sm text-gray-400">
                {module.algorithms.length} algorithms to master
              </p>
            </div>

            {/* Algorithms in Module */}
            <div className="p-6 space-y-3">
              {module.algorithms.map((algo, algoIdx) => {
                const isCompleted = completedAlgorithms.includes(algo);
                const isUnlocked = algoIdx === 0 || completedAlgorithms.includes(module.algorithms[algoIdx - 1]);

                return (
                  <motion.div
                    key={algoIdx}
                    whileHover={isUnlocked && !isCompleted ? { scale: 1.02, x: 5 } : {}}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      isCompleted
                        ? 'bg-emerald-500/10 border-emerald-500/30'
                        : isUnlocked
                        ? 'bg-blue-500/10 border-blue-500/30 hover:bg-blue-500/20 cursor-pointer'
                        : 'bg-gray-500/10 border-gray-500/30 opacity-50'
                    }`}
                    onClick={() => isUnlocked && !isCompleted && markAsCompleted(algo)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1">
                        {isCompleted ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                        ) : isUnlocked ? (
                          <div className="w-5 h-5 rounded-full border-2 border-blue-400" />
                        ) : (
                          <Lock className="w-5 h-5 text-gray-500 flex-shrink-0" />
                        )}

                        <div className="flex-1">
                          <p className="font-semibold text-white">
                            {algo.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                          </p>
                        </div>
                      </div>

                      {isCompleted && (
                        <span className="text-xs font-bold text-emerald-400 bg-emerald-500/20 px-2 py-1 rounded">
                          ✓ Done
                        </span>
                      )}

                      {isUnlocked && !isCompleted && (
                        <span className="text-xs font-bold text-blue-400 bg-blue-500/20 px-2 py-1 rounded">
                          Click to complete
                        </span>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Module Progress */}
            <div className="px-6 py-4 bg-white/5 border-t border-white/10 text-sm text-gray-400">
              {module.algorithms.filter(a => completedAlgorithms.includes(a)).length} / {module.algorithms.length} complete
            </div>
          </motion.div>
        ))}
      </div>

      {/* Completion Message */}
      {completedAlgorithms.length === totalAlgorithms && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-r from-emerald-600/20 to-teal-600/20 border border-emerald-500/30 p-8 rounded-3xl text-center"
        >
          <Award className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-emerald-300 mb-2">
            🎉 Path Complete!
          </h3>
          <p className="text-gray-300">
            Congratulations! You have mastered all algorithms in the {userLevel} path.
            Ready for the next challenge?
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default LearningPath;

