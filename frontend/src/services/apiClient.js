import axios from 'axios';

// Normalize Vite environment variable; ensure a full origin and append /api
const rawBase = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const normalizedBase = rawBase.replace(/\/+$/g, ''); // trim trailing slashes
const API_BASE_URL = normalizedBase.endsWith('/api') ? normalizedBase : `${normalizedBase}/api`;

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Lightweight health check
export const checkBackendHealth = async () => {
  try {
    const res = await apiClient.get('/health');
    return res.status === 200;
  } catch (err) {
    return false;
  }
};

// Mock algorithm definitions used when backend is unavailable
const mockAlgorithms = {
  // SORTING (6)
  bubble_sort: {
    name: 'Bubble Sort',
    category: 'sorting',
    description: 'Simple comparison-based sort. Repeatedly steps through list and swaps adjacent elements if in wrong order.',
    time_complexity: 'O(n²)',
    space_complexity: 'O(1)',
    difficulty: 'Easy'
  },
  insertion_sort: {
    name: 'Insertion Sort',
    category: 'sorting',
    description: 'Builds sorted array by inserting elements one at a time into correct position.',
    time_complexity: 'O(n²)',
    space_complexity: 'O(1)',
    difficulty: 'Easy'
  },
  selection_sort: {
    name: 'Selection Sort',
    category: 'sorting',
    description: 'Finds minimum element and places it at correct position repeatedly.',
    time_complexity: 'O(n²)',
    space_complexity: 'O(1)',
    difficulty: 'Easy'
  },
  merge_sort: {
    name: 'Merge Sort',
    category: 'sorting',
    description: 'Divide and conquer algorithm. Divides array in half, sorts, and merges them.',
    time_complexity: 'O(n log n)',
    space_complexity: 'O(n)',
    difficulty: 'Medium'
  },
  quick_sort: {
    name: 'Quick Sort',
    category: 'sorting',
    description: 'Picks pivot element and partitions array around it using divide-and-conquer.',
    time_complexity: 'O(n log n) avg',
    space_complexity: 'O(log n)',
    difficulty: 'Medium'
  },
  heap_sort: {
    name: 'Heap Sort',
    category: 'sorting',
    description: 'Uses binary heap data structure to sort elements. O(n log n) guaranteed.',
    time_complexity: 'O(n log n)',
    space_complexity: 'O(1)',
    difficulty: 'Medium'
  },
  // SEARCHING (4)
  linear_search: {
    name: 'Linear Search',
    category: 'searching',
    description: 'Scans each element sequentially until target is found.',
    time_complexity: 'O(n)',
    space_complexity: 'O(1)',
    difficulty: 'Easy'
  },
  binary_search: {
    name: 'Binary Search',
    category: 'searching',
    description: 'Efficient search on sorted array by eliminating half of remaining elements each iteration.',
    time_complexity: 'O(log n)',
    space_complexity: 'O(1)',
    difficulty: 'Medium'
  },
  ternary_search: {
    name: 'Ternary Search',
    category: 'searching',
    description: 'Divides search space into 3 parts instead of 2, similar to binary search.',
    time_complexity: 'O(log₃ n)',
    space_complexity: 'O(1)',
    difficulty: 'Medium'
  },
  two_pointer_search: {
    name: 'Two Pointer Technique',
    category: 'searching',
    description: 'Uses two pointers to solve problems like finding pairs with given sum.',
    time_complexity: 'O(n)',
    space_complexity: 'O(1)',
    difficulty: 'Medium'
  },
  // GRAPH (6)
  bfs: {
    name: 'Breadth-First Search',
    category: 'graph',
    description: 'Explores graph level by level, visiting all neighbors before deeper nodes.',
    time_complexity: 'O(V+E)',
    space_complexity: 'O(V)',
    difficulty: 'Medium'
  },
  dfs: {
    name: 'Depth-First Search',
    category: 'graph',
    description: 'Explores graph by going deep first, backtracking when no unvisited neighbors.',
    time_complexity: 'O(V+E)',
    space_complexity: 'O(V)',
    difficulty: 'Medium'
  },
  cycle_detection: {
    name: 'Cycle Detection',
    category: 'graph',
    description: 'Detects if a directed graph contains cycles using DFS.',
    time_complexity: 'O(V+E)',
    space_complexity: 'O(V)',
    difficulty: 'Medium'
  }
};

