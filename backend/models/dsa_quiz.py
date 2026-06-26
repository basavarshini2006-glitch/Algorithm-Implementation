"""
DSA Testing & Scoring Module
Comprehensive quiz system to test user understanding of algorithms
"""

class DSAQuizzes:
    """Comprehensive quiz questions for all DSA concepts"""

    BUBBLE_SORT_QUIZ = [
        {
            "id": "bs_1",
            "question": "What is the time complexity of Bubble Sort in the worst case?",
            "options": ["O(n)", "O(n log n)", "O(n²)", "O(log n)"],
            "correct": 2,
            "explanation": "Bubble Sort compares each pair and may need n passes, each with n-1 comparisons = O(n²)"
        },
        {
            "id": "bs_2",
            "question": "When is Bubble Sort most efficient?",
            "options": ["Random data", "Sorted data", "Reverse sorted", "Worst case"],
            "correct": 1,
            "explanation": "When data is already sorted, Bubble Sort only needs 1 pass = O(n) with early termination"
        },
        {
            "id": "bs_3",
            "question": "Is Bubble Sort stable?",
            "options": ["No", "Yes", "Sometimes", "Only for large arrays"],
            "correct": 1,
            "explanation": "Bubble Sort is stable because it only swaps adjacent elements, preserving relative order"
        },
        {
            "id": "bs_4",
            "question": "After the first pass of Bubble Sort on [5,3,8,1], where is the largest element?",
            "options": ["Position 0", "Position 1", "Position 2", "Position 3"],
            "correct": 3,
            "explanation": "The largest element (8) bubbles to the end (position n-1) after the first pass"
        }
    ]

    QUICK_SORT_QUIZ = [
        {
            "id": "qs_1",
            "question": "What is the average time complexity of Quick Sort?",
            "options": ["O(n²)", "O(n log n)", "O(n)", "O(log n)"],
            "correct": 1,
            "explanation": "Quick Sort has O(n log n) average case, but O(n²) worst case"
        },
        {
            "id": "qs_2",
            "question": "What does a 'pivot' do in Quick Sort?",
            "options": ["Marks the end", "Divides array into partitions", "Stores max value", "None"],
            "correct": 1,
            "explanation": "The pivot divides the array - smaller elements on left, larger on right"
        },
        {
            "id": "qs_3",
            "question": "Is Quick Sort stable?",
            "options": ["Yes", "No", "Sometimes", "Always"],
            "correct": 1,
            "explanation": "Quick Sort is not stable because partitioning can change relative order of equal elements"
        },
        {
            "id": "qs_4",
            "question": "When does Quick Sort have O(n²) complexity?",
            "options": ["Random data", "Sorted data", "Best case", "Never"],
            "correct": 1,
            "explanation": "When pivot is always smallest/largest, creating unbalanced partitions, reducing efficiency"
        }
    ]

    MERGE_SORT_QUIZ = [
        {
            "id": "ms_1",
            "question": "What is the time complexity of Merge Sort?",
            "options": ["O(n)", "O(n log n)", "O(n²)", "O(log n)"],
            "correct": 1,
            "explanation": "Merge Sort is O(n log n) in ALL cases - best, average, and worst!"
        },
        {
            "id": "ms_2",
            "question": "What is the space complexity of Merge Sort?",
            "options": ["O(1)", "O(log n)", "O(n)", "O(n²)"],
            "correct": 2,
            "explanation": "Merge Sort requires O(n) extra space for temporary arrays during merging"
        },
        {
            "id": "ms_3",
            "question": "Is Merge Sort stable?",
            "options": ["No", "Yes", "Depends on implementation", "Only for small arrays"],
            "correct": 1,
            "explanation": "Merge Sort is stable - equal elements maintain their relative order"
        },
        {
            "id": "ms_4",
            "question": "How many times is the array divided in Merge Sort for n=8 elements?",
            "options": ["2", "3", "4", "8"],
            "correct": 1,
            "explanation": "Array is divided log₂(n) times. For 8 elements: 8→4→2→1 = 3 divisions"
        }
    ]

    BINARY_SEARCH_QUIZ = [
        {
            "id": "bin_1",
            "question": "What is the time complexity of Binary Search?",
            "options": ["O(n)", "O(n log n)", "O(log n)", "O(1)"],
            "correct": 2,
            "explanation": "Binary Search eliminates half the elements each step, resulting in O(log n)"
        },
        {
            "id": "bin_2",
            "question": "What must be true for Binary Search to work?",
            "options": ["Array must be random", "Array must be sorted", "All elements unique", "Must be small"],
            "correct": 1,
            "explanation": "Binary Search REQUIRES a sorted array to work correctly"
        },
        {
            "id": "bin_3",
            "question": "How many comparisons for array of size 1000 in Binary Search worst case?",
            "options": ["10", "100", "500", "1000"],
            "correct": 0,
            "explanation": "log₂(1000) ≈ 10 comparisons maximum (dividing by 2 each time)"
        },
        {
            "id": "bin_4",
            "question": "What happens if target is not in sorted array?",
            "options": ["Infinite loop", "Returns -1 or not found", "Returns 0", "Error"],
            "correct": 1,
            "explanation": "When left > right, target not found. Return -1 or 'not found' indicator"
        }
    ]

    BFS_QUIZ = [
        {
            "id": "bfs_1",
            "question": "What data structure does BFS use?",
            "options": ["Stack", "Queue", "Heap", "Tree"],
            "correct": 1,
            "explanation": "BFS uses a QUEUE (FIFO) to explore nodes level by level"
        },
        {
            "id": "bfs_2",
            "question": "Time complexity of BFS is:",
            "options": ["O(V)", "O(E)", "O(V + E)", "O(V * E)"],
            "correct": 2,
            "explanation": "BFS visits all V vertices and traverses all E edges: O(V + E)"
        },
        {
            "id": "bfs_3",
            "question": "Which problem can BFS solve?",
            "options": ["Shortest path in unweighted graph", "Cycle detection", "All of above"],
            "correct": 2,
            "explanation": "BFS finds shortest path in unweighted graphs and can detect cycles"
        },
        {
            "id": "bfs_4",
            "question": "BFS explores nodes in which order?",
            "options": ["Deepest first", "Level by level", "Random", "Reverse order"],
            "correct": 1,
            "explanation": "BFS explores all nodes at current level before going deeper (breadth first)"
        }
    ]

    DFS_QUIZ = [
        {
            "id": "dfs_1",
            "question": "What data structure does DFS use?",
            "options": ["Queue", "Stack", "Heap", "Array"],
            "correct": 1,
            "explanation": "DFS uses a STACK (LIFO) or recursion to explore deeply before backtracking"
        },
        {
            "id": "dfs_2",
            "question": "Time complexity of DFS is:",
            "options": ["O(V)", "O(E)", "O(V + E)", "O(V²)"],
            "correct": 2,
            "explanation": "DFS visits all V vertices and traverses all E edges: O(V + E)"
        },
        {
            "id": "dfs_3",
            "question": "Which problem is DFS best for?",
            "options": ["Shortest path", "Cycle detection", "Finding connected components", "All above"],
            "correct": 3,
            "explanation": "DFS is great for cycle detection, topological sort, and connected components"
        },
        {
            "id": "dfs_4",
            "question": "DFS explores nodes in which order?",
            "options": ["Level by level", "Deep first then backtrack", "Shortest first", "Randomly"],
            "correct": 1,
            "explanation": "DFS goes as deep as possible along each path before backtracking"
        }
    ]

    CONCEPT_QUIZ = [
        {
            "id": "con_1",
            "question": "What is Big-O notation?",
            "options": ["Maximum operations", "Worst-case complexity", "Best-case scenario", "Average time"],
            "correct": 1,
            "explanation": "Big-O represents worst-case scenario - maximum operations algorithm may perform"
        },
        {
            "id": "con_2",
            "question": "Sort these by speed: O(n²), O(n log n), O(n), O(2ⁿ)",
            "options": ["All same", "O(n) > O(n log n) > O(n²) > O(2ⁿ)", "O(2ⁿ) > O(n²) > O(n log n) > O(n)", "Random"],
            "correct": 1,
            "explanation": "For large n: O(n) < O(n log n) < O(n²) < O(2ⁿ)"
        },
        {
            "id": "con_3",
            "question": "What is space complexity?",
            "options": ["How fast algorithm runs", "How much memory is used", "Number of iterations", "All same"],
            "correct": 1,
            "explanation": "Space complexity measures the amount of memory (space) an algorithm uses"
        },
        {
            "id": "con_4",
            "question": "What is stable sorting?",
            "options": ["Never crashes", "Maintains relative order of equal elements", "Fastest", "Uses least space"],
            "correct": 1,
            "explanation": "Stable sort keeps equal elements in their original relative order"
        }
    ]

    @classmethod
    def get_quiz_for_algorithm(cls, algorithm_id: str):
        """Get quiz questions for specific algorithm"""
        quizzes = {
            'bubble_sort': cls.BUBBLE_SORT_QUIZ,
            'merge_sort': cls.MERGE_SORT_QUIZ,
            'quick_sort': cls.QUICK_SORT_QUIZ,
            'binary_search': cls.BINARY_SEARCH_QUIZ,
            'bfs': cls.BFS_QUIZ,
            'dfs': cls.DFS_QUIZ,
            'concepts': cls.CONCEPT_QUIZ
        }
        return quizzes.get(algorithm_id, [])

    @classmethod
    def calculate_score(cls, answers: list, quiz_type: str):
        """
        Calculate score for quiz
        answers: list of {"question_id": "...", "selected": 0}
        """
        quiz = cls.get_quiz_for_algorithm(quiz_type)

        score = 0
        total = len(quiz)
        results = []

        for answer in answers:
            question_id = answer.get('question_id')
            selected = answer.get('selected')

            # Find question
            question = None
            for q in quiz:
                if q['id'] == question_id:
                    question = q
                    break

            if question:
                is_correct = selected == question['correct']
                if is_correct:
                    score += 1

                results.append({
                    'question_id': question_id,
                    'question': question['question'],
                    'selected_idx': selected,
                    'correct_idx': question['correct'],
                    'is_correct': is_correct,
                    'explanation': question['explanation']
                })

        percentage = (score / total * 100) if total > 0 else 0

        return {
            'score': score,
            'total': total,
            'percentage': percentage,
            'results': results,
            'status': 'excellent' if percentage >= 90 else 'good' if percentage >= 75 else 'pass' if percentage >= 60 else 'needs_improvement'
        }


