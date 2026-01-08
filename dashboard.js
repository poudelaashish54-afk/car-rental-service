let currentUser = null;

window.addEventListener('DOMContentLoaded', async function() {
  await checkAuth();
  setupScrollEffect();
  await loadDashboardData();
});

async function checkAuth() {
  try {
    const response = await fetch('auth/check_session.php');
    const data = await response.json();

    if (!data.authenticated) {
      alert('Please login to access the dashboard');
      window.location.href = 'index.html';
      return;
    }

    currentUser = data.user;
    updateUIForLoggedInUser();
  } catch (error) {
    console.error('Error checking auth:', error);
    alert('Error checking authentication');
    window.location.href = 'index.html';
  }
}

function updateUIForLoggedInUser() {
  const userInfo = document.getElementById('user-info');
  const userEmail = document.getElementById('user-email');
  const userName = document.getElementById('user-name');

  if (userInfo && currentUser) {
    userInfo.style.display = 'flex';
    userEmail.textContent = currentUser.email;
    if (userName) {
      userName.textContent = currentUser.name || currentUser.email;
    }
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

async function loadDashboardData() {
  try {
    const [carsResponse, bookingsResponse] = await Promise.all([
      fetch('api/get_cars.php'),
      fetch('bookings/get_bookings.php')
    ]);

    const carsData = await carsResponse.json();
    const bookingsData = await bookingsResponse.json();

    const totalCars = carsData.cars ? carsData.cars.length : 0;
    const availableCars = carsData.cars ? carsData.cars.filter(function(car) {
      return car.status === 'available';
    }).length : 0;

    const totalBookings = bookingsData.bookings ? bookingsData.bookings.length : 0;
    const pendingBookings = bookingsData.bookings ? bookingsData.bookings.filter(function(booking) {
      return booking.status === 'pending';
    }).length : 0;

    document.getElementById('total-cars').textContent = totalCars;
    document.getElementById('available-cars').textContent = availableCars;
    document.getElementById('total-bookings').textContent = totalBookings;
    document.getElementById('pending-bookings').textContent = pendingBookings;

    displayRecentBookings(bookingsData.bookings || []);
  } catch (error) {
    console.error('Error loading dashboard data:', error);
  }
}

function displayRecentBookings(bookings) {
  const recentBookingsList = document.getElementById('recent-bookings-list');

  if (!bookings || bookings.length === 0) {
    recentBookingsList.innerHTML = '<p style="color: #666; text-align: center;">No bookings yet</p>';
    return;
  }

  const recentBookings = bookings.slice(0, 5);

  recentBookingsList.innerHTML = recentBookings.map(function(booking) {
    return '<div class="booking-card">' +
      '<h3>' + booking.car_name + '</h3>' +
      '<p><strong>Name:</strong> ' + booking.full_name + '</p>' +
      '<p><strong>Dates:</strong> ' + formatDate(booking.start_date) + ' to ' + formatDate(booking.end_date) + '</p>' +
      '<span class="status ' + booking.status + '">' + booking.status + '</span>' +
      '</div>';
  }).join('');
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function loadRecentBookings() {
  window.location.href = 'booking.html';
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
