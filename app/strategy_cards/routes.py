"""API routes for strategy cards tool."""

from flask import Blueprint, jsonify, request
from app.strategy_cards.db import get_random_card, add_card

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


@bp.route('/card', methods=['POST'])
def create_card():
    """Add a new strategy card."""
    try:
        data = request.json
        content = data.get('content')

        if not content or not content.strip():
            return jsonify({'error': 'Content is required'}), 400

        card_id = add_card(content.strip())
        return jsonify({'success': True, 'id': card_id}), 201

    except Exception as e:
        return jsonify({'error': str(e)}), 500
