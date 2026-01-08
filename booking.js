let currentUser = null;
let availableCars = [];

window.addEventListener('DOMContentLoaded', async function() {
  await checkAuth();
  setupScrollEffect();
  await loadCars();
  setupFormListeners();
  await loadBookings();
});

async function checkAuth() {
  try {
    const response = await fetch('auth/check_session.php');
    const data = await response.json();

    if (!data.authenticated) {
      alert('Please login to book a car');
      window.location.href = 'index.html';
      return;
    }

    currentUser = data.user;
    updateUIForLoggedInUser();

    document.getElementById('email').value = currentUser.email;
  } catch (error) {
    console.error('Error checking auth:', error);
    alert('Error checking authentication');
    window.location.href = 'index.html';
  }
}

function updateUIForLoggedInUser() {
  const authButtons = document.getElementById('auth-buttons');
  const userInfo = document.getElementById('user-info');
  const userEmail = document.getElementById('user-email');

  if (authButtons && userInfo && currentUser) {
    authButtons.style.display = 'none';
    userInfo.style.display = 'flex';
    userEmail.textContent = currentUser.email;
  }
}

function setupScrollEffect() {
  const navbar = document.getElementById('navbar');
  if (navbar) {
    window.addEventListener('scroll', function() {
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    });
  }
}

async function loadCars() {
  try {
    const response = await fetch('api/get_cars.php');
    const data = await response.json();

    if (!response.ok) {
      showMessage('Error loading cars', 'error');
      return;
    }

    availableCars = data.cars.filter(function(car) {
      return car.status === 'available';
    });

    const carSelect = document.getElementById('car-select');
    carSelect.innerHTML = '<option value="">Choose a car...</option>';

    availableCars.forEach(function(car) {
      const option = document.createElement('option');
      option.value = car.id;
      option.textContent = car.model + ' - $' + parseFloat(car.price_per_day).toFixed(2) + '/day';
      option.setAttribute('data-price', car.price_per_day);
      carSelect.appendChild(option);
    });
  } catch (error) {
    console.error('Error loading cars:', error);
    showMessage('Error loading cars', 'error');
  }
}

function setupFormListeners() {
  const form = document.getElementById('booking-form');
  const carSelect = document.getElementById('car-select');
  const startDate = document.getElementById('start-date');
  const endDate = document.getElementById('end-date');

  const today = new Date().toISOString().split('T')[0];
  startDate.setAttribute('min', today);
  endDate.setAttribute('min', today);

  carSelect.addEventListener('change', calculatePrice);
  startDate.addEventListener('change', function() {
    endDate.setAttribute('min', startDate.value);
    calculatePrice();
  });
  endDate.addEventListener('change', calculatePrice);

  form.addEventListener('submit', handleBooking);
}

function calculatePrice() {
  const carSelect = document.getElementById('car-select');
  const startDate = document.getElementById('start-date');
  const endDate = document.getElementById('end-date');
  const totalPriceEl = document.getElementById('total-price');

  const selectedOption = carSelect.options[carSelect.selectedIndex];
  const pricePerDay = parseFloat(selectedOption.getAttribute('data-price'));

  const start = new Date(startDate.value);
  const end = new Date(endDate.value);

  if (carSelect.value && startDate.value && endDate.value && end >= start && pricePerDay) {
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
    const total = days * pricePerDay;
    totalPriceEl.textContent = '$' + total.toFixed(2);
  } else {
    totalPriceEl.textContent = '$0';
  }
}

