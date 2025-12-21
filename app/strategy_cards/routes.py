"""API routes for strategy cards tool."""

from flask import Blueprint, jsonify
from app.strategy_cards.db import get_random_card

bp = Blueprint('strategy_cards', __name__)


@bp.route('/random', methods=['GET'])
def get_random():
    """Get a random strategy card."""
    try:
        card = get_random_card()
        if card:
            return jsonify(card), 200
        else:
            return jsonify({'error': 'No cards available'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500
