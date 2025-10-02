-- Users Table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    failed_attempts INT DEFAULT 0
);

-- Products Table
CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(255),
    sku VARCHAR(255) UNIQUE NOT NULL,
    image_url VARCHAR(255),
    description TEXT,
    quantity INTEGER NOT NULL DEFAULT 0,
    price DECIMAL(10, 2) NOT NULL,
    userid INTEGER,
    FOREIGN KEY (userid) REFERENCES users(id)
); 