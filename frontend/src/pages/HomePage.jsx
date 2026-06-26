import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Code2, Network, Search, GitBranch, Zap, Layers, PlayCircle } from 'lucide-react';

export const HomePage = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: 'spring', stiffness: 100, damping: 10 }
    }
  };

  return (
    <div className="min-h-screen bg-[#0f1016] text-white overflow-hidden relative font-sans">
      {/* Animated Background Gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/30 rounded-full blur-[120px] mix-blend-screen pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/30 rounded-full blur-[120px] mix-blend-screen pointer-events-none" />

      <motion.nav 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white/5 backdrop-blur-xl border-b border-white/10 sticky top-0 z-50"
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-tr from-blue-500 to-purple-500 p-2 rounded-lg">
              <Code2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">AlgoVision</h1>
              <p className="text-xs text-blue-300 font-medium tracking-wide uppercase">Master Algorithms</p>
            </div>
          </div>
          <Link
            to="/playground"
            className="hidden md:flex items-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-full font-medium transition-all duration-300 backdrop-blur-md border border-white/10 hover:scale-105"
          >
            <PlayCircle className="w-4 h-4" />
            Launch Visualizer
          </Link>
        </div>
      </motion.nav>

      <main className="max-w-7xl mx-auto px-6 py-20 relative z-10">
        <section className="text-center mb-24 relative">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.7, type: 'spring' }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full mb-8 backdrop-blur-md"
          >
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-sm font-medium text-blue-200">Interactive Learning Platform 2.0</span>
          </motion.div>

          <motion.h2 
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-6xl md:text-8xl font-extrabold mb-6 tracking-tight leading-tight"
          >
            Visualize The <br className="hidden md:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
              Invisible Logic.
            </span>
          </motion.h2>

          <motion.p 
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl md:text-2xl text-gray-400 mb-10 max-w-3xl mx-auto font-light leading-relaxed"
          >
            Elevate your understanding of complex data structures and algorithms through highly interactive, cinematic step-by-step visualizations.
          </motion.p>
          
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Link
              to="/playground"
              className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-bold text-lg hover:shadow-[0_0_40px_rgba(59,130,246,0.5)] transition-all duration-300 hover:scale-105"
            >
              Start Exploring
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </section>

        <motion.section 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24"
        >
          {[{
            icon: <Network className="w-8 h-8 text-blue-400" />,
            title: "Sorting Intelligence",
            desc: "Watch numbers dance into order.",
            items: ["Bubble Sort", "Merge Sort", "Quick Sort"]
          }, {
            icon: <Search className="w-8 h-8 text-purple-400" />,
            title: "Advanced Searching",
            desc: "Find needles in digital haystacks.",
            items: ["Linear Search", "Binary Search", "Jump Search"]
          }, {
            icon: <GitBranch className="w-8 h-8 text-pink-400" />,
            title: "Graph Traversal",
            desc: "Navigate complex node networks.",
            items: ["BFS & DFS", "Dijkstra's Path", "A* Algorithm"]
          }].map((category, i) => (
            <motion.div 
              key={i}
              variants={itemVariants}
              whileHover={{ y: -10, scale: 1.02 }}
              className="bg-white/[0.03] backdrop-blur-xl p-8 rounded-3xl border border-white/10 hover:border-white/20 transition-all duration-300 shadow-xl shadow-black/50 group"
            >
              <div className="bg-white/5 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                {category.icon}
              </div>
              <h3 className="text-2xl font-bold mb-2 text-white">{category.title}</h3>
              <p className="text-gray-400 mb-6 text-sm">{category.desc}</p>
              <ul className="space-y-3">
                {category.items.map((item, j) => (
                  <li key={j} className="flex items-center gap-2 text-gray-300 text-sm font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-blue-400 to-purple-400" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.section>

        <motion.section 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="bg-gradient-to-br from-white/[0.05] to-transparent backdrop-blur-2xl p-10 md:p-14 rounded-[40px] border border-white/10 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px]" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-[80px]" />
          
          <div className="relative z-10">
            <motion.div variants={itemVariants} className="flex items-center gap-4 mb-10">
              <div className="p-3 bg-white/10 rounded-xl">
                <Zap className="w-6 h-6 text-yellow-400" />
              </div>
              <h3 className="text-3xl font-bold">Premium Features</h3>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-gray-300">
              {['Interactive step-by-step execution', 'Fluid cinematic animations', 'Custom dataset input support', 'Live time & space complexity metrics', 'Adjustable execution timeline', 'Deep AI-driven contextual explanations'].map((feature, i) => (
                <motion.div key={i} variants={itemVariants} className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-white/10 transition-colors">
                  <Layers className="w-5 h-5 text-blue-400 flex-shrink-0" />
                  <span className="text-sm font-medium">{feature}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>
      </main>
    </div>
  );
};

