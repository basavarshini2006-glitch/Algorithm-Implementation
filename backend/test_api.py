from app import create_app
import json

app = create_app()
with app.test_client() as client:
    print('GET /api/algorithms')
    r = client.get('/api/algorithms')
    print('status:', r.status_code)
    try:
        data = r.get_json()
        print('algorithms keys:', list(data.get('algorithms', {}).keys())[:10])
    except Exception as e:
        print('failed to parse JSON:', e)

    print('\nPOST /api/run-algorithm (bubble_sort)')
    r2 = client.post('/api/run-algorithm', json={'algorithm':'bubble_sort','input_data':[5,3,8,1]})
    print('status:', r2.status_code)
    try:
        d2 = r2.get_json()
        print('total_steps:', d2.get('total_steps'))
        states = d2.get('states', [])
        print('first state example:', json.dumps(states[0], indent=2) if states else 'no states')
    except Exception as e:
        print('failed to get bubble_sort response JSON:', e, r2.get_data(as_text=True))
