from models.execution_state import ExecutionState
from collections import deque, defaultdict
from typing import List, Dict
import heapq

class GraphAlgorithms:

    @staticmethod
    def bfs(nodes: List[str], edges: List[tuple], start: str):
        """Breadth-First Search with step-by-step execution"""
        states = []
        step = 0
        graph = defaultdict(list)

        for src, dst in edges:
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

            for neighbor in graph[node]:
                step += 1
                states.append(ExecutionState(
                    step=step,
                    action="visit",
                    visited_nodes=list(visited),
                    current_node=node,
                    message=f"Visiting neighbor {neighbor} from {node}"
                ))

                if neighbor not in visited:
                    visited.add(neighbor)
                    queue.append(neighbor)
                    step += 1
                    states.append(ExecutionState(
                        step=step,
                        action="enqueue",
                        visited_nodes=list(visited),
                        message=f"Added {neighbor} to queue"
                    ))

        step += 1
        states.append(ExecutionState(
            step=step,
            action="complete",
            visited_nodes=list(visited),
            path=traversal_order,
            message=f"BFS complete! Traversal order: {' → '.join(traversal_order)}"
        ))

        return states

    @staticmethod
    def dfs(nodes: List[str], edges: List[tuple], start: str):
        """Depth-First Search with step-by-step execution"""
        states = []
        step = 0
        graph = defaultdict(list)

        for src, dst in edges:
            graph[src].append(dst)
            graph[dst].append(src)

        visited = set()
        traversal_order = []

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
                        message=f"Exploring edge {node} → {neighbor}"
                    ))
                    dfs_helper(neighbor)

        dfs_helper(start)

        step += 1
        states.append(ExecutionState(
            step=step,
            action="complete",
            visited_nodes=list(visited),
            path=traversal_order,
            message=f"DFS complete! Traversal order: {' → '.join(traversal_order)}"
        ))

        return states