class LearningPath:
    """Structured learning path through DSA"""

    PATHS = {
        'beginner': [
            {'title': 'Sorting Basics', 'algorithms': ['bubble_sort', 'insertion_sort', 'selection_sort']},
            {'title': 'Efficient Sorting', 'algorithms': ['merge_sort', 'quick_sort']},
            {'title': 'Searching', 'algorithms': ['linear_search', 'binary_search']},
            {'title': 'Graph Basics', 'algorithms': ['bfs', 'dfs']},
        ],
        'intermediate': [
            {'title': 'Advanced Sorting', 'algorithms': ['heap_sort', 'quick_sort']},
            {'title': 'Search Techniques', 'algorithms': ['binary_search', 'ternary_search', 'two_pointer_search']},
            {'title': 'Graph Traversal', 'algorithms': ['bfs', 'dfs']},
            {'title': 'Pattern Recognition', 'algorithms': ['kmp', 'rabin_karp']},
        ],
        'advanced': [
            {'title': 'Dynamic Programming', 'algorithms': ['lcs', 'dp_shortest_path']},
            {'title': 'Network Flows', 'algorithms': ['ford_fulkerson', 'dinic']},
            {'title': 'NP Problems', 'algorithms': ['tsp_approximation', 'knapsack']},
        ]
    }

    @classmethod
    def get_learning_path(cls, level: str):
        """Get structured learning path"""
        return cls.PATHS.get(level, cls.PATHS['beginner'])

    @classmethod
    def recommend_next(cls, completed_algorithms: list, level: str):
        """Recommend next algorithm to learn"""
        path = cls.get_learning_path(level)

        for module in path:
            for algo in module['algorithms']:
                if algo not in completed_algorithms:
                    return {
                        'module': module['title'],
                        'recommended_algorithm': algo,
                        'progress': f"{len(completed_algorithms)}/{sum(len(m['algorithms']) for m in path)}"
                    }

        return {'message': 'Congratulations! You have completed this learning path!'}
