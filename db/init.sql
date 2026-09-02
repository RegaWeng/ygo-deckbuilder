CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    address VARCHAR(255),
    role VARCHAR(20) NOT NULL DEFAULT 'user' CHECK (role IN ('user','worker','super_admin')),
    reset_token VARCHAR(255),
    reset_token_expires TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS decks (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    deck_name VARCHAR(50) NOT NULL,
    format VARCHAR(10) NOT NULL DEFAULT 'TCG' CHECK (format IN ('TCG','OCG')),
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE (user_id, deck_name)
);

CREATE TABLE IF NOT EXISTS deck_cards (
    id SERIAL PRIMARY KEY,
    deck_id INTEGER NOT NULL REFERENCES decks(id) ON DELETE CASCADE,
    card_id VARCHAR(200) NOT NULL,
    section VARCHAR(10) NOT NULL DEFAULT 'main' CHECK (section IN ('main','extra','side')),
    quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity BETWEEN 1 AND 3),
    UNIQUE (deck_id, card_id, section),
    created_at TIMESTAMP DEFAULT NOW()
);

INSERT INTO users (username, password_hash, email, role)
VALUES ('admin', '$2b$10$VnXXiQU1cxY8ySqNbxgm0e2DIEfld8QrLgF4m7RpM9Ohum48a3dzm', 'admin@example.com', 'super_admin')
ON CONFLICT (username) DO NOTHING;