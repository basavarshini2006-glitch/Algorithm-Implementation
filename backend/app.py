from flask import Flask, jsonify
from flask_cors import CORS
from config import config
from routes.algorithm_routes import algorithm_bp

def create_app():
    app = Flask(__name__)
    app.config.from_object(config)

    # Enable CORS for API routes (development-friendly)
    # Use explicit resources so the frontend can reliably reach /api/*
    CORS(app, resources={r"/api/*": {"origins": config.CORS_ORIGINS or "*"}})

    # Register blueprints
    app.register_blueprint(algorithm_bp)

    @app.route('/health', methods=['GET'])
    def health_check():
        return {'status': 'healthy'}, 200

    # Development-friendly health check at /api/health so frontend can probe the same base path
    @app.route('/api/health', methods=['GET'])
    def api_health_check():
        return jsonify({'status': 'api_healthy'})

    @app.errorhandler(404)
    def not_found(e):
        return {'error': 'Endpoint not found'}, 404

    @app.errorhandler(500)
    def server_error(e):
        return {'error': 'Internal server error'}, 500

    return app

if __name__ == '__main__':
    app = create_app()
    print('Starting AlgoVision backend on http://0.0.0.0:5000')
    app.run(debug=True, host='0.0.0.0', port=5000)
