#!/home/leoauricom/practice-tools/.venv/bin/python
"""
FastCGI dispatch script for DreamHost shared hosting.
"""

import sys
import os

# Add project to path
sys.path.insert(0, os.path.dirname(__file__))

# Load environment variables
from dotenv import load_dotenv
load_dotenv(os.path.join(os.path.dirname(__file__), '.env'))

# Import Flask app
from app import create_app
application = create_app()

# Run via FastCGI
if __name__ == '__main__':
    from flup.server.fcgi import WSGIServer
    WSGIServer(application).run()
