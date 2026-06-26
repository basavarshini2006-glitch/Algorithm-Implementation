from flask import Blueprint, request, jsonify
from algorithms.sorting import SortingAlgorithms
from algorithms.searching import SearchingAlgorithms
from algorithms.graph import GraphAlgorithms
from algorithms.extended_sorting import ExtendedSortingAlgorithms
from algorithms.extended_searching import ExtendedSearchingAlgorithms
from algorithms.extended_graph import ExtendedGraphAlgorithms
import traceback

algorithm_bp = Blueprint('algorithms', __name__, url_prefix='/api')

ALGORITHMS_INFO = {
    'bubble_sort': {
        'name': 'Bubble Sort',
        'category': 'sorting',
        'time_complexity': 'O(n²)',
        'space_complexity': 'O(1)',
        'description': 'Repeatedly steps through the array, compares adjacent elements and swaps them if needed.'
    },
    'insertion_sort': {
        'name': 'Insertion Sort',
        'category': 'sorting',
        'time_complexity': 'O(n²)',
        'space_complexity': 'O(1)',
        'description': 'Builds sorted array by inserting elements one at a time into correct position.'
    },
    'selection_sort': {
        'name': 'Selection Sort',
        'category': 'sorting',
        'time_complexity': 'O(n²)',
        'space_complexity': 'O(1)',
        'description': 'Finds minimum element and places it at correct position repeatedly.'
    },
    'merge_sort': {
        'name': 'Merge Sort',
        'category': 'sorting',
        'time_complexity': 'O(n log n)',
        'space_complexity': 'O(n)',
        'description': 'Divide-and-conquer algorithm that divides array in half, sorts, and merges.'
    },
    'quick_sort': {
        'name': 'Quick Sort',
        'category': 'sorting',
        'time_complexity': 'O(n log n) avg, O(n²) worst',
        'space_complexity': 'O(log n)',
        'description': 'Picks a pivot element and partitions array around it.'
    },
    'heap_sort': {
        'name': 'Heap Sort',
        'category': 'sorting',
        'time_complexity': 'O(n log n)',
        'space_complexity': 'O(1)',
        'description': 'Uses binary heap to sort elements.'
    },
    'linear_search': {
        'name': 'Linear Search',
        'category': 'searching',
        'time_complexity': 'O(n)',
        'space_complexity': 'O(1)',
        'description': 'Searches array by checking each element sequentially.'
    },
    'binary_search': {
        'name': 'Binary Search',
        'category': 'searching',
        'time_complexity': 'O(log n)',
        'space_complexity': 'O(1)',
        'description': 'Efficient search on sorted array by eliminating half of remaining elements.'
    },
    'ternary_search': {
        'name': 'Ternary Search',
        'category': 'searching',
        'time_complexity': 'O(log₃ n)',
        'space_complexity': 'O(1)',
        'description': 'Divides search space into three parts.'
    },
    'two_pointer_search': {
        'name': 'Two Pointer Technique',
        'category': 'searching',
        'time_complexity': 'O(n)',
        'space_complexity': 'O(1)',
        'description': 'Uses two pointers to solve problems like finding pairs with given sum.'
    },
    'bfs': {
        'name': 'Breadth-First Search',
        'category': 'graph',
        'time_complexity': 'O(V + E)',
        'space_complexity': 'O(V)',
        'description': 'Explores graph level by level, visiting all neighbors before deeper nodes.'
    },
    'dfs': {
        'name': 'Depth-First Search',
        'category': 'graph',
        'time_complexity': 'O(V + E)',
        'space_complexity': 'O(V)',
        'description': 'Explores graph by going deep first, backtracking when no unvisited neighbors.'
    },
    'cycle_detection': {
        'name': 'Cycle Detection (DFS)',
        'category': 'graph',
        'time_complexity': 'O(V + E)',
        'space_complexity': 'O(V)',
        'description': "Detects cycles in a directed graph using DFS recursion stack."
    }
}