async function handleBooking(e) {
  e.preventDefault();

  if (!currentUser) {
    showMessage('Please login first', 'error');
    return;
  }

  const formData = {
    car_id: document.getElementById('car-select').value,
    start_date: document.getElementById('start-date').value,
    end_date: document.getElementById('end-date').value,
    full_name: document.getElementById('full-name').value,
    email: document.getElementById('email').value,
    phone: document.getElementById('phone').value
  };

  try {
    const response = await fetch('bookings/create_booking.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    });

    const data = await response.json();

    if (!response.ok) {
      showMessage(data.error || 'Error creating booking', 'error');
      return;
    }

    showMessage('Booking confirmed! Check your email for details.', 'success');
    document.getElementById('booking-form').reset();
    document.getElementById('total-price').textContent = '$0';
    await loadBookings();
  } catch (error) {
    showMessage('Error creating booking. Please try again.', 'error');
  }
}

async function loadBookings() {
  if (!currentUser) return;

  try {
    const response = await fetch('bookings/get_bookings.php');
    const data = await response.json();

    if (!response.ok) {
      console.error('Error loading bookings:', data.error);
      return;
    }

    displayBookings(data.bookings);
  } catch (error) {
    console.error('Error loading bookings:', error);
  }
}

function displayBookings(bookings) {
  const bookingsList = document.getElementById('bookings-list');

  if (!bookings || bookings.length === 0) {
    bookingsList.innerHTML = '<p style="color: #666; text-align: center;">No bookings yet</p>';
    return;
  }

  bookingsList.innerHTML = bookings.map(function(booking) {
    return '<div class="booking-card">' +
      '<h3>' + booking.car_model + '</h3>' +
      '<p><strong>Name:</strong> ' + booking.full_name + '</p>' +
      '<p><strong>Dates:</strong> ' + formatDate(booking.start_date) + ' to ' + formatDate(booking.end_date) + '</p>' +
      '<p><strong>Phone:</strong> ' + booking.phone + '</p>' +
      '<span class="status ' + booking.status + '">' + booking.status + '</span>' +
      '<button class="delete-btn" onclick="deleteBooking(' + booking.id + ')">Cancel Booking</button>' +
      '</div>';
  }).join('');
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

async function deleteBooking(bookingId) {
  if (!confirm('Are you sure you want to cancel this booking?')) {
    return;
  }

  try {
    const response = await fetch('bookings/delete_booking.php', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ booking_id: bookingId })
    });

    const data = await response.json();

    if (!response.ok) {
      showMessage(data.error || 'Error cancelling booking', 'error');
      return;
    }

    showMessage('Booking cancelled successfully', 'success');
    await loadBookings();
  } catch (error) {
    showMessage('Error cancelling booking. Please try again.', 'error');
  }
}

function showMessage(message, type) {
  const messageDiv = document.getElementById('booking-message');
  messageDiv.textContent = message;
  messageDiv.className = 'message ' + type;
  messageDiv.style.display = 'block';

  setTimeout(function() {
    messageDiv.style.display = 'none';
  }, 5000);
}

function openPopup() {
  document.getElementById('popup').style.display = 'flex';
  showLogin();
}

function closePopup() {
  document.getElementById('popup').style.display = 'none';
  clearAuthError();
}

function showLogin() {
  document.getElementById('popup-title').textContent = 'Login';
  document.getElementById('login-form').style.display = 'block';
  document.getElementById('register-form').style.display = 'none';
  clearAuthError();
}

function showRegister() {
  document.getElementById('popup-title').textContent = 'Register';
  document.getElementById('login-form').style.display = 'none';
  document.getElementById('register-form').style.display = 'block';
  clearAuthError();
}

function clearAuthError() {
  const errorDiv = document.getElementById('auth-error');
  if (errorDiv) {
    errorDiv.textContent = '';
    errorDiv.classList.remove('show');
  }
}

function showAuthError(message) {
  const errorDiv = document.getElementById('auth-error');
  if (errorDiv) {
    errorDiv.textContent = message;
    errorDiv.classList.add('show');
  }
}

async function handleLogin() {
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;

  if (!email || !password) {
    showAuthError('Please fill in all fields');
    return;
  }

  try {
    const response = await fetch('auth/login.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email: email, password: password })
    });

    const data = await response.json();

    if (!response.ok) {
      showAuthError(data.error || 'Login failed');
      return;
    }

    currentUser = data.user;
    closePopup();
    window.location.reload();
  } catch (error) {
    showAuthError('An error occurred. Please try again.');
  }
}

async function handleRegister() {
  const name = document.getElementById('register-name').value;
  const email = document.getElementById('register-email').value;
  const password = document.getElementById('register-password').value;
  const confirmPassword = document.getElementById('register-confirm').value;

  if (!name || !email || !password || !confirmPassword) {
    showAuthError('Please fill in all fields');
    return;
  }

  if (password.length < 6) {
    showAuthError('Password must be at least 6 characters');
    return;
  }

  if (password !== confirmPassword) {
    showAuthError('Passwords do not match');
    return;
  }

  try {
    const response = await fetch('auth/register.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name: name, email: email, password: password, confirmPassword: confirmPassword })
    });

    const data = await response.json();

    if (!response.ok) {
      showAuthError(data.error || 'Registration failed');
      return;
    }

    currentUser = data.user;
    closePopup();
    window.location.reload();
  } catch (error) {
    showAuthError('An error occurred. Please try again.');
  }
}

async function logout() {
  try {
    await fetch('auth/logout.php');
    currentUser = null;
    window.location.href = 'index.html';
  } catch (error) {
    alert('Error logging out. Please try again.');
  }
}
