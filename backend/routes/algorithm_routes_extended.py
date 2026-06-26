from flask import Blueprint, request, jsonify
from algorithms.extended_sorting import ExtendedSortingAlgorithms
from algorithms.extended_searching import ExtendedSearchingAlgorithms
from algorithms.extended_graph import ExtendedGraphAlgorithms
from models.dsa_quiz import DSAQuizzes, LearningPath

algorithm_bp = Blueprint('algorithms', __name__, url_prefix='/api')

# Comprehensive algorithm info
ALGORITHMS_INFO = {
    # SORTING
    'bubble_sort': {
        'name': 'Bubble Sort',
        'category': 'sorting',
        'time_complexity': 'O(n²)',
        'space_complexity': 'O(1)',
        'stable': True,
        'description': 'Repeatedly steps through the array, compares adjacent elements and swaps them if needed.',
        'difficulty': 'Easy',
        'use_cases': ['Educational', 'Nearly sorted data', 'Small datasets']
    },
    'insertion_sort': {
        'name': 'Insertion Sort',
        'category': 'sorting',
        'time_complexity': 'O(n²)',
        'space_complexity': 'O(1)',
        'stable': True,
        'description': 'Builds sorted array by inserting elements one at a time into correct position.',
        'difficulty': 'Easy',
        'use_cases': ['Nearly sorted data', 'Online sorting', 'Small arrays']
    },
    'selection_sort': {
        'name': 'Selection Sort',
        'category': 'sorting',
        'time_complexity': 'O(n²)',
        'space_complexity': 'O(1)',
        'stable': False,
        'description': 'Finds minimum element and places it at correct position repeatedly.',
        'difficulty': 'Easy',
        'use_cases': ['Educational', 'Minimal writes needed']
    },
    'merge_sort': {
        'name': 'Merge Sort',
        'category': 'sorting',
        'time_complexity': 'O(n log n)',
        'space_complexity': 'O(n)',
        'stable': True,
        'description': 'Divide-and-conquer algorithm that divides array in half, sorts, and merges.',
        'difficulty': 'Medium',
        'use_cases': ['Large datasets', 'Linked lists', 'External sorting']
    },
    'quick_sort': {
        'name': 'Quick Sort',
        'category': 'sorting',
        'time_complexity': 'O(n log n) avg, O(n²) worst',
        'space_complexity': 'O(log n)',
        'stable': False,
        'description': 'Picks a pivot element and partitions array around it using divide-and-conquer.',
        'difficulty': 'Medium',
        'use_cases': ['General purpose sorting', 'Production systems', 'In-place sorting']
    },
    'heap_sort': {
        'name': 'Heap Sort',
        'category': 'sorting',
        'time_complexity': 'O(n log n)',
        'space_complexity': 'O(1)',
        'stable': False,
        'description': 'Uses binary heap data structure to sort elements.',
        'difficulty': 'Medium',
        'use_cases': ['Guaranteed O(n log n)', 'Priority queues', 'Competitive programming']
    },

    # SEARCHING
    'linear_search': {
        'name': 'Linear Search',
        'category': 'searching',
        'time_complexity': 'O(n)',
        'space_complexity': 'O(1)',
        'description': 'Searches array by checking each element sequentially.',
        'difficulty': 'Easy',
        'use_cases': ['Unsorted data', 'Small arrays', 'Simple search']
    },
    'binary_search': {
        'name': 'Binary Search',
        'category': 'searching',
        'time_complexity': 'O(log n)',
        'space_complexity': 'O(1)',
        'description': 'Efficient search on sorted array by eliminating half of remaining elements.',
        'difficulty': 'Medium',
        'use_cases': ['Sorted data', 'Large datasets', 'Interview questions']
    },
    'ternary_search': {
        'name': 'Ternary Search',
        'category': 'searching',
        'time_complexity': 'O(log₃ n)',
        'space_complexity': 'O(1)',
        'description': 'Divides search space into 3 parts instead of 2, similar to binary search.',
        'difficulty': 'Medium',
        'use_cases': ['Sorted data', 'Unimodal functions', 'Competitive programming']
    },
    'two_pointer_search': {
        'name': 'Two Pointer Technique',
        'category': 'searching',
        'time_complexity': 'O(n)',
        'space_complexity': 'O(1)',
        'description': 'Uses two pointers to solve problems like finding pairs with sum.',
        'difficulty': 'Medium',
        'use_cases': ['Pair finding', 'Container with most water', 'Palindrome checking']
    },

    # GRAPH
    'bfs': {
        'name': 'Breadth-First Search',
        'category': 'graph',
        'time_complexity': 'O(V + E)',
        'space_complexity': 'O(V)',
        'description': 'Explores graph level by level, visiting all neighbors before deeper nodes.',
        'difficulty': 'Medium',
        'use_cases': ['Shortest path (unweighted)', 'Level-order traversal', 'Social networks']
    },
    'dfs': {
        'name': 'Depth-First Search',
        'category': 'graph',
        'time_complexity': 'O(V + E)',
        'space_complexity': 'O(V)',
        'description': 'Explores graph by going deep first, backtracking when no unvisited neighbors.',
        'difficulty': 'Medium',
        'use_cases': ['Cycle detection', 'Topological sort', 'Connected components']
    },
    'cycle_detection': {
        'name': 'Cycle Detection (DFS)',
        'category': 'graph',
        'time_complexity': 'O(V + E)',
        'space_complexity': 'O(V)',
        'description': 'Detects if directed graph contains cycles.',
        'difficulty': 'Medium',
        'use_cases': ['Deadlock detection', 'Dependency resolution', 'Topological sorting']
    }
}

