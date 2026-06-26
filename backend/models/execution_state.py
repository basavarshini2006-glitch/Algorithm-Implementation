from dataclasses import dataclass, asdict
from typing import List, Dict, Any, Optional

@dataclass
class ExecutionState:
    step: int
    action: str
    array: Optional[List[int]] = None
    elements: Optional[List[int]] = None
    swapped_indices: Optional[List[int]] = None
    compared_indices: Optional[List[int]] = None
    sorted_indices: Optional[List[int]] = None
    message: str = ""
    graph_nodes: Optional[List[Dict]] = None
    graph_edges: Optional[List[Dict]] = None
    visited_nodes: Optional[List[str]] = None
    current_node: Optional[str] = None
    next_node: Optional[str] = None
    path: Optional[List[str]] = None
    distances: Optional[Dict[str, float]] = None

    def to_dict(self):
        raw = asdict(self)
        safe = {}
        for k, v in raw.items():
            if v is None:
                continue
            # Convert sets/tuples to lists
            if isinstance(v, (set, tuple)):
                safe[k] = list(v)
                continue
            # Convert dict keys to strings (json requires string keys)
            if isinstance(v, dict):
                try:
                    # ensure keys are strings and values are primitive
                    safe[k] = {str(kk): (vv if isinstance(vv, (str, int, float, bool, list, dict, type(None))) else str(vv)) for kk, vv in v.items()}
                except Exception:
                    safe[k] = {str(kk): str(vv) for kk, vv in v.items()}
                continue
            # For lists, ensure contained elements are primitives or strings
            if isinstance(v, list):
                new_list = []
                for item in v:
                    if isinstance(item, (str, int, float, bool, list, dict, type(None))):
                        new_list.append(item)
                    else:
                        new_list.append(str(item))
                safe[k] = new_list
                continue
            # Primitive types
            if isinstance(v, (str, int, float, bool)):
                safe[k] = v
                continue
            # Fallback: string representation
            safe[k] = str(v)
        return safe
