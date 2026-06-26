// Parse array input from user
export const parseArrayInput = (input) => {
  return input
    .trim()
    .split(/[\s,]+/)
    .map(Number)
    .filter((num) => !isNaN(num));
};

// Enhanced color mapping with animation states
export const getBarColor = (index, state) => {
  if (state?.sorted_indices?.includes(index)) {
    return '#10b981'; // Green - sorted
  }
  if (state?.swapped_indices?.includes(index)) {
    return '#f59e0b'; // Amber - swapped
  }
  if (state?.compared_indices?.includes(index)) {
    return '#ef4444'; // Red - compared
  }
  return '#3b82f6'; // Blue - default
};

// Normalize array values for canvas rendering
export const normalizeArray = (arr, maxValue = 100) => {
  if (arr.length === 0) return [];
  const max = Math.max(...arr);
  return arr.map((val) => (val / max) * maxValue);
};

// Get detailed explanation text based on action
export const getActionExplanation = (state) => {
  if (!state) return 'Ready to start';

  const explanations = {
    compare: `Comparing elements at positions ${state.compared_indices?.[0]} and ${state.compared_indices?.[1]}. These values are being examined to determine their order.`,

    swap: `Swapping elements because they are in the wrong order. The larger element moves right, smaller moves left. This brings elements closer to their sorted positions.`,

    pivot_place: `Pivot element has been placed in its correct sorted position. All elements to the left are smaller, all to the right are larger.`,

    merge: `Merging two sorted sections together. Elements are combined in sorted order while maintaining their sorted property.`,

    visit: `Visiting node in graph traversal. This node is being processed and marked as visited to avoid revisiting it.`,

    enqueue: `Adding node to the queue for later processing. This ensures breadth-first exploration of all neighbors.`,

    explore: `Exploring connection from current node. Following edges to discover new nodes in the graph.`,

    check: `Checking current element against the search target. Linear search examines each element sequentially.`,

    found: `Target element found! The search has successfully located the desired value.`,

    not_found: `Search complete - target element was not found in the collection.`,

    eliminate_left: `Target is larger than midpoint. Eliminating left half and searching in the right half. Binary search uses this divide-and-conquer approach.`,

    eliminate_right: `Target is smaller than midpoint. Eliminating right half and searching in the left half. This halves the search space each iteration.`,

    check_distance: `Calculating distance to neighboring node. Checking if a shorter path has been found using current node as intermediate point.`,

    update_distance: `Found a shorter path! Updating the distance record and adding to exploration queue. This builds the shortest path tree.`,

    initialize: `Setting up algorithm state. All distances initialized to infinity except source node (distance 0). Ready to begin exploration.`,

    complete: `Algorithm execution complete! All processing finished. Review the final state and complexity metrics above.`,

    default: state.message || 'Processing...'
  };

  return explanations[state.action] || explanations.default;
};

// Get animation class based on state
export const getAnimationClass = (state) => {
  if (!state) return '';

  const animations = {
    compare: 'animate-pulse',
    swap: 'animate-bounce',
    visit: 'animate-pulse',
    found: 'animate-ping',
    update_distance: 'animate-bounce',
    complete: 'animate-pulse',
  };

  return animations[state.action] || '';
};

// Detailed complexity information
export const getComplexityInfo = (algorithmId) => {
  const complexityData = {
    bubble_sort: {
      name: 'Bubble Sort',
      timeAvg: 'O(n²)',
      timeWorst: 'O(n²)',
      timeBest: 'O(n)',
      space: 'O(1)',
      description: 'Simple sorting by repeatedly comparing adjacent elements. Stable and in-place but inefficient for large datasets.',
      pros: 'Simple implementation, stable, in-place',
      cons: 'Very slow for large datasets, quadratic time complexity',
      use: 'Educational purposes, nearly sorted data'
    },
    merge_sort: {
      name: 'Merge Sort',
      timeAvg: 'O(n log n)',
      timeWorst: 'O(n log n)',
      timeBest: 'O(n log n)',
      space: 'O(n)',
      description: 'Divide-and-conquer algorithm that recursively splits array and merges sorted halves.',
      pros: 'Consistent performance, stable, great for large datasets',
      cons: 'Requires extra space for merging',
      use: 'Production systems, large datasets'
    },
    quick_sort: {
      name: 'Quick Sort',
      timeAvg: 'O(n log n)',
      timeWorst: 'O(n²)',
      timeBest: 'O(n log n)',
      space: 'O(log n)',
      description: 'Divide-and-conquer using pivot partitioning. Efficient in-place sorting.',
      pros: 'Fast average case, in-place, cache-friendly',
      cons: 'Poor worst-case, unstable',
      use: 'Default in many libraries, practical sorting'
    },
    linear_search: {
      name: 'Linear Search',
      timeAvg: 'O(n)',
      timeWorst: 'O(n)',
      timeBest: 'O(1)',
      space: 'O(1)',
      description: 'Simple sequential search through array elements.',
      pros: 'Works on unsorted data, no preprocessing',
      cons: 'Slow for large datasets',
      use: 'Small datasets, unsorted data'
    },
    binary_search: {
      name: 'Binary Search',
      timeAvg: 'O(log n)',
      timeWorst: 'O(log n)',
      timeBest: 'O(1)',
      space: 'O(1)',
      description: 'Efficient search on sorted arrays using divide-and-conquer.',
      pros: 'Very fast logarithmic complexity',
      cons: 'Requires sorted input',
      use: 'Sorted data, large datasets'
    },
    bfs: {
      name: 'Breadth-First Search',
      timeAvg: 'O(V + E)',
      timeWorst: 'O(V + E)',
      timeBest: 'O(V + E)',
      space: 'O(V)',
      description: 'Explores graph level by level using a queue. Visits all neighbors before going deeper.',
      pros: 'Finds shortest path in unweighted graphs',
      cons: 'More memory than DFS',
      use: 'Shortest path, social networks'
    },
    dfs: {
      name: 'Depth-First Search',
      timeAvg: 'O(V + E)',
      timeWorst: 'O(V + E)',
      timeBest: 'O(V + E)',
      space: 'O(V)',
      description: 'Explores graph deeply before backtracking. Uses stack or recursion.',
      pros: 'Less memory, detects cycles',
      cons: 'May not find shortest path',
      use: 'Topological sort, cycle detection'
    }
  };

  return complexityData[algorithmId] || null;
};

// Get animation timing based on action type
export const getAnimationDuration = (action) => {
  const durations = {
    compare: 200,
    swap: 300,
    visit: 250,
    found: 500,
    complete: 1000,
  };
  return durations[action] || 300;
};