// Helpers to simulate algorithm execution states when backend is down
const simulateBubbleSort = (arr) => {
  const a = arr.slice();
  const states = [];
  let step = 0;
  const n = a.length;
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      // comparison state
      states.push({ step: ++step, action: 'compare', compared_indices: [j, j + 1], array: a.slice(), swapped_indices: [], sorted_indices: [] });
      if (a[j] > a[j + 1]) {
        // swap state
        const tmp = a[j];
        a[j] = a[j + 1];
        a[j + 1] = tmp;
        states.push({ step: ++step, action: 'swap', compared_indices: [j, j + 1], swapped_indices: [j, j + 1], array: a.slice(), sorted_indices: [] });
      }
    }
    // mark last element as sorted
    const sorted = Array(n - i - 1).fill().map((_, idx) => n - 1 - idx).slice(0, i + 1);
    states.push({ step: ++step, action: 'pass_complete', array: a.slice(), compared_indices: [], swapped_indices: [], sorted_indices: sorted });
  }
  // final state
  states.push({ step: ++step, action: 'sorted', array: a.slice(), compared_indices: [], swapped_indices: [], sorted_indices: Array.from({ length: n }, (_, i) => i) });
  return { states };
};

const simulateLinearSearch = (arr, target) => {
  const states = [];
  let step = 0;
  for (let i = 0; i < arr.length; i++) {
    states.push({ step: ++step, action: 'compare', compared_indices: [i], array: arr.slice(), found: false });
    if (arr[i] === target) {
      states.push({ step: ++step, action: 'found', compared_indices: [i], array: arr.slice(), found: true });
      return { states };
    }
  }
  states.push({ step: ++step, action: 'not_found', array: arr.slice(), found: false });
  return { states };
};

const simulateBinarySearch = (arr, target) => {
  const a = arr.slice().sort((x, y) => x - y);
  const states = [];
  let step = 0;
  let l = 0, r = a.length - 1;
  while (l <= r) {
    const mid = Math.floor((l + r) / 2);
    states.push({ step: ++step, action: 'compare', compared_indices: [mid], array: a.slice(), low: l, high: r });
    if (a[mid] === target) {
      states.push({ step: ++step, action: 'found', compared_indices: [mid], array: a.slice(), low: l, high: r });
      return { states };
    } else if (a[mid] < target) {
      l = mid + 1;
    } else {
      r = mid - 1;
    }
  }
  states.push({ step: ++step, action: 'not_found', array: a.slice() });
  return { states };
};

export const algorithmService = {
  getAlgorithms: async () => {
    try {
      const response = await apiClient.get('/algorithms');
      return response.data.algorithms;
    } catch (err) {
      // Network error or backend down - return mock list
      console.warn('API unavailable, using local mock algorithms.', err?.message || err);
      return mockAlgorithms;
    }
  },

  getAlgorithmDetails: async (algorithmId) => {
    try {
      const response = await apiClient.get(`/algorithm-details/${algorithmId}`);
      return response.data;
    } catch (err) {
      console.warn('API unavailable, using local mock algorithm details.', err?.message || err);
      return mockAlgorithms[algorithmId] || { name: algorithmId, description: 'No details available.' };
    }
  },

  runAlgorithm: async (algorithmRequest) => {
    try {
      const response = await apiClient.post('/run-algorithm', algorithmRequest);
      return response.data;
    } catch (err) {
      console.warn('API unavailable, simulating algorithm locally.', err?.message || err);
      // Fallback simulation
      const alg = algorithmRequest.algorithm || '';
      const arr = Array.isArray(algorithmRequest.input_data) ? algorithmRequest.input_data : [];
      const target = algorithmRequest.target;

      if (alg === 'bubble_sort') return simulateBubbleSort(arr);
      if (alg === 'merge_sort') {
        // For now use bubble sort simulation as visual fallback (merge sort simulation would be more complex)
        return simulateBubbleSort(arr);
      }
      if (alg === 'quick_sort') {
        return simulateBubbleSort(arr);
      }
      if (alg === 'linear_search') return simulateLinearSearch(arr, target);
      if (alg === 'binary_search') return simulateBinarySearch(arr, target);

      // Generic fallback: return a single state reflecting the input
      return { states: [{ step: 1, action: 'init', array: arr }] };
    }
  }
};

export default apiClient;
