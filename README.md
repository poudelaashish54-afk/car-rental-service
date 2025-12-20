# Car Rental Service - PHP Version

A complete car rental booking system built with pure HTML, CSS, JavaScript, and PHP without any frameworks.

## Features

- User registration and authentication
- Car browsing and selection
- Booking management (create, view, delete)
- Session-based authentication
- MySQL database integration
- Responsive design

## Requirements

- PHP 7.4 or higher
- MySQL 5.7 or higher
- Apache/Nginx web server
- PHP extensions: mysqli, session

**Note:** This application requires NO build process or Node.js. It runs directly on a PHP server.

## Installation

1. **Database Setup**
   - Create a MySQL database named `car_rental`
   - Import the database schema:
   ```bash
   mysql -u root -p car_rental < database.sql
   ```

2. **Configure Database Connection**
   - Edit `config.php` and update the database credentials:
   ```php
   define('DB_HOST', 'localhost');
   define('DB_USER', 'your_username');
   define('DB_PASS', 'your_password');
   define('DB_NAME', 'car_rental');
   ```

3. **Deploy to Web Server**
   - Copy all files to your web server's document root (e.g., `/var/www/html/` or `htdocs/`)
   - Ensure PHP has read/write permissions for session files

4. **Access the Application**
   - Open your browser and navigate to `http://localhost/` or your domain
   - Register a new account or login
   - Start booking cars!

## Project Structure

```
/
├── auth/
│   ├── register.php        # User registration endpoint
│   ├── login.php           # User login endpoint
│   ├── logout.php          # User logout endpoint
│   └── check_session.php   # Session validation endpoint
├── bookings/
│   ├── create_booking.php  # Create new booking
│   ├── get_bookings.php    # Fetch user bookings
│   └── delete_booking.php  # Cancel booking
├── config.php              # Database configuration
├── database.sql            # Database schema
├── .htaccess               # Apache configuration
├── index.html              # Homepage
├── booking.html            # Booking page
├── script.js               # Homepage JavaScript
├── booking.js              # Booking page JavaScript
├── style.css               # Main styles
└── booking-style.css       # Booking page styles
```

## API Endpoints

### Authentication
- `POST /auth/register.php` - Register new user
- `POST /auth/login.php` - Login user
- `GET /auth/logout.php` - Logout user
- `GET /auth/check_session.php` - Check session status

### Bookings
- `POST /bookings/create_booking.php` - Create booking
- `GET /bookings/get_bookings.php` - Get user bookings
- `DELETE /bookings/delete_booking.php` - Delete booking

## Security Features

- Password hashing using PHP's `password_hash()`
- SQL injection prevention using prepared statements
- Session-based authentication
- Input validation and sanitization
- CSRF protection through session validation

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT License