@algorithm_bp.route('/algorithms', methods=['GET'])
def get_algorithms():
    """Get list of all algorithms with metadata"""
    return jsonify({
        'algorithms': ALGORITHMS_INFO,
        'total': len(ALGORITHMS_INFO),
        'categories': {
            'sorting': sum(1 for a in ALGORITHMS_INFO.values() if a['category'] == 'sorting'),
            'searching': sum(1 for a in ALGORITHMS_INFO.values() if a['category'] == 'searching'),
            'graph': sum(1 for a in ALGORITHMS_INFO.values() if a['category'] == 'graph')
        }
    }), 200

@algorithm_bp.route('/algorithm-details/<algorithm_id>', methods=['GET'])
def get_algorithm_details(algorithm_id):
    """Get detailed information about specific algorithm"""
    if algorithm_id not in ALGORITHMS_INFO:
        return jsonify({'error': 'Algorithm not found'}), 404

    algo = ALGORITHMS_INFO[algorithm_id]

    # Add quiz info
    quiz = DSAQuizzes.get_quiz_for_algorithm(algorithm_id)
    algo['quiz_questions'] = len(quiz)

    return jsonify(algo), 200

@algorithm_bp.route('/run-algorithm', methods=['POST'])
def run_algorithm():
    """Execute algorithm and return step-by-step states"""
    try:
        data = request.json
        algorithm = data.get('algorithm')
        input_data = data.get('input_data', [])
        target = data.get('target')
        graph_edges = data.get('graph_edges', [])
        graph_nodes = data.get('graph_nodes', [])

        if not algorithm:
            return jsonify({'error': 'Algorithm not specified'}), 400

        states = []

        # ===== SORTING ALGORITHMS =====
        if algorithm == 'bubble_sort':
            states = ExtendedSortingAlgorithms.bubble_sort(input_data)

        elif algorithm == 'insertion_sort':
            states = ExtendedSortingAlgorithms.insertion_sort(input_data)

        elif algorithm == 'selection_sort':
            states = ExtendedSortingAlgorithms.selection_sort(input_data)

        elif algorithm == 'merge_sort':
            states = ExtendedSortingAlgorithms.merge_sort(input_data)

        elif algorithm == 'quick_sort':
            states = ExtendedSortingAlgorithms.quick_sort(input_data)

        elif algorithm == 'heap_sort':
            states = ExtendedSortingAlgorithms.heap_sort(input_data)

        # ===== SEARCHING ALGORITHMS =====
        elif algorithm == 'linear_search':
            if target is None:
                return jsonify({'error': 'Target value required'}), 400
            states = ExtendedSearchingAlgorithms.linear_search(input_data, target)

        elif algorithm == 'binary_search':
            if target is None:
                return jsonify({'error': 'Target value required'}), 400
            states = ExtendedSearchingAlgorithms.binary_search(input_data, target)

        elif algorithm == 'ternary_search':
            if target is None:
                return jsonify({'error': 'Target value required'}), 400
            states = ExtendedSearchingAlgorithms.ternary_search(input_data, target)

        elif algorithm == 'two_pointer_search':
            if target is None:
                return jsonify({'error': 'Target sum required'}), 400
            states = ExtendedSearchingAlgorithms.two_pointer_search(input_data, target)

        # ===== GRAPH ALGORITHMS =====
        elif algorithm == 'bfs':
            if not graph_nodes or not graph_edges:
                return jsonify({'error': 'Graph nodes and edges required'}), 400
            start_node = graph_nodes[0] if graph_nodes else 'A'
            states = ExtendedGraphAlgorithms.bfs(graph_nodes, graph_edges, start_node)

        elif algorithm == 'dfs':
            if not graph_nodes or not graph_edges:
                return jsonify({'error': 'Graph nodes and edges required'}), 400
            start_node = graph_nodes[0] if graph_nodes else 'A'
            states = ExtendedGraphAlgorithms.dfs(graph_nodes, graph_edges, start_node)

        elif algorithm == 'cycle_detection':
            if not graph_nodes or not graph_edges:
                return jsonify({'error': 'Graph nodes and edges required'}), 400
            states = ExtendedGraphAlgorithms.dfs_cycle_detection(graph_nodes, graph_edges)

        else:
            return jsonify({'error': f'Unknown algorithm: {algorithm}'}), 400

        # Convert states to JSON-serializable format
        states_json = []
        for state in states:
            state_dict = state.__dict__.copy()
            states_json.append(state_dict)

        return jsonify({
            'algorithm': algorithm,
            'states': states_json,
            'total_steps': len(states_json)
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ===== QUIZ ENDPOINTS =====

@algorithm_bp.route('/quiz/<algorithm_id>', methods=['GET'])
def get_quiz(algorithm_id):
    """Get quiz questions for algorithm"""
    quiz = DSAQuizzes.get_quiz_for_algorithm(algorithm_id)

    if not quiz:
        return jsonify({'error': 'No quiz available for this algorithm'}), 404

    # Return questions without answers
    questions = []
    for q in quiz:
        questions.append({
            'id': q['id'],
            'question': q['question'],
            'options': q['options']
        })

    return jsonify({
        'algorithm': algorithm_id,
        'questions': questions,
        'total': len(questions)
    }), 200

@algorithm_bp.route('/quiz/submit/<algorithm_id>', methods=['POST'])
def submit_quiz(algorithm_id):
    """Submit quiz answers and get score"""
    try:
        data = request.json
        answers = data.get('answers', [])

        result = DSAQuizzes.calculate_score(answers, algorithm_id)

        return jsonify(result), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@algorithm_bp.route('/learning-path/<level>', methods=['GET'])
def get_learning_path(level):
    """Get structured learning path"""
    path = LearningPath.get_learning_path(level)

    return jsonify({
        'level': level,
        'path': path,
        'total_modules': len(path),
        'total_algorithms': sum(len(m['algorithms']) for m in path)
    }), 200

@algorithm_bp.route('/learning-path/recommend', methods=['POST'])
def recommend_next():
    """Get recommendation for next algorithm"""
    try:
        data = request.json
        completed = data.get('completed_algorithms', [])
        level = data.get('level', 'beginner')

        recommendation = LearningPath.recommend_next(completed, level)

        return jsonify(recommendation), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@algorithm_bp.route('/concepts-quiz', methods=['GET'])
def get_concepts_quiz():
    """Get DSA concepts quiz"""
    quiz = DSAQuizzes.CONCEPT_QUIZ

    questions = []
    for q in quiz:
        questions.append({
            'id': q['id'],
            'question': q['question'],
            'options': q['options']
        })

    return jsonify({
        'quiz_type': 'concepts',
        'questions': questions,
        'total': len(questions)
    }), 200

@algorithm_bp.route('/statistics', methods=['POST'])
def get_statistics():
    """Get user learning statistics"""
    try:
        data = request.json
        completed_quizzes = data.get('completed_quizzes', {})

        total_quizzes = len(completed_quizzes)
        total_correct = sum(v.get('score', 0) for v in completed_quizzes.values())
        total_questions = sum(v.get('total', 0) for v in completed_quizzes.values())

        avg_percentage = (total_correct / total_questions * 100) if total_questions > 0 else 0

        return jsonify({
            'total_algorithms_studied': total_quizzes,
            'total_questions_answered': total_questions,
            'total_correct': total_correct,
            'average_percentage': round(avg_percentage, 2),
            'quiz_details': completed_quizzes
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@algorithm_bp.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'algorithms_available': len(ALGORITHMS_INFO),
        'algorithms': list(ALGORITHMS_INFO.keys())
    }), 200

