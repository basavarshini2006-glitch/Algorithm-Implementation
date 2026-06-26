"""
Extended Searching Algorithms Module
Includes: Linear, Binary, Ternary Search and Two-Pointer Techniques
"""

from models.execution_state import ExecutionState
from typing import List

class ExtendedSearchingAlgorithms:

    @staticmethod
    def linear_search(arr: List[int], target: int):
        """Linear Search - O(n) - Scans each element"""
        states = []
        step = 0

        step += 1
        states.append(ExecutionState(
            step=step,
            action="start",
            array=arr.copy(),
            message=f"Starting linear search for target = {target}"
        ))

        for i in range(len(arr)):
            step += 1
            states.append(ExecutionState(
                step=step,
                action="compare",
                array=arr.copy(),
                compared_indices=[i],
                message=f"Check position {i}: arr[{i}] = {arr[i]}"
            ))

            if arr[i] == target:
                step += 1
                states.append(ExecutionState(
                    step=step,
                    action="found",
                    array=arr.copy(),
                    compared_indices=[i],
                    message=f"✓ Found target {target} at index {i}!"
                ))
                return states

        step += 1
        states.append(ExecutionState(
            step=step,
            action="not_found",
            array=arr.copy(),
            message=f"✗ Target {target} not found in array"
        ))

        return states

    @staticmethod
    def binary_search(arr: List[int], target: int):
        """Binary Search - O(log n) - Requires sorted array, divides search space"""
        states = []
        arr_sorted = sorted(arr)
        step = 0

        step += 1
        states.append(ExecutionState(
            step=step,
            action="start",
            array=arr_sorted.copy(),
            message=f"Starting binary search for target = {target} in sorted array"
        ))

        left, right = 0, len(arr_sorted) - 1
        iterations = 0

        while left <= right:
            mid = (left + right) // 2
            iterations += 1

            step += 1
            states.append(ExecutionState(
                step=step,
                action="compare",
                array=arr_sorted.copy(),
                compared_indices=[left, mid, right],
                message=f"Iteration {iterations}: Check middle position {mid}, arr[{mid}] = {arr_sorted[mid]}"
            ))

            if arr_sorted[mid] == target:
                step += 1
                states.append(ExecutionState(
                    step=step,
                    action="found",
                    array=arr_sorted.copy(),
                    compared_indices=[mid],
                    message=f"✓ Found target {target} at index {mid} after {iterations} iterations!"
                ))
                return states

            elif arr_sorted[mid] < target:
                step += 1
                states.append(ExecutionState(
                    step=step,
                    action="eliminate_left",
                    array=arr_sorted.copy(),
                    compared_indices=[mid, right],
                    message=f"Target > {arr_sorted[mid]}, eliminate left half. Search in [{mid+1}, {right}]"
                ))
                left = mid + 1

            else:
                step += 1
                states.append(ExecutionState(
                    step=step,
                    action="eliminate_right",
                    array=arr_sorted.copy(),
                    compared_indices=[left, mid],
                    message=f"Target < {arr_sorted[mid]}, eliminate right half. Search in [{left}, {mid-1}]"
                ))
                right = mid - 1

        step += 1
        states.append(ExecutionState(
            step=step,
            action="not_found",
            array=arr_sorted.copy(),
            message=f"✗ Target {target} not found after {iterations} iterations"
        ))

        return states

    @staticmethod
    def ternary_search(arr: List[int], target: int):
        """Ternary Search - O(log₃ n) - Divides search space into 3 parts"""
        states = []
        arr_sorted = sorted(arr)
        step = 0

        step += 1
        states.append(ExecutionState(
            step=step,
            action="start",
            array=arr_sorted.copy(),
            message=f"Starting ternary search for target = {target}"
        ))

        left, right = 0, len(arr_sorted) - 1
        iterations = 0

        while left <= right:
            mid1 = left + (right - left) // 3
            mid2 = right - (right - left) // 3
            iterations += 1

            step += 1
            states.append(ExecutionState(
                step=step,
                action="compare",
                array=arr_sorted.copy(),
                compared_indices=[left, mid1, mid2, right],
                message=f"Iteration {iterations}: Divide into 3 parts. mid1={mid1}, mid2={mid2}"
            ))

            if arr_sorted[mid1] == target:
                step += 1
                states.append(ExecutionState(
                    step=step,
                    action="found",
                    array=arr_sorted.copy(),
                    compared_indices=[mid1],
                    message=f"✓ Found target {target} at index {mid1}!"
                ))
                return states

            if arr_sorted[mid2] == target:
                step += 1
                states.append(ExecutionState(
                    step=step,
                    action="found",
                    array=arr_sorted.copy(),
                    compared_indices=[mid2],
                    message=f"✓ Found target {target} at index {mid2}!"
                ))
                return states

            if target < arr_sorted[mid1]:
                step += 1
                states.append(ExecutionState(
                    step=step,
                    action="search_left",
                    array=arr_sorted.copy(),
                    message=f"Target < arr[{mid1}], search in left third"
                ))
                right = mid1 - 1

            elif target > arr_sorted[mid2]:
                step += 1
                states.append(ExecutionState(
                    step=step,
                    action="search_right",
                    array=arr_sorted.copy(),
                    message=f"Target > arr[{mid2}], search in right third"
                ))
                left = mid2 + 1

            else:
                step += 1
                states.append(ExecutionState(
                    step=step,
                    action="search_middle",
                    array=arr_sorted.copy(),
                    message=f"Target in middle third [{mid1}, {mid2}]"
                ))
                left = mid1 + 1
                right = mid2 - 1

        step += 1
        states.append(ExecutionState(
            step=step,
            action="not_found",
            array=arr_sorted.copy(),
            message=f"✗ Target {target} not found after {iterations} iterations"
        ))

        return states

    @staticmethod
    def two_pointer_search(arr: List[int], target_sum: int):
        """Two Pointer Technique - O(n) - Finds pair with given sum"""
        states = []
        arr_sorted = sorted(arr)
        step = 0

        step += 1
        states.append(ExecutionState(
            step=step,
            action="start",
            array=arr_sorted.copy(),
            message=f"Starting two-pointer search for pair with sum = {target_sum}"
        ))

        left, right = 0, len(arr_sorted) - 1

        while left < right:
            current_sum = arr_sorted[left] + arr_sorted[right]

            step += 1
            states.append(ExecutionState(
                step=step,
                action="compare",
                array=arr_sorted.copy(),
                compared_indices=[left, right],
                message=f"left={left} (val={arr_sorted[left]}), right={right} (val={arr_sorted[right]}), sum={current_sum}"
            ))

            if current_sum == target_sum:
                step += 1
                states.append(ExecutionState(
                    step=step,
                    action="found",
                    array=arr_sorted.copy(),
                    compared_indices=[left, right],
                    message=f"✓ Found pair! arr[{left}]={arr_sorted[left]} + arr[{right}]={arr_sorted[right]} = {target_sum}"
                ))
                return states

            elif current_sum < target_sum:
                step += 1
                states.append(ExecutionState(
                    step=step,
                    action="move_left",
                    array=arr_sorted.copy(),
                    compared_indices=[left],
                    message=f"Sum {current_sum} < {target_sum}, move left pointer right"
                ))
                left += 1

            else:
                step += 1
                states.append(ExecutionState(
                    step=step,
                    action="move_right",
                    array=arr_sorted.copy(),
                    compared_indices=[right],
                    message=f"Sum {current_sum} > {target_sum}, move right pointer left"
                ))
                right -= 1

        step += 1
        states.append(ExecutionState(
            step=step,
            action="not_found",
            array=arr_sorted.copy(),
            message=f"✗ No pair found with sum = {target_sum}"
        ))

        return states

