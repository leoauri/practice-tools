# Practice Tools

Collection of music practice utilities built with vanilla JavaScript and Flask.

## Tools

### Speed Standards
Track tempo progression on jazz standards using a weighted selection algorithm to choose practice songs based on your progress.

## Tech Stack

- **Frontend**: Vanilla JavaScript (ES Modules), HTML5, CSS3
- **Backend**: Flask (Python) with Passenger WSGI
- **Database**: MySQL
- **Deployment**: DreamHost shared hosting with Passenger

## Project Structure

```
practice-tools/
├── passenger_wsgi.py      # Passenger entry point
├── pyproject.toml         # Python dependencies (uv)
├── .env                   # Database credentials (gitignored)
├── .env.example           # Template for .env
├── schema.sql             # Database schema
├── app/                   # Flask application
│   ├── __init__.py
│   └── speed_standards/   # Speed Standards tool
│       ├── __init__.py
│       ├── routes.py
│       └── db.py
└── public/                # Static files (web root)
    ├── index.html
    ├── styles.css
    └── speed-standards/   # Speed Standards frontend
        ├── index.html
        └── song-selector.js
```

## Local Development

### Prerequisites

- Python 3.8+
- [uv](https://github.com/astral-sh/uv) package manager
- MySQL

### Setup

1. **Install dependencies:**
   ```bash
   uv sync
   ```

2. **Configure database:**
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials
   ```

3. **Create database and load schema:**
   ```bash
   mysql -u your_user -p your_database < schema.sql
   ```

4. **Run development server:**
   ```bash
   uv run flask --app app run --debug
   ```

5. **Open browser:**
   ```
   http://localhost:5000
   ```

## Deployment to DreamHost

### Prerequisites on Server

- SSH access to DreamHost
- Python 3.8+ installed
- Passenger support (`which passenger` should return a path)
- MySQL database created via DreamHost panel

### Deployment Steps

1. **SSH into your DreamHost server:**
   ```bash
   ssh user@yourdomain.com
   ```

2. **Clone or pull repository:**
   ```bash
   cd ~/
   git clone <your-repo-url> practice-tools
   cd practice-tools
   ```

3. **Install uv (if not already installed):**
   ```bash
   curl -LsSf https://astral.sh/uv/install.sh | sh
   source $HOME/.cargo/env
   ```

4. **Install dependencies with uv:**
   ```bash
   uv sync
   ```

5. **Configure environment:**
   ```bash
   cp .env.example .env
   nano .env
   ```

   Edit with your DreamHost MySQL credentials:
   ```
   DB_HOST=mysql.yourdomain.com
   DB_USER=your_db_user
   DB_PASSWORD=your_db_password
   DB_NAME=your_db_name
   ```

6. **Load database schema:**
   ```bash
   mysql -h mysql.yourdomain.com -u your_db_user -p your_db_name < schema.sql
   ```

7. **Configure Apache:**

   In your DreamHost panel:
   - Go to Domains → Manage Domains
   - Edit your domain
   - Set "Web directory" to: `/home/username/practice-tools/public`
   - Enable Passenger (should be automatic if detected)

   Alternatively, create/edit `.htaccess` in `public/`:
   ```apache
   PassengerEnabled On
   PassengerAppRoot /home/username/practice-tools
   PassengerPython /home/username/practice-tools/.venv/bin/python3
   ```

8. **Restart Passenger:**
   ```bash
   mkdir -p tmp
   touch tmp/restart.txt
   ```

9. **Test deployment:**
   Visit your domain in a browser.

### Updating

```bash
cd ~/practice-tools
git pull
uv sync  # Update dependencies if changed
touch tmp/restart.txt  # Restart Passenger
```

### Troubleshooting

**Check Passenger logs:**
```bash
tail -f ~/logs/yourdomain.com/http/error.log
```

**Common issues:**

- **500 Error**: Check `passenger_wsgi.py` paths match your server setup
- **Database connection fails**: Verify `.env` credentials and MySQL host
- **Passenger not loading**: Ensure `passenger_wsgi.py` is in project root
- **Python version mismatch**: Update `INTERP` path in `passenger_wsgi.py`

## API Endpoints

### Speed Standards

- `GET /api/speed-standards/repertoire` - Get all songs
- `PATCH /api/speed-standards/song/<id>` - Update song progress
- `POST /api/speed-standards/song` - Add new song

## Adding New Tools

1. Create backend module: `app/new_tool/`
2. Create frontend: `public/new-tool/`
3. Register blueprint in `app/__init__.py`
4. Add database tables to `schema.sql`
5. Link from main `public/index.html`

## License

MIT
