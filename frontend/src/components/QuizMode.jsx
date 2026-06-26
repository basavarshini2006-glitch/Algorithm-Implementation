import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, Award, TrendingUp, BookOpen, ChevronRight } from 'lucide-react';
import axios from 'axios';

export const QuizMode = ({ algorithmId, algorithms }) => {
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(0);

  useEffect(() => {
    fetchQuiz();
  }, [algorithmId]);

  const fetchQuiz = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5000/api/quiz/${algorithmId}`);
      setQuiz(response.data.questions);
      setAnswers({});
      setSubmitted(false);
      setResults(null);
    } catch (error) {
      console.error('Failed to load quiz:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (questionId, selectedIndex) => {
    setAnswers({
      ...answers,
      [questionId]: selectedIndex
    });
  };

  const handleSubmit = async () => {
    try {
      const answersArray = quiz.map((q, idx) => ({
        question_id: q.id,
        selected: answers[q.id] ?? -1
      }));

      const response = await axios.post(
        `http://localhost:5000/api/quiz/submit/${algorithmId}`,
        { answers: answersArray }
      );

      setResults(response.data);
      setSubmitted(true);
    } catch (error) {
      console.error('Failed to submit quiz:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading quiz...</p>
        </div>
      </div>
    );
  }

  if (!quiz || quiz.length === 0) {
    return (
      <div className="text-center p-8">
        <p className="text-gray-400">No quiz available for this algorithm</p>
      </div>
    );
  }

  if (submitted && results) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="space-y-6"
      >
        {/* Score Card */}
        <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 p-8 rounded-3xl text-center">
          <Award className={`w-16 h-16 mx-auto mb-4 ${
            results.percentage >= 90 ? 'text-gold' : 
            results.percentage >= 75 ? 'text-blue-400' : 
            'text-orange-400'
          }`} />

          <h3 className="text-3xl font-bold text-white mb-2">
            {results.score} / {results.total}
          </h3>

          <p className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400 mb-4">
            {Math.round(results.percentage)}%
          </p>

          <p className={`text-lg font-semibold mb-2 ${
            results.percentage >= 90 ? 'text-emerald-400' :
            results.percentage >= 75 ? 'text-blue-400' :
            results.percentage >= 60 ? 'text-yellow-400' :
            'text-orange-400'
          }`}>
            {results.status === 'excellent' && '🎉 Excellent! You mastered this topic!'}
            {results.status === 'good' && '✓ Good job! Keep practicing!'}
            {results.status === 'pass' && '👍 You passed! Review weak areas!'}
            {results.status === 'needs_improvement' && '📚 Keep studying! You can do better!'}
          </p>
        </div>

        {/* Results Details */}
        <div className="space-y-4 max-h-[600px] overflow-y-auto">
          {results.results.map((result, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={`p-6 rounded-2xl border ${
                result.is_correct
                  ? 'bg-emerald-500/10 border-emerald-500/30'
                  : 'bg-red-500/10 border-red-500/30'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 mt-1">
                  {result.is_correct ? (
                    <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                  ) : (
                    <XCircle className="w-6 h-6 text-red-400" />
                  )}
                </div>

                <div className="flex-1">
                  <p className="font-semibold text-white mb-3">
                    Q{idx + 1}: {result.question}
                  </p>

                  {!result.is_correct && (
                    <div className="mb-3 p-3 bg-white/5 rounded-lg border border-white/10">
                      <p className="text-sm text-gray-400 mb-1">Your answer:</p>
                      <p className="text-red-400 font-semibold">
                        {quiz[idx].options[result.selected_idx]}
                      </p>
                    </div>
                  )}

                  <div className="p-3 bg-blue-500/10 rounded-lg border border-blue-500/30">
                    <p className="text-sm text-blue-300 mb-2 font-semibold">Correct answer:</p>
                    <p className="text-blue-200 font-semibold">
                      {quiz[idx].options[result.correct_idx]}
                    </p>
                  </div>

                  <p className="text-sm text-gray-400 mt-3 italic">
                    💡 {result.explanation}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 pt-6 border-t border-white/10">
          <button
            onClick={fetchQuiz}
            className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-colors"
          >
            Retake Quiz
          </button>

          <button
            className="flex-1 px-6 py-3 bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-xl font-bold transition-colors flex items-center justify-center gap-2"
          >
            <TrendingUp className="w-4 h-4" />
            View Progress
          </button>
        </div>
      </motion.div>
    );
  }

  // Quiz Interface
  const question = quiz[currentQuestion];
  const answered = answers[question.id] !== undefined;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Progress Bar */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-semibold text-gray-400">
            Question {currentQuestion + 1} of {quiz.length}
          </span>
          <span className="text-sm font-semibold text-blue-400">
            {Math.round((currentQuestion / quiz.length) * 100)}%
          </span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <motion.div
            className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
            initial={{ width: 0 }}
            animate={{ width: `${(currentQuestion / quiz.length) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Question */}
      <motion.div
        key={currentQuestion}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/5 border border-white/10 p-8 rounded-2xl"
      >
        <h3 className="text-xl font-bold text-white mb-6">
          {question.question}
        </h3>

        {/* Options */}
        <div className="space-y-3">
          {question.options.map((option, idx) => (
            <motion.button
              key={idx}
              whileHover={{ scale: 1.02, x: 5 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleAnswer(question.id, idx)}
              className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                answers[question.id] === idx
                  ? 'bg-blue-600/20 border-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.3)]'
                  : 'bg-white/5 border-white/10 hover:border-white/20'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  answers[question.id] === idx
                    ? 'bg-blue-600 border-blue-600'
                    : 'border-gray-600'
                }`}>
                  {answers[question.id] === idx && (
                    <div className="w-2 h-2 bg-white rounded-full" />
                  )}
                </div>
                <span className={answers[question.id] === idx ? 'text-blue-300 font-semibold' : 'text-gray-300'}>
                  {option}
                </span>
              </div>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Navigation */}
      <div className="flex gap-4">
        <button
          onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
          disabled={currentQuestion === 0}
          className="px-6 py-3 bg-white/5 border border-white/10 disabled:opacity-50 text-white rounded-xl font-bold hover:bg-white/10 transition-colors"
        >
          Previous
        </button>

        <div className="flex-1" />

        {currentQuestion === quiz.length - 1 ? (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSubmit}
            disabled={Object.keys(answers).length < quiz.length}
            className="px-8 py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-xl font-bold transition-colors flex items-center gap-2"
          >
            <Award className="w-4 h-4" />
            Submit Quiz
          </motion.button>
        ) : (
          <motion.button
            whileHover={{ scale: 1.02 }}
            onClick={() => setCurrentQuestion(currentQuestion + 1)}
            disabled={!answered}
            className="px-8 py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-xl font-bold transition-colors flex items-center gap-2"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </motion.button>
        )}
      </div>
    </motion.div>
  );
};

export default QuizMode;

