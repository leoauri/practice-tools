"""
Passenger WSGI entry point for DreamHost shared hosting.
This file is automatically detected by Passenger.
"""

import sys
import os

# Point to uv-managed virtual environment
# Adjust the path based on your server setup
INTERP = os.path.join(os.path.dirname(__file__), '.venv', 'bin', 'python3')
if sys.executable != INTERP and os.path.exists(INTERP):
    os.execl(INTERP, INTERP, *sys.argv)

sys.path.insert(0, os.path.dirname(__file__))

# Load environment variables
from dotenv import load_dotenv
load_dotenv(os.path.join(os.path.dirname(__file__), '.env'))

# Import Flask app
from app import create_app

application = create_app()
