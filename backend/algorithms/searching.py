from models.execution_state import ExecutionState
from typing import List

class SearchingAlgorithms:

    @staticmethod
    def linear_search(arr: List[int], target: int):
        """Linear Search with step-by-step execution"""
        states = []
        step = 0
        found = False
        found_index = -1

        for i in range(len(arr)):
            step += 1
            states.append(ExecutionState(
                step=step,
                action="check",
                array=arr.copy(),
                compared_indices=[i],
                message=f"Checking index {i}: {arr[i]} vs target {target}"
            ))

            if arr[i] == target:
                found = True
                found_index = i
                step += 1
                states.append(ExecutionState(
                    step=step,
                    action="found",
                    array=arr.copy(),
                    compared_indices=[i],
                    message=f"Found target {target} at index {i}!"
                ))
                break

        if not found:
            step += 1
            states.append(ExecutionState(
                step=step,
                action="not_found",
                array=arr.copy(),
                message=f"Target {target} not found in array"
            ))

        return states

    @staticmethod
    def binary_search(arr: List[int], target: int):
        """Binary Search with step-by-step execution"""
        states = []
        arr_sorted = sorted(arr)
        step = 0
        left, right = 0, len(arr_sorted) - 1
        found = False
        found_index = -1

        while left <= right:
            mid = (left + right) // 2
            step += 1
            states.append(ExecutionState(
                step=step,
                action="compare",
                array=arr_sorted.copy(),
                compared_indices=[mid],
                message=f"Checking middle index {mid}: {arr_sorted[mid]} vs target {target}"
            ))

            if arr_sorted[mid] == target:
                found = True
                found_index = mid
                step += 1
                states.append(ExecutionState(
                    step=step,
                    action="found",
                    array=arr_sorted.copy(),
                    compared_indices=[mid],
                    message=f"Found target {target} at index {mid}!"
                ))
                break
            elif arr_sorted[mid] < target:
                step += 1
                states.append(ExecutionState(
                    step=step,
                    action="eliminate_left",
                    array=arr_sorted.copy(),
                    compared_indices=list(range(left, mid + 1)),
                    message=f"Target is greater, search right half"
                ))
                left = mid + 1
            else:
                step += 1
                states.append(ExecutionState(
                    step=step,
                    action="eliminate_right",
                    array=arr_sorted.copy(),
                    compared_indices=list(range(mid, right + 1)),
                    message=f"Target is smaller, search left half"
                ))
                right = mid - 1

        if not found:
            step += 1
            states.append(ExecutionState(
                step=step,
                action="not_found",
                array=arr_sorted.copy(),
                message=f"Target {target} not found"
            ))

        return states

