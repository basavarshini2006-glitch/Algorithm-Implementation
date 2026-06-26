"""
Extended Sorting Algorithms Module
Includes: Bubble, Merge, Quick, Heap, Insertion, Selection Sort
"""

from models.execution_state import ExecutionState
from typing import List

class ExtendedSortingAlgorithms:

    @staticmethod
    def bubble_sort(arr: List[int]):
        """Bubble Sort - O(n²) - Compares adjacent elements"""
        states = []
        arr = arr.copy()
        n = len(arr)
        step = 0

        for i in range(n):
            swapped = False
            for j in range(0, n - i - 1):
                step += 1
                states.append(ExecutionState(
                    step=step,
                    action="compare",
                    array=arr.copy(),
                    compared_indices=[j, j + 1],
                    sorted_indices=list(range(n - i, n)),
                    message=f"Compare arr[{j}]={arr[j]} vs arr[{j+1}]={arr[j+1]}"
                ))

                if arr[j] > arr[j + 1]:
                    arr[j], arr[j + 1] = arr[j + 1], arr[j]
                    swapped = True
                    step += 1
                    states.append(ExecutionState(
                        step=step,
                        action="swap",
                        array=arr.copy(),
                        swapped_indices=[j, j + 1],
                        sorted_indices=list(range(n - i, n)),
                        message=f"Swap: arr[{j}] and arr[{j+1}] swapped"
                    ))

            if not swapped:
                break

        step += 1
        states.append(ExecutionState(
            step=step,
            action="complete",
            array=arr.copy(),
            sorted_indices=list(range(n)),
            message="✓ Array sorted! Bubble sort complete."
        ))

        return states

    @staticmethod
    def insertion_sort(arr: List[int]):
        """Insertion Sort - O(n²) - Builds sorted array one item at a time"""
        states = []
        arr = arr.copy()
        n = len(arr)
        step = 0

        for i in range(1, n):
            key = arr[i]
            j = i - 1

            step += 1
            states.append(ExecutionState(
                step=step,
                action="select",
                array=arr.copy(),
                compared_indices=[i],
                sorted_indices=list(range(0, i)),
                message=f"Selecting element arr[{i}]={key} to insert"
            ))

            while j >= 0 and arr[j] > key:
                step += 1
                states.append(ExecutionState(
                    step=step,
                    action="compare",
                    array=arr.copy(),
                    compared_indices=[j, i],
                    sorted_indices=list(range(0, i)),
                    message=f"Compare arr[{j}]={arr[j]} > {key}, need to shift"
                ))

                arr[j + 1] = arr[j]
                j -= 1

                step += 1
                states.append(ExecutionState(
                    step=step,
                    action="shift",
                    array=arr.copy(),
                    sorted_indices=list(range(0, i + 1)),
                    message=f"Shifted arr[{j + 1}] to the right"
                ))

            arr[j + 1] = key
            step += 1
            states.append(ExecutionState(
                step=step,
                action="insert",
                array=arr.copy(),
                sorted_indices=list(range(0, i + 1)),
                message=f"Inserted {key} at position {j + 1}"
            ))

        step += 1
        states.append(ExecutionState(
            step=step,
            action="complete",
            array=arr.copy(),
            sorted_indices=list(range(n)),
            message="✓ Array sorted! Insertion sort complete."
        ))

        return states

    @staticmethod
    def selection_sort(arr: List[int]):
        """Selection Sort - O(n²) - Selects minimum and places at correct position"""
        states = []
        arr = arr.copy()
        n = len(arr)
        step = 0

        for i in range(n):
            min_idx = i

            step += 1
            states.append(ExecutionState(
                step=step,
                action="search",
                array=arr.copy(),
                compared_indices=[i],
                sorted_indices=list(range(0, i)),
                message=f"Finding minimum from index {i}"
            ))

            for j in range(i + 1, n):
                step += 1
                states.append(ExecutionState(
                    step=step,
                    action="compare",
                    array=arr.copy(),
                    compared_indices=[j, min_idx],
                    sorted_indices=list(range(0, i)),
                    message=f"Compare arr[{j}]={arr[j]} with min arr[{min_idx}]={arr[min_idx]}"
                ))

                if arr[j] < arr[min_idx]:
                    min_idx = j
                    step += 1
                    states.append(ExecutionState(
                        step=step,
                        action="update",
                        array=arr.copy(),
                        compared_indices=[min_idx],
                        sorted_indices=list(range(0, i)),
                        message=f"New minimum found at index {min_idx}"
                    ))

            arr[i], arr[min_idx] = arr[min_idx], arr[i]
            step += 1
            states.append(ExecutionState(
                step=step,
                action="swap",
                array=arr.copy(),
                swapped_indices=[i, min_idx],
                sorted_indices=list(range(0, i + 1)),
                message=f"Swapped arr[{i}] and arr[{min_idx}]"
            ))

        step += 1
        states.append(ExecutionState(
            step=step,
            action="complete",
            array=arr.copy(),
            sorted_indices=list(range(n)),
            message="✓ Array sorted! Selection sort complete."
        ))

        return states

    @staticmethod
    def quick_sort(arr: List[int]):
        """Quick Sort - O(n log n) average - Divide and conquer with pivot"""
        states = []
        arr = arr.copy()
        n = len(arr)
        step = 0

        def partition(low, high):
            nonlocal step
            pivot = arr[high]
            i = low - 1

            step += 1
            states.append(ExecutionState(
                step=step,
                action="select_pivot",
                array=arr.copy(),
                compared_indices=[high],
                message=f"Selected pivot = {pivot} at index {high}"
            ))

            for j in range(low, high):
                step += 1
                states.append(ExecutionState(
                    step=step,
                    action="compare",
                    array=arr.copy(),
                    compared_indices=[j, high],
                    message=f"Compare arr[{j}]={arr[j]} with pivot {pivot}"
                ))

                if arr[j] < pivot:
                    i += 1
                    arr[i], arr[j] = arr[j], arr[i]
                    step += 1
                    states.append(ExecutionState(
                        step=step,
                        action="swap",
                        array=arr.copy(),
                        swapped_indices=[i, j],
                        message=f"Swapped arr[{i}] and arr[{j}]"
                    ))

            arr[i + 1], arr[high] = arr[high], arr[i + 1]
            step += 1
            states.append(ExecutionState(
                step=step,
                action="place_pivot",
                array=arr.copy(),
                compared_indices=[i + 1],
                message=f"Pivot {pivot} placed at index {i + 1}"
            ))

            return i + 1

        def quick_sort_helper(low, high):
            nonlocal step
            if low < high:
                pi = partition(low, high)
                quick_sort_helper(low, pi - 1)
                quick_sort_helper(pi + 1, high)

        quick_sort_helper(0, n - 1)

        step += 1
        states.append(ExecutionState(
            step=step,
            action="complete",
            array=arr.copy(),
            sorted_indices=list(range(n)),
            message="✓ Array sorted! Quick sort complete."
        ))

        return states

    @staticmethod
    def merge_sort(arr: List[int]):
        """Merge Sort - O(n log n) - Divide and conquer, stable sort"""
        states = []
        arr = arr.copy()
        n = len(arr)
        step = 0

        def merge(left, mid, right):
            nonlocal step
            left_arr = arr[left:mid + 1]
            right_arr = arr[mid + 1:right + 1]

            i = j = 0
            k = left

            step += 1
            states.append(ExecutionState(
                step=step,
                action="merge_start",
                array=arr.copy(),
                compared_indices=[mid],
                message=f"Merging arr[{left}..{mid}] and arr[{mid+1}..{right}]"
            ))

            while i < len(left_arr) and j < len(right_arr):
                step += 1
                states.append(ExecutionState(
                    step=step,
                    action="compare",
                    array=arr.copy(),
                    compared_indices=[left + i, mid + 1 + j],
                    message=f"Compare {left_arr[i]} vs {right_arr[j]}"
                ))

                if left_arr[i] <= right_arr[j]:
                    arr[k] = left_arr[i]
                    i += 1
                else:
                    arr[k] = right_arr[j]
                    j += 1
                k += 1

            while i < len(left_arr):
                arr[k] = left_arr[i]
                i += 1
                k += 1

            while j < len(right_arr):
                arr[k] = right_arr[j]
                j += 1
                k += 1

            step += 1
            states.append(ExecutionState(
                step=step,
                action="merge_complete",
                array=arr.copy(),
                message=f"Merge complete"
            ))

        def merge_sort_helper(left, right):
            nonlocal step
            if left < right:
                mid = (left + right) // 2

                step += 1
                states.append(ExecutionState(
                    step=step,
                    action="divide",
                    array=arr.copy(),
                    message=f"Dividing arr[{left}..{right}] into two halves"
                ))

                merge_sort_helper(left, mid)
                merge_sort_helper(mid + 1, right)
                merge(left, mid, right)

        merge_sort_helper(0, n - 1)

        step += 1
        states.append(ExecutionState(
            step=step,
            action="complete",
            array=arr.copy(),
            sorted_indices=list(range(n)),
            message="✓ Array sorted! Merge sort complete."
        ))

        return states

    @staticmethod
    def heap_sort(arr: List[int]):
        """Heap Sort - O(n log n) - Uses binary heap data structure"""
        states = []
        arr = arr.copy()
        n = len(arr)
        step = 0

        def heapify(size, root):
            nonlocal step
            largest = root
            left = 2 * root + 1
            right = 2 * root + 2

            if left < size and arr[left] > arr[largest]:
                largest = left

            if right < size and arr[right] > arr[largest]:
                largest = right

            if largest != root:
                step += 1
                states.append(ExecutionState(
                    step=step,
                    action="swap",
                    array=arr.copy(),
                    swapped_indices=[root, largest],
                    message=f"Swapped arr[{root}] and arr[{largest}] to maintain heap"
                ))
                arr[root], arr[largest] = arr[largest], arr[root]
                heapify(size, largest)

        # Build max heap
        for i in range(n // 2 - 1, -1, -1):
            step += 1
            states.append(ExecutionState(
                step=step,
                action="heapify",
                array=arr.copy(),
                message=f"Building heap at node {i}"
            ))
            heapify(n, i)

        # Extract elements from heap
        for i in range(n - 1, 0, -1):
            arr[0], arr[i] = arr[i], arr[0]
            step += 1
            states.append(ExecutionState(
                step=step,
                action="extract",
                array=arr.copy(),
                sorted_indices=list(range(i, n)),
                message=f"Extracted maximum element to position {i}"
            ))
            heapify(i, 0)

        step += 1
        states.append(ExecutionState(
            step=step,
            action="complete",
            array=arr.copy(),
            sorted_indices=list(range(n)),
            message="✓ Array sorted! Heap sort complete."
        ))

        return states

