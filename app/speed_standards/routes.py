"""API routes for speed standards tool."""

from flask import Blueprint, jsonify, request
from app.speed_standards.db import get_all_songs, update_song_progress, add_song

bp = Blueprint('speed_standards', __name__)


@bp.route('/repertoire', methods=['GET'])
def get_repertoire():
    """Get all songs in the repertoire."""
    try:
        songs = get_all_songs()
        return jsonify(songs), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@bp.route('/song/<int:song_id>', methods=['PATCH'])
def update_song(song_id):
    """Update a song's progress."""
    try:
        data = request.json
        achieved = data.get('achieved', 0)
        target = data.get('target', 0)

        success = update_song_progress(song_id, achieved, target)

        if success:
            return jsonify({'success': True, 'id': song_id}), 200
        else:
            return jsonify({'error': 'Song not found'}), 404

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@bp.route('/song', methods=['POST'])
def create_song():
    """Add a new song to the repertoire."""
    try:
        data = request.json
        title = data.get('title')
        achieved = data.get('achieved', 0)
        target = data.get('target', 0)

        if not title:
            return jsonify({'error': 'Title is required'}), 400

        song_id = add_song(title, achieved, target)
        return jsonify({'success': True, 'id': song_id}), 201

    except Exception as e:
        return jsonify({'error': str(e)}), 500
