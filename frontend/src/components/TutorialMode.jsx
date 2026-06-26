import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, ChevronLeft, ChevronRight, HelpCircle, GraduationCap, FileCode2, Play } from 'lucide-react';

// Get simple explanations with real-world analogies
const getSimpleExplanation = (algorithmId, stepType, step) => {
  const simpleExplanations = {
    bubble_sort: {
      concept: [
        {
          title: "🧠 Simple Way to Think About It",
          simple: "Imagine you have a line of kids by height. You go down the line and swap any kid who is taller than the next kid. You do this again and again until no more swaps are needed. That's Bubble Sort!"
        },
        {
          title: "🧠 Real World Example",
          simple: "Like arranging books on a shelf. You compare adjacent books and swap if the left one is bigger. Keep doing this until all books are sorted from small to big."
        },
        {
          title: "🧠 Easy Memory Tip",
          simple: "Think of it as BUBBLES RISING. Bigger numbers 'bubble' up to the right side, just like air bubbles rise in water. After each pass, one more number reaches its correct spot."
        },
        {
          title: "🧠 Why It's Called 'Bubble'",
          simple: "Each pass pushes the largest unsorted number to the right, like a bubble floating up. The biggest 'bubble' reaches the top first!"
        }
      ],
      code: [
        {
          title: "🧠 What is a 'Temp Variable'?",
          simple: "When you swap two things (like cup A and cup B), you need a helper. Give cup A to someone (temp), then cup B goes where A was, then give temp cup (A) to B. That's what 'let temp' does!"
        },
        {
          title: "🧠 Why Loop From 0 to n-i-1?",
          simple: "Each pass puts one number in the right place. So you don't need to check those already-sorted numbers again. First pass: check all. Second pass: check all-1. And so on."
        },
        {
          title: "🧠 Understanding if (arr[j] > arr[j+1])",
          simple: "Simply asking: 'Is the LEFT number bigger than the RIGHT number?' If YES → swap them. If NO → keep going. That's it!"
        },
        {
          title: "🧠 Two Loops Explained",
          simple: "Outer loop: HOW MANY times to repeat the whole process (need n passes). Inner loop: WHAT to do each time (compare pairs and swap)."
        }
      ]
    },
    merge_sort: {
      concept: [
        {
          title: "🧠 Simple Way to Think About It",
          simple: "Imagine you're organizing a messy pile of papers. You split it in half, then split each half in half, until you have single papers (which are sorted). Then you neatly combine them back together, matching from each pile. Boom! Sorted!"
        },
        {
          title: "🧠 Real World Example",
          simple: "Like merging two sorted lists. If your left list has [3,5] and right list has [1,8], you compare 3 and 1, take 1, then compare 3 and 8, take 3, etc. Result: [1,3,5,8]"
        },
        {
          title: "🧠 The Magic Word: DIVIDE",
          simple: "Keep splitting the problem into smaller pieces until it's too easy to fail (single element is always sorted). Then put the easy pieces back together."
        },
        {
          title: "🧠 Two Main Parts",
          simple: "DIVIDE: Split array in half over and over. CONQUER: Merge the small sorted pieces back together, combining them in sorted order."
        }
      ],
      code: [
        {
          title: "🧠 Base Case: if (arr.length <= 1)",
          simple: "This is the STOP sign. A single element or empty array is already sorted, so just return it. Don't split anymore!"
        },
        {
          title: "🧠 What Does Recursion Do?",
          simple: "It's like calling yourself. mergeSort keeps calling itself with smaller arrays until it hits the base case (1 element). Then it climbs back up, merging as it goes."
        },
        {
          title: "🧠 The Merge Function",
          simple: "You have two sorted piles. Take the smallest from either pile and add to result. Keep doing this until both piles are empty. Result is sorted!"
        },
        {
          title: "🧠 Why It's Efficient",
          simple: "Even though you split and merge many times, you only compare/move each element a few times (log n levels). That's why it's O(n log n)."
        }
      ]
    }
  };

  if (simpleExplanations[algorithmId]) {
    const explanations = simpleExplanations[algorithmId][stepType];
    if (explanations && explanations[step]) {
      return explanations[step];
    }
  }

  return {
    title: "🧠 Let Me Explain Simply",
    simple: "Think of this algorithm like sorting toys. You follow simple rules: compare, swap if needed, repeat. Keep doing this until everything is in order!"
  };
};

