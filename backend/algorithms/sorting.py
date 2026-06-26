from models.execution_state import ExecutionState
from typing import List

class SortingAlgorithms:

    @staticmethod
    def bubble_sort(arr: List[int]):
        """Bubble Sort with step-by-step execution"""
        states = []
        arr = arr.copy()
        n = len(arr)
        step = 0

        for i in range(n):
            for j in range(0, n - i - 1):
                step += 1
                states.append(ExecutionState(
                    step=step,
                    action="compare",
                    array=arr.copy(),
                    compared_indices=[j, j + 1],
                    message=f"Comparing arr[{j}]={arr[j]} and arr[{j+1}]={arr[j+1]}"
                ))

                if arr[j] > arr[j + 1]:
                    arr[j], arr[j + 1] = arr[j + 1], arr[j]
                    step += 1
                    states.append(ExecutionState(
                        step=step,
                        action="swap",
                        array=arr.copy(),
                        swapped_indices=[j, j + 1],
                        message=f"Swapped arr[{j}] and arr[{j+1}]"
                    ))

        step += 1
        states.append(ExecutionState(
            step=step,
            action="complete",
            array=arr.copy(),
            sorted_indices=list(range(n)),
            message="Sorting complete!"
        ))

        return states

    @staticmethod
    def merge_sort(arr: List[int]):
        """Merge Sort with step-by-step execution"""
        states = []
        arr = arr.copy()

        def merge_sort_helper(arr_section, left, right, step_counter):
            if left >= right:
                return step_counter

            mid = (left + right) // 2
            step_counter = merge_sort_helper(arr_section, left, mid, step_counter)
            step_counter = merge_sort_helper(arr_section, mid + 1, right, step_counter)

            # Merge process
            left_part = arr_section[left:mid + 1]
            right_part = arr_section[mid + 1:right + 1]
            i = j = 0

            while i < len(left_part) and j < len(right_part):
                step_counter += 1
                states.append(ExecutionState(
                    step=step_counter,
                    action="compare",
                    array=arr_section.copy(),
                    compared_indices=[left + i, mid + 1 + j],
                    message=f"Comparing {left_part[i]} and {right_part[j]}"
                ))

                if left_part[i] <= right_part[j]:
                    arr_section[left + i + j] = left_part[i]
                    i += 1
                else:
                    arr_section[left + i + j] = right_part[j]
                    j += 1

                step_counter += 1
                states.append(ExecutionState(
                    step=step_counter,
                    action="merge",
                    array=arr_section.copy(),
                    message=f"Merged sections"
                ))

            while i < len(left_part):
                arr_section[left + i + j] = left_part[i]
                i += 1

            while j < len(right_part):
                arr_section[left + i + j] = right_part[j]
                j += 1

            return step_counter

        step_counter = merge_sort_helper(arr, 0, len(arr) - 1, 0)
        step_counter += 1
        states.append(ExecutionState(
            step=step_counter,
            action="complete",
            array=arr.copy(),
            sorted_indices=list(range(len(arr))),
            message="Merge Sort complete!"
        ))

        return states

    @staticmethod
    def quick_sort(arr: List[int]):
        """Quick Sort with step-by-step execution"""
        states = []
        arr = arr.copy()

        def quick_sort_helper(arr_section, low, high, step_counter):
            if low < high:
                pivot_index, step_counter = partition(arr_section, low, high, step_counter)
                step_counter = quick_sort_helper(arr_section, low, pivot_index - 1, step_counter)
                step_counter = quick_sort_helper(arr_section, pivot_index + 1, high, step_counter)
            return step_counter

        def partition(arr_section, low, high, step_counter):
            pivot = arr_section[high]
            i = low - 1

            for j in range(low, high):
                step_counter += 1
                states.append(ExecutionState(
                    step=step_counter,
                    action="compare",
                    array=arr_section.copy(),
                    compared_indices=[j, high],
                    message=f"Comparing {arr_section[j]} with pivot {pivot}"
                ))

                if arr_section[j] < pivot:
                    i += 1
                    arr_section[i], arr_section[j] = arr_section[j], arr_section[i]
                    step_counter += 1
                    states.append(ExecutionState(
                        step=step_counter,
                        action="swap",
                        array=arr_section.copy(),
                        swapped_indices=[i, j],
                        message=f"Swapped elements"
                    ))

            arr_section[i + 1], arr_section[high] = arr_section[high], arr_section[i + 1]
            step_counter += 1
            states.append(ExecutionState(
                step=step_counter,
                action="pivot_place",
                array=arr_section.copy(),
                message=f"Pivot placed at position {i + 1}"
            ))

            return i + 1, step_counter

        step_counter = quick_sort_helper(arr, 0, len(arr) - 1, 0)
        step_counter += 1
        states.append(ExecutionState(
            step=step_counter,
            action="complete",
            array=arr.copy(),
            sorted_indices=list(range(len(arr))),
            message="Quick Sort complete!"
        ))

        return states

