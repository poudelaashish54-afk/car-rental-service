# Car Rental Service - PHP Version

A complete car rental booking system built with pure HTML, CSS, JavaScript, and PHP without any frameworks.

## Features

### Authentication
- User registration with name, email, and password
- Secure login with password hashing
- Session-based authentication
- Logout functionality

### Dashboard
- Real-time statistics: Total cars, available cars, total bookings, pending bookings
- Quick action buttons for easy navigation
- Recent bookings overview
- User-friendly interface with gradient cards

### Car Management (CRUD)
- **Create**: Add new cars with model, price per day, status, description, and image
- **Read**: View all cars in an organized table
- **Update**: Edit car details including price and availability status
- **Delete**: Remove cars from inventory
- Status tracking: Available, Rented, Maintenance

### Booking System
- Browse available cars dynamically from database
- Select rental dates with automatic price calculation
- Create bookings with customer information
- View all personal bookings
- Cancel bookings

## Technical Stack

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Backend**: PHP 7.4+
- **Database**: MySQL 5.7+
- **Authentication**: Session-based with password hashing
- **No frameworks or libraries required**

## Requirements

- PHP 7.4 or higher
- MySQL 5.7 or higher
- Apache/Nginx web server
- PHP extensions: mysqli, session

**Note:** This application requires NO build process or Node.js. It runs directly on a PHP server.

## Database Tables

### users
- id (Primary Key)
- name
- email (Unique)
- password (Hashed)
- created_at

### cars
- id (Primary Key)
- model
- price_per_day
- status (available/rented/maintenance)
- description
- image_url
- created_at

### bookings
- id (Primary Key)
- user_id (Foreign Key)
- car_id (Foreign Key)
- start_date
- end_date
- full_name
- email
- phone
- status (pending/confirmed/cancelled)
- created_at

## Installation

### 1. Database Setup

Create a MySQL database and import the schema:

```bash
mysql -u root -p
CREATE DATABASE car_rental;
exit;

mysql -u root -p car_rental < database.sql
```

The database.sql file includes:
- All table definitions
- Sample cars (4 pre-loaded vehicles)
- Proper foreign key relationships

### 2. Configure Database Connection

Edit `config.php` and update your database credentials:

```php
define('DB_HOST', 'localhost');
define('DB_USER', 'your_username');
define('DB_PASS', 'your_password');
define('DB_NAME', 'car_rental');
```

### 3. Deploy to Web Server

Copy all files to your web server's document root:
- Apache: `/var/www/html/`
- XAMPP: `C:\xampp\htdocs\`
- MAMP: `/Applications/MAMP/htdocs/`

Ensure PHP has proper permissions for session management.

### 4. Access the Application

Open your browser and navigate to:
- Local: `http://localhost/`
- Or your domain: `http://yourdomain.com/`

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
├── api/
│   ├── get_cars.php        # Fetch all cars
│   ├── add_car.php         # Add new car
│   ├── update_car.php      # Update car details
│   └── delete_car.php      # Delete car
├── config.php              # Database configuration
├── database.sql            # Database schema with sample data
├── .htaccess               # Apache configuration
├── index.html              # Homepage
├── dashboard.html          # Dashboard page
├── cars-manage.html        # Car management page
├── booking.html            # Booking page
├── script.js               # Homepage JavaScript
├── dashboard.js            # Dashboard JavaScript
├── cars-manage.js          # Car management JavaScript
├── booking.js              # Booking page JavaScript
├── style.css               # Main styles
├── dashboard-style.css     # Dashboard styles
├── cars-manage-style.css   # Car management styles
└── booking-style.css       # Booking page styles
```

## API Endpoints

### Authentication
- `POST /auth/register.php` - Register new user
  - Body: `{ name, email, password, confirmPassword }`
- `POST /auth/login.php` - Login user
  - Body: `{ email, password }`
- `GET /auth/logout.php` - Logout user
- `GET /auth/check_session.php` - Check session status

### Cars
- `GET /api/get_cars.php` - Get all cars
- `POST /api/add_car.php` - Add new car (requires auth)
  - Body: `{ model, price_per_day, status, description, image_url }`
- `POST /api/update_car.php` - Update car (requires auth)
  - Body: `{ id, model, price_per_day, status, description, image_url }`
- `DELETE /api/delete_car.php` - Delete car (requires auth)
  - Body: `{ id }`

### Bookings
- `POST /bookings/create_booking.php` - Create booking (requires auth)
  - Body: `{ car_id, start_date, end_date, full_name, email, phone }`
- `GET /bookings/get_bookings.php` - Get user bookings (requires auth)
- `DELETE /bookings/delete_booking.php` - Delete booking (requires auth)
  - Body: `{ booking_id }`

## Security Features

- **Password Security**: All passwords are hashed using PHP's `password_hash()` with bcrypt
- **SQL Injection Prevention**: Prepared statements used for all database queries
- **Session Management**: Secure session-based authentication
- **Input Validation**: Both client-side and server-side validation
- **Error Handling**: Proper HTTP status codes and error messages
- **CSRF Protection**: Session validation on all protected endpoints

## Usage Guide

### For Users

1. **Register**: Click "Login / Register" → Register → Fill in name, email, and password
2. **Login**: Enter your credentials
3. **Dashboard**: View statistics and recent bookings
4. **Book a Car**: Navigate to "Book a Car" → Select car and dates → Fill form
5. **Manage Bookings**: View and cancel bookings from the booking page

### For Administrators

1. **Manage Cars**: Navigate to "Manage Cars"
2. **Add Car**: Click "+ Add New Car" → Fill details
3. **Edit Car**: Click "Edit" button on any car → Update details
4. **Delete Car**: Click "Delete" button
5. **Monitor**: Check dashboard for statistics

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Development Notes

- No build process required
- Pure vanilla JavaScript (ES6+)
- Responsive design for mobile and desktop
- Clean, semantic HTML structure
- Modular CSS organization
- RESTful API design

## Troubleshooting

### Common Issues

**Database Connection Error**
- Verify MySQL is running
- Check credentials in `config.php`
- Ensure database exists

**Session Issues**
- Check PHP session configuration
- Verify write permissions on session directory
- Clear browser cookies

**404 Errors**
- Ensure `.htaccess` is properly configured
- Check Apache mod_rewrite is enabled
- Verify file paths are correct

## License

MIT License
