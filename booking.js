import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

let currentUser = null;

const carPrices = {
  'Red Sports Car': 50,
  'Luxury SUV': 80,
  'Elegant Sedan': 60,
  'Convertible': 90
};

window.addEventListener('DOMContentLoaded', async () => {
  await checkAuth();
  setupScrollEffect();
  setupFormListeners();
  await loadBookings();
});

async function checkAuth() {
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    alert('Please login to book a car');
    window.location.href = 'index.html';
    return;
  }

  currentUser = session.user;
  updateUIForLoggedInUser();

  document.getElementById('email').value = currentUser.email;
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
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    });
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
  startDate.addEventListener('change', () => {
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

  const car = carSelect.value;
  const start = new Date(startDate.value);
  const end = new Date(endDate.value);

  if (car && startDate.value && endDate.value && end >= start) {
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
    const pricePerDay = carPrices[car];
    const total = days * pricePerDay;
    totalPriceEl.textContent = `$${total}`;
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
    user_id: currentUser.id,
    car_name: document.getElementById('car-select').value,
    start_date: document.getElementById('start-date').value,
    end_date: document.getElementById('end-date').value,
    full_name: document.getElementById('full-name').value,
    email: document.getElementById('email').value,
    phone: document.getElementById('phone').value,
    status: 'pending'
  };

  try {
    const { data, error } = await supabase
      .from('bookings')
      .insert([formData])
      .select();

    if (error) throw error;

    showMessage('Booking confirmed! Check your email for details.', 'success');
    document.getElementById('booking-form').reset();
    document.getElementById('total-price').textContent = '$0';
    await loadBookings();
  } catch (error) {
    showMessage('Error creating booking: ' + error.message, 'error');
  }
}

async function loadBookings() {
  if (!currentUser) return;

  try {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('user_id', currentUser.id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    displayBookings(data);
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

  bookingsList.innerHTML = bookings.map(booking => `
    <div class="booking-card">
      <h3>${booking.car_name}</h3>
      <p><strong>Name:</strong> ${booking.full_name}</p>
      <p><strong>Dates:</strong> ${formatDate(booking.start_date)} to ${formatDate(booking.end_date)}</p>
      <p><strong>Phone:</strong> ${booking.phone}</p>
      <span class="status ${booking.status}">${booking.status}</span>
      <button class="delete-btn" onclick="deleteBooking('${booking.id}')">Cancel Booking</button>
    </div>
  `).join('');
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

window.deleteBooking = async function(bookingId) {
  if (!confirm('Are you sure you want to cancel this booking?')) {
    return;
  }

  try {
    const { error } = await supabase
      .from('bookings')
      .delete()
      .eq('id', bookingId);

    if (error) throw error;

    showMessage('Booking cancelled successfully', 'success');
    await loadBookings();
  } catch (error) {
    showMessage('Error cancelling booking: ' + error.message, 'error');
  }
};

function showMessage(message, type) {
  const messageDiv = document.getElementById('booking-message');
  messageDiv.textContent = message;
  messageDiv.className = `message ${type}`;
  messageDiv.style.display = 'block';

  setTimeout(() => {
    messageDiv.style.display = 'none';
  }, 5000);
}

window.openPopup = function() {
  document.getElementById('popup').style.display = 'flex';
  showLogin();
};

window.closePopup = function() {
  document.getElementById('popup').style.display = 'none';
  clearAuthError();
};

window.showLogin = function() {
  document.getElementById('popup-title').textContent = 'Login';
  document.getElementById('login-form').style.display = 'block';
  document.getElementById('register-form').style.display = 'none';
  clearAuthError();
};

window.showRegister = function() {
  document.getElementById('popup-title').textContent = 'Register';
  document.getElementById('login-form').style.display = 'none';
  document.getElementById('register-form').style.display = 'block';
  clearAuthError();
};

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

window.handleLogin = async function() {
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;

  if (!email || !password) {
    showAuthError('Please fill in all fields');
    return;
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) throw error;

    currentUser = data.user;
    closePopup();
    window.location.reload();
  } catch (error) {
    showAuthError(error.message);
  }
};

window.handleRegister = async function() {
  const email = document.getElementById('register-email').value;
  const password = document.getElementById('register-password').value;
  const confirmPassword = document.getElementById('register-confirm').value;

  if (!email || !password || !confirmPassword) {
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
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    if (error) throw error;

    currentUser = data.user;
    closePopup();
    window.location.reload();
  } catch (error) {
    showAuthError(error.message);
  }
};

window.logout = async function() {
  try {
    await supabase.auth.signOut();
    currentUser = null;
    window.location.href = 'index.html';
  } catch (error) {
    alert('Error logging out: ' + error.message);
  }
};
