"""Flask application factory."""

from flask import Flask
from flask_cors import CORS


def create_app():
    """Create and configure Flask application."""
    app = Flask(__name__, static_folder='../public', static_url_path='')

    # Enable CORS for development (adjust for production)
    CORS(app)

    # Register blueprints for each tool
    from app.speed_standards import routes as speed_standards_routes
    app.register_blueprint(speed_standards_routes.bp, url_prefix='/api/speed-standards')

    # Serve index.html at root
    @app.route('/')
    def index():
        return app.send_static_file('index.html')

    # Serve speed-standards tool
    @app.route('/speed-standards/')
    def speed_standards():
        return app.send_static_file('speed-standards/index.html')

    # Serve 2d6-scale tool
    @app.route('/2d6-scale/')
    def scale_2d6():
        return app.send_static_file('2d6-scale/index.html')

    return app