@algorithm_bp.route('/algorithms', methods=['GET'])
def get_algorithms():
    """Get list of all algorithms with metadata"""
    return jsonify({
        'algorithms': ALGORITHMS_INFO
    })

@algorithm_bp.route('/algorithm-details/<algorithm_id>', methods=['GET'])
def get_algorithm_details(algorithm_id):
    """Get detailed information about specific algorithm"""
    if algorithm_id not in ALGORITHMS_INFO:
        return jsonify({'error': 'Algorithm not found'}), 404

    return jsonify(ALGORITHMS_INFO[algorithm_id])

@algorithm_bp.route('/run-algorithm', methods=['POST'])
def run_algorithm():
    """Execute algorithm and return step-by-step states"""
    try:
        data = request.json or {}
        # DEBUG: log incoming payload for troubleshooting
        try:
            print('[run-algorithm] incoming payload:', data)
        except Exception:
            print('[run-algorithm] incoming payload (unprintable)')

        # Extract algorithm and accept multiple aliases for array input
        algorithm = data.get('algorithm')
        input_data = data.get('input_data') or data.get('array') or data.get('arr') or data.get('values') or data.get('input_values')
        # Accept many alias names for target
        target = None
        for tkey in ('target', 'value', 'target_value', 'search_target', 't'):
            if tkey in data:
                target = data.get(tkey)
                break

        if not algorithm:
            return jsonify({'error': 'Algorithm not specified', 'received_keys': list(data.keys())}), 400

        # Only require array input for sorting/searching algorithms
        sorting_and_searching = {'bubble_sort','merge_sort','quick_sort','insertion_sort','selection_sort','heap_sort',
                                 'linear_search','binary_search','ternary_search','two_pointer_search'}
        if algorithm in sorting_and_searching and input_data is None:
            return jsonify({'error': 'Input data not provided', 'hint': 'send JSON with key "input_data" or "array" (array)', 'received': data}), 400

        states = []

        # Helper: sanitize graph inputs
        def _normalize_graph_inputs(nodes_raw, edges_raw, start_raw):
            # Normalize nodes to list of strings
            nodes_list = []
            if isinstance(nodes_raw, list):
                nodes_list = [str(n) for n in nodes_raw]
            elif isinstance(nodes_raw, str):
                nodes_list = [s for s in nodes_raw.split(',') if s]

            # Normalize edges to list of (src, dst, weight?)
            edges_list = []
            if isinstance(edges_raw, dict):
                # adjacency map: {src: [dst1, dst2] or [{dst, weight}, ...]}
                for src, nbrs in edges_raw.items():
                    if isinstance(nbrs, list):
                        for nb in nbrs:
                            if isinstance(nb, (list, tuple)) and len(nb) >= 1:
                                dst = str(nb[0])
                                weight = None
                                if len(nb) >= 2:
                                    try:
                                        weight = float(nb[1])
                                    except Exception:
                                        weight = None
                                edges_list.append((str(src), dst, weight if weight is not None else 1.0))
                            else:
                                edges_list.append((str(src), str(nb), 1.0))
            elif isinstance(edges_raw, list):
                for e in edges_raw:
                    if isinstance(e, (list, tuple)) and len(e) >= 2:
                        src = str(e[0])
                        dst = str(e[1])
                        weight = None
                        if len(e) >= 3:
                            try:
                                weight = float(e[2])
                            except Exception:
                                weight = None
                        # default weight for weighted algos
                        if weight is None:
                            weight = 1.0
                        edges_list.append((src, dst, weight))
                    else:
                        # try parse strings like 'A,B,1' or 'A-B:1'
                        if isinstance(e, str):
                            parts = None
                            if ',' in e:
                                parts = [p.strip() for p in e.split(',') if p.strip()]
                            elif ':' in e:
                                parts = [p.strip() for p in e.split(':') if p.strip()]
                            elif '-' in e:
                                parts = [p.strip() for p in e.split('-') if p.strip()]
                            if parts and len(parts) >= 2:
                                src = parts[0]
                                dst = parts[1]
                                weight = float(parts[2]) if len(parts) >= 3 and parts[2].replace('.', '', 1).isdigit() else 1.0
                                edges_list.append((src, dst, weight))
            # If nodes missing, derive from edges
            if not nodes_list and edges_list:
                node_set = set()
                for s, d, _ in edges_list:
                    node_set.add(s)
                    node_set.add(d)
                nodes_list = list(node_set)

            return nodes_list, edges_list, (str(start_raw) if start_raw is not None else None)

        # Sorting algorithms (core and extended)
        if algorithm == 'bubble_sort':
            states = SortingAlgorithms.bubble_sort(list(input_data))
        elif algorithm == 'merge_sort':
            states = SortingAlgorithms.merge_sort(input_data)
        elif algorithm == 'quick_sort':
            states = SortingAlgorithms.quick_sort(input_data)
        elif algorithm == 'insertion_sort':
            states = ExtendedSortingAlgorithms.insertion_sort(input_data)
        elif algorithm == 'selection_sort':
            states = ExtendedSortingAlgorithms.selection_sort(input_data)
        elif algorithm == 'heap_sort':
            states = ExtendedSortingAlgorithms.heap_sort(input_data)

        # Searching algorithms (core and extended)
        elif algorithm == 'linear_search':
            if target is None:
                return jsonify({'error': 'Target value required for linear search', 'received_keys': list(data.keys())}), 400
            states = ExtendedSearchingAlgorithms.linear_search(list(input_data), target)
        elif algorithm == 'binary_search':
            if target is None:
                return jsonify({'error': 'Target value required for binary search', 'received_keys': list(data.keys())}), 400
            states = ExtendedSearchingAlgorithms.binary_search(list(input_data), target)
        elif algorithm == 'ternary_search':
            if target is None:
                return jsonify({'error': 'Target value required for ternary search', 'received_keys': list(data.keys())}), 400
            states = ExtendedSearchingAlgorithms.ternary_search(input_data, target)
        elif algorithm == 'two_pointer_search':
            if target is None:
                return jsonify({'error': 'Target sum required for two pointer search', 'received_keys': list(data.keys())}), 400
            states = ExtendedSearchingAlgorithms.two_pointer_search(input_data, target)

        # Graph algorithms (core and extended)
        elif algorithm == 'bfs':
            nodes_raw = data.get('nodes') or data.get('graph_nodes') or data.get('node_list')
            edges_raw = data.get('edges') or data.get('graph_edges') or data.get('edge_list')
            start_raw = data.get('start') or data.get('source') or data.get('root')
            # Fallback: if nodes/edges missing but input_data present, derive nodes/edges from input_data (chain)
            if (not nodes_raw or not edges_raw) and input_data is not None:
                try:
                    # derive nodes from input_data elements
                    nodes_raw = [str(x) for x in input_data]
                    # edges as sequential chain
                    edges_raw = [[nodes_raw[i], nodes_raw[i+1], 1] for i in range(len(nodes_raw)-1)]
                    # choose start as first node if not provided
                    if start_raw is None and nodes_raw:
                        start_raw = nodes_raw[0]
                except Exception:
                    pass
            nodes_s, edges_s, start_s = _normalize_graph_inputs(nodes_raw, edges_raw, start_raw)
            if not nodes_s or not edges_s or start_s is None:
                return jsonify({'error': 'Nodes, edges, and start node required', 'hint': 'send nodes:[...], edges:[[src,dst,weight],...], start: "A"', 'received': data}), 400
            states = ExtendedGraphAlgorithms.bfs(nodes_s, edges_s, start_s)
        elif algorithm == 'dfs':
            nodes_raw = data.get('nodes') or data.get('graph_nodes') or data.get('node_list')
            edges_raw = data.get('edges') or data.get('graph_edges') or data.get('edge_list')
            start_raw = data.get('start') or data.get('source') or data.get('root')
            if (not nodes_raw or not edges_raw) and input_data is not None:
                try:
                    nodes_raw = [str(x) for x in input_data]
                    edges_raw = [[nodes_raw[i], nodes_raw[i+1], 1] for i in range(len(nodes_raw)-1)]
                    if start_raw is None and nodes_raw:
                        start_raw = nodes_raw[0]
                except Exception:
                    pass
            nodes_s, edges_s, start_s = _normalize_graph_inputs(nodes_raw, edges_raw, start_raw)
            if not nodes_s or not edges_s or start_s is None:
                return jsonify({'error': 'Nodes, edges, and start node required', 'hint': 'send nodes:[...], edges:[[src,dst,weight],...], start: "A"', 'received': data}), 400
            states = ExtendedGraphAlgorithms.dfs(nodes_s, edges_s, start_s)
        elif algorithm == 'cycle_detection':
            nodes_raw = data.get('nodes') or data.get('graph_nodes')
            edges_raw = data.get('edges') or data.get('graph_edges')
            nodes_s, edges_s, _ = _normalize_graph_inputs(nodes_raw, edges_raw, None)
            if not nodes_s or not edges_s:
                return jsonify({'error': 'Nodes and edges required for cycle detection'}), 400
            states = ExtendedGraphAlgorithms.dfs_cycle_detection(nodes_s, edges_s)

        else:
            return jsonify({'error': 'Unknown algorithm', 'received': data}), 400

        # Return the execution states
        return jsonify({'states': [s.to_dict() if hasattr(s, 'to_dict') else s for s in states]})

    except Exception as e:
        tb = traceback.format_exc()
        return jsonify({'error': str(e), 'traceback': tb, 'received': data}), 500

