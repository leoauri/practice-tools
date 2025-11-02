-- Database schema for practice tools

-- Speed Standards tool
CREATE TABLE IF NOT EXISTS speed_standards_songs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    achieved DECIMAL(6,2) DEFAULT 0.00,
    target DECIMAL(6,2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_title (title)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert initial repertoire data
INSERT INTO speed_standards_songs (title, achieved, target) VALUES
    ('Alone together', 72, 160),
    ('Beatrice', 0, 0),
    ('Blue in green', 50, 66),
    ('Body and soul', 48, 48),
    ('Footprints', 108, 180),
    ('God bless the child', 0, 0),
    ('I hear a rhapsody', 0, 0),
    ('I love you', 0, 212),
    ('I''ll remember April', 0, 0),
    ('Invitation', 0, 0),
    ('Lover man', 0, 0),
    ('Nostalgia in Times Square', 0, 0),
    ('Prelude to a kiss', 0, 0),
    ('Round midnight', 0, 0),
    ('Tenderly', 0, 0),
    ('Solar', 0, 0),
    ('The night has a thousand eyes', 0, 0),
    ('Some day my Prince will come', 0, 0),
    ('What is this thing called love', 0, 0),
    ('Beautiful love', 49.78, 160),
    ('Oleo', 0, 0),
    ('Night dreamer', 0, 0);