export const TutorialMode = ({ algorithmId, algorithms }) => {
  const [tutorialStep, setTutorialStep] = useState(0);
  const [showCodeView, setShowCodeView] = useState(false);
  const [userUnderstanding, setUserUnderstanding] = useState(null);
  const [codeStep, setCodeStep] = useState(0);
  const [showSimpleExplanation, setShowSimpleExplanation] = useState(false);

  const algorithmInfo = algorithms[algorithmId];

  const tutorials = {
    bubble_sort: [
      {
        title: '🔵 Understanding Bubble Sort',
        description: 'Bubble Sort works by repeatedly comparing adjacent elements and swapping them if they are in the wrong order. Think of bubbles rising to the surface - larger numbers "bubble" to the right.',
        diagram: `Initial: [5, 3, 8, 1]
Step 1:  Compare 5 and 3 → Swap → [3, 5, 8, 1]
Step 2:  Compare 5 and 8 → No swap → [3, 5, 8, 1]
Step 3:  Compare 8 and 1 → Swap → [3, 5, 1, 8]
Result:  Largest (8) is now in correct position ✓`
      },
      {
        title: '🔄 The Comparison Process',
        description: 'In each pass through the array, we compare each pair of adjacent elements. If the left element is greater than the right element, we swap them.',
        diagram: `Pass 1: [5,3,8,1] → [3,5,1,8]  (8 moved to correct position)
Pass 2: [3,5,1,8] → [1,3,5,8]  (5 moved to correct position)
Pass 3: [1,3,5,8]               (Already sorted, no swaps needed)
✅ Sorting complete!`
      },
      {
        title: '⏱️ Complexity Analysis',
        description: 'Bubble Sort has O(n²) time complexity. This means if you double the array size, it takes 4 times longer. It is not efficient for large datasets.',
        diagram: `Array Size → Time
10 elements → ~100 operations
100 elements → ~10,000 operations
1000 elements → ~1,000,000 operations

Rule: O(n²) = n × n operations needed`
      },
      {
        title: '💡 Key Takeaways',
        description: 'Remember: Bubble Sort is simple but slow. It compares neighbors and swaps them. After each pass, one more element is in its correct position. Perfect for learning, but not for production!',
        diagram: `✓ Simple to understand
✓ In-place sorting (no extra space)
✓ Stable (keeps equal elements ordered)
✗ Very slow for large data
✗ Not used in production`
      }
    ],
    merge_sort: [
      {
        title: '🔀 Understanding Merge Sort',
        description: 'Merge Sort divides the array into halves, recursively sorts each half, then merges them back together in sorted order. Divide and Conquer approach!',
        diagram: `[5,3,8,1] 
  ↓ Divide
[5,3] [8,1]
  ↓ Divide
[5] [3] [8] [1]
  ↓ Merge sorted pairs
[3,5] [1,8]
  ↓ Merge
[1,3,5,8]
✅ Sorted!`
      },
      {
        title: '📊 The Divide Phase',
        description: 'In the divide phase, we recursively split the array into smaller pieces until each piece has only 1 element (which is sorted by definition).',
        diagram: `[5,3,8,1,2,7]
    ↓ Split in middle
[5,3,8]  [1,2,7]
    ↓
[5,3][8]  [1,2][7]
    ↓
[5][3][8] [1][2][7]
Now all pieces are size 1 ✓`
      },
      {
        title: '🔗 The Merge Phase',
        description: 'Now we merge the small sorted pieces back together, comparing elements and placing them in order.',
        diagram: `[5] vs [3] → [3,5]
[8]        → [8]
[1] vs [2] → [1,2]
[7]        → [7]

Merge [3,5] and [8] → [3,5,8]
Merge [1,2] and [7] → [1,2,7]

Final merge [3,5,8] and [1,2,7] → [1,2,3,5,7,8]`
      },
      {
        title: '⏱️ Complexity & Advantages',
        description: 'Merge Sort is O(n log n) - much faster than Bubble Sort! It always performs the same way, making it predictable and reliable.',
        diagram: `Time: O(n log n) - Always!
Space: O(n) - Needs extra space

Why n log n?
- Dividing takes log n levels
- Each level processes all n elements
- Total: n × log n

10 elements → 33 operations (vs 100 for bubble!)`
      }
    ]
  };

  const codeExplanations = {
    bubble_sort: [
      {
        title: 'Initialize Variables',
        code: `const arr = [5, 3, 8, 1];
const n = arr.length;  // 4

for (let i = 0; i < n; i++) {
  // This outer loop repeats n times
  // Each pass through the array
}`,
        explanation: 'We start by getting the array length and setting up the outer loop. This loop will run n times (once for each element).'
      },
      {
        title: 'Inner Loop - Comparisons',
        code: `for (let i = 0; i < n; i++) {
  for (let j = 0; j < n - i - 1; j++) {
    // Compare each adjacent pair
    if (arr[j] > arr[j + 1]) {
      // Swap if needed
    }
  }
}`,
        explanation: 'The inner loop compares adjacent elements. We go up to n-i-1 because the last i elements are already sorted (they "bubbled" to the end).'
      },
      {
        title: 'The Swap Operation',
        code: `if (arr[j] > arr[j + 1]) {
  // If left element is bigger than right
  // Swap them
  let temp = arr[j];        // Save current
  arr[j] = arr[j + 1];      // Move right to left
  arr[j + 1] = temp;        // Move saved to right
  
  // Now smaller element is on left ✓
}`,
        explanation: 'When we find two elements in wrong order (left > right), we swap them using a temporary variable to hold one value.'
      },
      {
        title: 'Complete Algorithm',
        code: `function bubbleSort(arr) {
  const n = arr.length;
  
  // Outer loop: number of passes
  for (let i = 0; i < n; i++) {
    // Inner loop: compare adjacent pairs
    for (let j = 0; j < n - i - 1; j++) {
      // If left > right, swap
      if (arr[j] > arr[j + 1]) {
        let temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;
      }
    }
  }
  
  return arr;  // Sorted array
}`,
        explanation: 'The complete algorithm. Remember: outer loop for passes, inner loop for comparisons, and swap when needed. Simple but effective!'
      }
    ],
    merge_sort: [
      {
        title: 'The Merge Function',
        code: `function merge(left, right) {
  // left: [3, 5]
  // right: [1, 8]
  const result = [];
  let i = 0, j = 0;
  
  // Compare and merge
  while (i < left.length && j < right.length) {
    if (left[i] <= right[j]) {
      result.push(left[i++]);
    } else {
      result.push(right[j++]);
    }
  }
  
  // Add remaining elements
  result.push(...left.slice(i));
  result.push(...right.slice(j));
  
  return result;  // [1, 3, 5, 8]
}`,
        explanation: 'The merge function takes two sorted arrays and combines them into one sorted array. It compares elements from each array and adds the smaller one first.'
      },
      {
        title: 'The Divide Function',
        code: `function mergeSort(arr) {
  // Base case: single element is sorted
  if (arr.length <= 1) {
    return arr;
  }
  
  // Find middle point
  const mid = Math.floor(arr.length / 2);
  
  // Divide into left and right
  const left = arr.slice(0, mid);    // First half
  const right = arr.slice(mid);      // Second half
  
  // Recursively sort and merge
  return merge(
    mergeSort(left),   // Sort left half
    mergeSort(right)   // Sort right half
  );
}`,
        explanation: 'The main mergeSort function divides the array in half and recursively sorts each half. The base case is when we have 1 or 0 elements (already sorted).'
      },
      {
        title: 'How Recursion Works',
        code: `mergeSort([5, 3, 8, 1])
  ├─ mergeSort([5, 3])
  │  ├─ mergeSort([5])     → [5]
  │  ├─ mergeSort([3])     → [3]
  │  └─ merge([5], [3])    → [3, 5]
  ├─ mergeSort([8, 1])
  │  ├─ mergeSort([8])     → [8]
  │  ├─ mergeSort([1])     → [1]
  │  └─ merge([8], [1])    → [1, 8]
  └─ merge([3,5], [1,8])   → [1, 3, 5, 8]`,
        explanation: 'Each recursive call divides the problem smaller. When we reach arrays of size 1, they\'re sorted. Then we merge back up the tree.'
      }
    ]
  };

  const currentTutorial = tutorials[algorithmId] || [];
  const currentCodeExplain = codeExplanations[algorithmId] || [];

  if (!currentTutorial.length) {
    return (
      <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-12 text-center shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
        <GraduationCap className="w-16 h-16 text-gray-500 mx-auto mb-4 opacity-50" />
        <h3 className="text-xl font-bold text-gray-300">Tutorial not available for this algorithm</h3>
        <p className="text-gray-500 mt-2">Please select another algorithm to view its tutorial.</p>
      </div>
    );
  }

  return (
    <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.3)] p-8 max-w-4xl mx-auto">
      <AnimatePresence mode="wait">
        {!showCodeView ? (
          // Tutorial View
          <motion.div
            key="tutorial"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
          >
            <div className="mb-8">
              <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400 mb-4 flex items-center gap-3">
                <GraduationCap className="w-8 h-8 text-blue-400" />
                {currentTutorial[tutorialStep]?.title}
              </h2>
              <div className="flex items-center gap-4 text-sm text-gray-400 font-medium tracking-wide">
                <span>STEP {tutorialStep + 1} OF {currentTutorial.length}</span>
                <div className="flex-1 bg-[#0a0b10] rounded-full h-2 shadow-inner">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${((tutorialStep + 1) / currentTutorial.length) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border border-blue-500/20 p-8 rounded-2xl mb-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-[0.03]">
                <GraduationCap className="w-40 h-40" />
              </div>
              <p className="text-gray-200 text-lg leading-relaxed mb-8 relative z-10">
                {currentTutorial[tutorialStep]?.description}
              </p>

              <div className="bg-[#0a0b10] p-6 rounded-xl border border-white/5 font-mono text-sm text-blue-200 shadow-inner relative z-10">
                <pre className="whitespace-pre-wrap">{currentTutorial[tutorialStep]?.diagram}</pre>
              </div>
            </div>

            {/* Question */}
            {tutorialStep < currentTutorial.length - 1 && !showSimpleExplanation && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className="bg-amber-500/10 border border-amber-500/30 p-6 mb-8 rounded-2xl"
              >
                <p className="font-bold text-amber-400 mb-4 flex items-center gap-2">
                  <HelpCircle className="w-5 h-5" />
                  Did you understand this step? {userUnderstanding === tutorialStep && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
                </p>
                <div className="flex gap-4">
                  <button
                    onClick={() => setUserUnderstanding(tutorialStep)}
                    className="flex-1 px-6 py-3 bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 rounded-xl hover:bg-emerald-500/30 font-bold transition-all"
                  >
                    ✓ Yes, I understand
                  </button>
                  <button
                    onClick={() => setShowSimpleExplanation(true)}
                    className="flex-1 px-6 py-3 bg-amber-500/20 text-amber-300 border border-amber-500/50 rounded-xl hover:bg-amber-500/30 font-bold transition-all"
                  >
                    🤔 Explain simply
                  </button>
                </div>
              </motion.div>
            )}

            {/* Simple Explanation Box */}
            {showSimpleExplanation && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/30 p-6 mb-8 rounded-2xl"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-purple-300 flex items-center gap-2">
                    {getSimpleExplanation(algorithmId, 'concept', tutorialStep).title}
                  </h3>
                  <button
                    onClick={() => setShowSimpleExplanation(false)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    ✕
                  </button>
                </div>

                <p className="text-gray-300 text-lg leading-relaxed mb-6 bg-[#0a0b10]/50 p-6 rounded-xl border-l-4 border-purple-400">
                  {getSimpleExplanation(algorithmId, 'concept', tutorialStep).simple}
                </p>

                <div className="flex gap-4">
                  <button
                    onClick={() => {
                      setShowSimpleExplanation(false);
                      setUserUnderstanding(tutorialStep);
                    }}
                    className="flex-[2] px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-bold transition-colors shadow-[0_0_15px_rgba(147,51,234,0.3)]"
                  >
                    ✓ Got it! Now I understand
                  </button>
                  <button
                    onClick={() => setShowSimpleExplanation(false)}
                    className="flex-1 px-6 py-3 bg-white/5 border border-white/10 text-white hover:bg-white/10 rounded-xl font-bold transition-colors"
                  >
                    Close
                  </button>
                </div>
              </motion.div>
            )}

            {/* Navigation Buttons */}
            <div className="flex gap-4 pt-4 border-t border-white/10">
              {tutorialStep > 0 && (
                <button
                  onClick={() => setTutorialStep(tutorialStep - 1)}
                  className="px-6 py-3 bg-white/5 border border-white/10 text-white rounded-xl hover:bg-white/10 font-bold flex items-center gap-2 transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" /> Previous
                </button>
              )}

              {tutorialStep < currentTutorial.length - 1 ? (
                <button
                  onClick={() => setTutorialStep(tutorialStep + 1)}
                  disabled={userUnderstanding !== tutorialStep}
                  className={`flex-1 px-6 py-3 rounded-xl font-bold flex flex-row-reverse items-center justify-center gap-2 transition-all ${
                    userUnderstanding === tutorialStep
                      ? 'bg-blue-600 text-white hover:bg-blue-500 hover:shadow-[0_0_20px_rgba(59,130,246,0.4)] cursor-pointer'
                      : 'bg-white/5 text-gray-500 border border-white/5 cursor-not-allowed'
                  }`}
                >
                  <ChevronRight className="w-5 h-5" /> Next Step
                </button>
              ) : (
                <button
                  onClick={() => {
                    setShowCodeView(true);
                    setCodeStep(0);
                  }}
                  className="flex-1 px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-500 font-bold flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(168,85,247,0.4)]"
                >
                  <FileCode2 className="w-5 h-5" /> Move to Code Explanation
                </button>
              )}
            </div>
          </motion.div>
        ) : (
          // Code View
          <motion.div
            key="codeview"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <div className="mb-8">
              <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-green-400 mb-4 flex items-center gap-3">
                <FileCode2 className="w-8 h-8 text-emerald-400" />
                {currentCodeExplain[codeStep]?.title}
              </h2>
              <div className="flex items-center gap-4 text-sm text-gray-400 font-medium tracking-wide">
                <span>CODE {codeStep + 1} OF {currentCodeExplain.length}</span>
                <div className="flex-1 bg-[#0a0b10] rounded-full h-2 shadow-inner">
                  <div
                    className="bg-gradient-to-r from-emerald-500 to-green-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${((codeStep + 1) / currentCodeExplain.length) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Code Block */}
            <div className="bg-[#0a0b10] p-6 rounded-2xl mb-8 overflow-x-auto border border-white/5 shadow-inner">
              <pre className="text-emerald-300 font-mono text-sm leading-relaxed whitespace-pre-wrap">
                {currentCodeExplain[codeStep]?.code}
              </pre>
            </div>

            {/* Code Explanation */}
            <div className="bg-gradient-to-br from-emerald-500/10 to-green-500/10 border border-emerald-500/20 p-8 rounded-2xl mb-8 relative">
              <h3 className="font-bold text-lg text-emerald-300 mb-3 flex items-center gap-2">
                <HelpCircle className="w-5 h-5" /> What's happening here?
              </h3>
              <p className="text-gray-300 text-lg leading-relaxed relative z-10">
                {currentCodeExplain[codeStep]?.explanation}
              </p>
            </div>

            {/* Question */}
            {codeStep < currentCodeExplain.length - 1 && !showSimpleExplanation && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className="bg-amber-500/10 border border-amber-500/30 p-6 mb-8 rounded-2xl"
              >
                <p className="font-bold text-amber-400 mb-4 flex items-center gap-2">
                  <HelpCircle className="w-5 h-5" />
                  Do you understand this code section? {userUnderstanding === `code-${codeStep}` && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
                </p>
                <div className="flex gap-4">
                  <button
                    onClick={() => setUserUnderstanding(`code-${codeStep}`)}
                    className="flex-1 px-6 py-3 bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 rounded-xl hover:bg-emerald-500/30 font-bold transition-all"
                  >
                    ✓ Yes, clear
                  </button>
                  <button
                    onClick={() => setShowSimpleExplanation(true)}
                    className="flex-1 px-6 py-3 bg-amber-500/20 text-amber-300 border border-amber-500/50 rounded-xl hover:bg-amber-500/30 font-bold transition-all"
                  >
                    🤔 Explain simply
                  </button>
                </div>
              </motion.div>
            )}

            {/* Simple Code Explanation Box */}
            {showSimpleExplanation && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/30 p-6 mb-8 rounded-2xl"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-emerald-300 flex items-center gap-2">
                    <CheckCircle2 className="w-6 h-6" />
                    Let Me Explain Simply
                  </h3>
                  <button
                    onClick={() => setShowSimpleExplanation(false)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    ✕
                  </button>
                </div>

                <p className="text-gray-300 text-lg leading-relaxed mb-6 bg-[#0a0b10]/50 p-6 rounded-xl border-l-4 border-emerald-500">
                  {getSimpleExplanation(algorithmId, 'code', codeStep).simple}
                </p>

                <div className="flex gap-4">
                  <button
                    onClick={() => {
                      setShowSimpleExplanation(false);
                      setUserUnderstanding(`code-${codeStep}`);
                    }}
                    className="flex-[2] px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold transition-colors shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                  >
                    ✓ Now I get it!
                  </button>
                  <button
                    onClick={() => setShowSimpleExplanation(false)}
                    className="flex-1 px-6 py-3 bg-white/5 border border-white/10 text-white hover:bg-white/10 rounded-xl font-bold transition-colors"
                  >
                    Close
                  </button>
                </div>
              </motion.div>
            )}

            {/* Navigation */}
            <div className="flex gap-4 pt-4 border-t border-white/10">
              <button
                onClick={() => setShowCodeView(false)}
                className="px-6 py-3 bg-white/5 border border-white/10 text-white rounded-xl hover:bg-white/10 font-bold flex items-center gap-2 transition-colors"
              >
                <GraduationCap className="w-5 h-5" /> Back to Tutorial
              </button>

              {codeStep > 0 && (
                <button
                  onClick={() => setCodeStep(codeStep - 1)}
                  className="px-6 py-3 bg-white/5 border border-white/10 text-white rounded-xl hover:bg-white/10 font-bold flex items-center gap-2 transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" /> Previous
                </button>
              )}

              {codeStep < currentCodeExplain.length - 1 ? (
                <button
                  onClick={() => setCodeStep(codeStep + 1)}
                  disabled={userUnderstanding !== `code-${codeStep}`}
                  className={`flex-1 px-6 py-3 rounded-xl font-bold flex flex-row-reverse items-center justify-center gap-2 transition-all ${
                    userUnderstanding === `code-${codeStep}`
                      ? 'bg-emerald-600 text-white hover:bg-emerald-500 hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] cursor-pointer'
                      : 'bg-white/5 text-gray-500 border border-white/5 cursor-not-allowed'
                  }`}
                >
                  <ChevronRight className="w-5 h-5" /> Next Part
                </button>
              ) : (
                <button
                  onClick={() => {
                    const event = new CustomEvent('close-tutorial');
                    document.dispatchEvent(event);
                  }}
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-500 font-bold flex flex-row-reverse items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(59,130,246,0.4)]"
                >
                  <Play className="w-5 h-5" /> Complete & Start Visualizer!
                </button>
              )}
            </div>

            {codeStep === currentCodeExplain.length - 1 && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className="mt-8 bg-blue-500/10 border border-blue-500/30 p-6 rounded-2xl text-center"
              >
                <p className="text-blue-300 font-bold text-lg">
                  🎉 You've completed the code walkthrough! You are ready to explore the interactive visualizer.
                </p>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
