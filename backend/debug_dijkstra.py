from algorithms.extended_graph import ExtendedGraphAlgorithms
import json
import traceback

nodes = ['A','B','C']
edges = [('A','B',1), ('B','C',2), ('A','C',4)]
start = 'A'

print('Running ExtendedGraphAlgorithms.dijkstra with:')
print('nodes =', nodes)
print('edges =', edges)
print('start =', start)

try:
    states = ExtendedGraphAlgorithms.dijkstra(nodes, edges, start)
    print('Returned states count:', len(states))
    for i, s in enumerate(states[:10]):
        try:
            d = s.to_dict()
        except Exception:
            d = str(s)
        print(f'[{i}]', json.dumps(d, indent=2, ensure_ascii=False))
    if len(states) > 10:
        print('... (truncated) ...')
except Exception as e:
    print('Exception when running dijkstra:')
    traceback.print_exc()

