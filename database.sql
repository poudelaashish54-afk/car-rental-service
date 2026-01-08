-- Create database
CREATE DATABASE IF NOT EXISTS car_rental;
USE car_rental;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Cars table
CREATE TABLE IF NOT EXISTS cars (
    id INT AUTO_INCREMENT PRIMARY KEY,
    model VARCHAR(255) NOT NULL,
    price_per_day DECIMAL(10, 2) NOT NULL,
    status ENUM('available', 'rented', 'maintenance') DEFAULT 'available',
    description TEXT,
    image_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bookings table
CREATE TABLE IF NOT EXISTS bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    car_id INT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    status ENUM('pending', 'confirmed', 'cancelled') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (car_id) REFERENCES cars(id) ON DELETE CASCADE
);

-- Insert sample cars
INSERT INTO cars (model, price_per_day, status, description, image_url) VALUES
('Red Sports Car', 50.00, 'available', 'Fast, stylish, and perfect for city drives.', 'https://images.pexels.com/photos/210019/pexels-photo-210019.jpeg'),
('Luxury SUV', 80.00, 'available', 'Spacious, comfortable, and ideal for family trips.', 'https://images.pexels.com/photos/116675/pexels-photo-116675.jpeg'),
('Elegant Sedan', 60.00, 'available', 'Comfortable and reliable for city and highway rides.', 'https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg'),
('Convertible', 90.00, 'available', 'Experience freedom and style with an open roof.', 'https://images.pexels.com/photos/358070/pexels-photo-358070.jpeg');
