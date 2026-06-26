"""
Extended Graph Algorithms Module
Includes: BFS, DFS, Cycle Detection
"""

from models.execution_state import ExecutionState
from collections import deque, defaultdict
from typing import List, Dict, Tuple
import heapq

class ExtendedGraphAlgorithms:

    @staticmethod
    def bfs(nodes: List[str], edges: List[Tuple[str, str, int]], start: str):
        """Bread-First Search - Explores level by level"""
        try:
            states = []
            step = 0
            graph = defaultdict(list)

            for src, dst, _ in edges:
                graph[src].append(dst)
                graph[dst].append(src)

            visited = set()
            queue = deque([start])
            visited.add(start)
            traversal_order = []

            step += 1
            states.append(ExecutionState(
                step=step,
                action="start",
                visited_nodes=list(visited),
                current_node=start,
                message=f"Starting BFS from node {start}"
            ))

            while queue:
                node = queue.popleft()
                traversal_order.append(node)

                step += 1
                states.append(ExecutionState(
                    step=step,
                    action="dequeue",
                    visited_nodes=list(visited),
                    current_node=node,
                    message=f"Dequeued node {node}"
                ))

                for neighbor in graph[node]:
                    step += 1
                    states.append(ExecutionState(
                        step=step,
                        action="explore",
                        visited_nodes=list(visited),
                        current_node=node,
                        next_node=neighbor,
                        message=f"Exploring edge {node}→{neighbor}"
                    ))

                    if neighbor not in visited:
                        visited.add(neighbor)
                        queue.append(neighbor)
                        step += 1
                        states.append(ExecutionState(
                            step=step,
                            action="visit",
                            visited_nodes=list(visited),
                            current_node=neighbor,
                            message=f"Visited node {neighbor}, added to queue"
                        ))
                    else:
                        step += 1
                        states.append(ExecutionState(
                            step=step,
                            action="skip",
                            visited_nodes=list(visited),
                            message=f"Node {neighbor} already visited, skipping"
                        ))

            step += 1
            states.append(ExecutionState(
                step=step,
                action="complete",
                visited_nodes=list(visited),
                message=f"✓ BFS complete! Traversal order: {' → '.join(traversal_order)}"
            ))

            return states
        except Exception as e:
            return [ExecutionState(step=0, action='error', message=f'BFS error: {e}')]

    @staticmethod
    def dfs(nodes: List[str], edges: List[Tuple[str, str, int]], start: str):
        """Depth-First Search - Explores deeply before backtracking"""
        try:
            states = []
            step = 0
            graph = defaultdict(list)

            for src, dst, _ in edges:
                graph[src].append(dst)
                graph[dst].append(src)

            visited = set()
            traversal_order = []

            step += 1
            states.append(ExecutionState(
                step=step,
                action="start",
                visited_nodes=list(visited),
                current_node=start,
                message=f"Starting DFS from node {start}"
            ))

            def dfs_helper(node):
                nonlocal step
                visited.add(node)
                traversal_order.append(node)

                step += 1
                states.append(ExecutionState(
                    step=step,
                    action="visit",
                    visited_nodes=list(visited),
                    current_node=node,
                    message=f"Visited node {node} (depth first)"
                ))

                for neighbor in graph[node]:
                    step += 1
                    states.append(ExecutionState(
                        step=step,
                        action="explore",
                        visited_nodes=list(visited),
                        current_node=node,
                        next_node=neighbor,
                        message=f"Exploring edge {node}→{neighbor}"
                    ))

                    if neighbor not in visited:
                        step += 1
                        states.append(ExecutionState(
                            step=step,
                            action="recurse",
                            visited_nodes=list(visited),
                            message=f"Recursively visiting {neighbor}"
                        ))
                        dfs_helper(neighbor)
                    else:
                        step += 1
                        states.append(ExecutionState(
                            step=step,
                            action="skip",
                            visited_nodes=list(visited),
                            message=f"Node {neighbor} already visited"
                        ))

            dfs_helper(start)

            step += 1
            states.append(ExecutionState(
                step=step,
                action="complete",
                visited_nodes=list(visited),
                message=f"✓ DFS complete! Traversal order: {' → '.join(traversal_order)}"
            ))

            return states
        except Exception as e:
            return [ExecutionState(step=0, action='error', message=f'DFS error: {e}')]

    @staticmethod
    def dfs_cycle_detection(nodes: List[str], edges: List[Tuple[str, str, int]]):
        """DFS for Cycle Detection - Detects if graph has cycles"""
        try:
            states = []
            step = 0
            graph = defaultdict(list)

            for src, dst, _ in edges:
                graph[src].append(dst)

            visited = set()
            rec_stack = set()
            has_cycle = False
            cycle_nodes = []

            step += 1
            states.append(ExecutionState(
                step=step,
                action="start",
                visited_nodes=[],
                message="Starting cycle detection using DFS"
            ))

            def has_cycle_helper(node, path):
                nonlocal step, has_cycle, cycle_nodes

                visited.add(node)
                rec_stack.add(node)
                path.append(node)

                step += 1
                states.append(ExecutionState(
                    step=step,
                    action="visit",
                    visited_nodes=list(visited),
                    current_node=node,
                    message=f"Visiting node {node}"
                ))

                for neighbor in graph[node]:
                    if neighbor not in visited:
                        step += 1
                        states.append(ExecutionState(
                            step=step,
                            action="explore",
                            visited_nodes=list(visited),
                            current_node=node,
                            next_node=neighbor,
                            message=f"Exploring unvisited neighbor {neighbor}"
                        ))

                        if has_cycle_helper(neighbor, path.copy()):
                            return True

                    elif neighbor in rec_stack:
                        has_cycle = True
                        cycle_nodes = path + [neighbor]

                        step += 1
                        states.append(ExecutionState(
                            step=step,
                            action="cycle_found",
                            visited_nodes=list(visited),
                            message=f"✓ CYCLE DETECTED! Path: {' → '.join(cycle_nodes)}"
                        ))
                        return True

                rec_stack.remove(node)
                return False

            for node in nodes:
                if node not in visited:
                    has_cycle_helper(node, [])

            message = f"✓ Cycle Detection complete! Has cycle: {has_cycle}"
            if cycle_nodes:
                message += f" Cycle: {' → '.join(cycle_nodes)}"

            step += 1
            states.append(ExecutionState(
                step=step,
                action="complete",
                visited_nodes=list(visited),
                message=message
            ))

            return states
        except Exception as e:
            return [ExecutionState(step=0, action='error', message=f'Cycle Detection error: {e}')]