@algorithm_bp.route('/quiz/<algorithm_id>', methods=['GET'])
def get_quiz(algorithm_id):
    """Get quiz questions for an algorithm"""
    # Mock quiz data
    quizzes = {
        'bubble_sort': [
            {
                'id': 1,
                'question': 'What is the time complexity of Bubble Sort in the worst case?',
                'options': ['O(n)', 'O(n log n)', 'O(n²)', 'O(1)'],
                'correct': 2
            },
            {
                'id': 2,
                'question': 'Is Bubble Sort a stable sorting algorithm?',
                'options': ['Yes', 'No'],
                'correct': 0
            },
            {
                'id': 3,
                'question': 'How does Bubble Sort work?',
                'options': [
                    'Finds minimum element repeatedly',
                    'Repeatedly swaps adjacent elements if they are in wrong order',
                    'Uses a heap data structure',
                    'Divides array into halves'
                ],
                'correct': 1
            }
        ],
        'binary_search': [
            {
                'id': 1,
                'question': 'What is the prerequisite for Binary Search?',
                'options': ['Array must be sorted', 'Array can be unsorted', 'Array must be empty', 'Array must have duplicates'],
                'correct': 0
            },
            {
                'id': 2,
                'question': 'What is the time complexity of Binary Search?',
                'options': ['O(n)', 'O(log n)', 'O(n²)', 'O(1)'],
                'correct': 1
            }
        ]
    }

    quiz_data = quizzes.get(algorithm_id, [])
    return jsonify({'questions': quiz_data})

@algorithm_bp.route('/quiz/submit/<algorithm_id>', methods=['POST'])
def submit_quiz(algorithm_id):
    """Submit quiz answers and get results"""
    data = request.json or {}
    answers = data.get('answers', [])

    # Mock scoring
    correct = 0
    total = len(answers)

    for answer in answers:
        question_id = answer.get('question_id')
        selected = answer.get('selected')
        # In real implementation, check against database
        # For now, assume some are correct
        if selected == 0:  # Mock: first option is correct
            correct += 1

    score = int((correct / total) * 100) if total > 0 else 0

    return jsonify({
        'score': score,
        'correct': correct,
        'total': total,
        'passed': score >= 70
    })
