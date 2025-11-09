# Practice Tools

Collection of music practice utilities built with vanilla JavaScript and Flask.

## Tools

### Speed Standards
Track tempo progression on jazz standards using a weighted selection algorithm to choose practice songs based on your progress.

### 2d6 Scales
Generate random musical scales using a 2d6 dice algorithm. Each scale is created by rolling two dice and taking the minimum value to determine interval steps. Scales are automatically generated every 2 minutes and displayed in musical notation.

## Tech Stack

- **Frontend**: Vanilla JavaScript (ES Modules), HTML5, CSS3
- **Backend**: Flask (Python)
- **Database**: MySQL
- **Deployment**: DreamHost shared hosting

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
- [uv working](https://docs.astral.sh/uv/getting-started/installation/)
- MySQL database

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

3. **Install dependencies with uv:**
   ```bash
   uv sync
   ```

4. **Configure environment:**
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

5. **Load database schema:**
   ```bash
   mysql -h mysql.yourdomain.com -u your_db_user -p your_db_name < schema.sql
   ```

6. **Configure Apache:**

   In your DreamHost panel:
   - Go to Websites → Manage Websites
   - Manage your website → Settings → Directories → Modify
   - Set "Web directory" to: `/home/username/practice-tools`, Save Changes

7. **Test deployment:**
   Visit your domain in a browser.

### Updating

```bash
cd ~/practice-tools
git pull
uv sync  # Update dependencies if changed
```

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
