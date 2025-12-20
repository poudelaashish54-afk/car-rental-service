let currentUser = null;

window.addEventListener('DOMContentLoaded', function() {
  checkAuth();
  setupScrollEffect();
});

async function checkAuth() {
  try {
    const response = await fetch('auth/check_session.php');
    const data = await response.json();

    if (data.authenticated) {
      currentUser = data.user;
      updateUIForLoggedInUser();
    }
  } catch (error) {
    console.error('Error checking auth:', error);
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
    updateUIForLoggedInUser();
  } catch (error) {
    showAuthError('An error occurred. Please try again.');
  }
}

async function handleRegister() {
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
    const response = await fetch('auth/register.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email: email, password: password, confirmPassword: confirmPassword })
    });

    const data = await response.json();

    if (!response.ok) {
      showAuthError(data.error || 'Registration failed');
      return;
    }

    currentUser = data.user;
    closePopup();
    updateUIForLoggedInUser();
    alert('Registration successful! You can now book a car.');
  } catch (error) {
    showAuthError('An error occurred. Please try again.');
  }
}

async function logout() {
  try {
    await fetch('auth/logout.php');
    currentUser = null;

    const authButtons = document.getElementById('auth-buttons');
    const userInfo = document.getElementById('user-info');

    if (authButtons && userInfo) {
      authButtons.style.display = 'block';
      userInfo.style.display = 'none';
    }

    if (window.location.pathname.includes('booking.html')) {
      window.location.href = 'index.html';
    }
  } catch (error) {
    alert('Error logging out. Please try again.');
  }
}
