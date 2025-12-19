import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

let currentUser = null;

window.addEventListener('DOMContentLoaded', () => {
  checkAuth();
  setupScrollEffect();
});

async function checkAuth() {
  const { data: { session } } = await supabase.auth.getSession();
  if (session) {
    currentUser = session.user;
    updateUIForLoggedInUser();
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
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    });
  }
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
    updateUIForLoggedInUser();

    if (window.location.pathname.includes('booking.html')) {
      window.location.reload();
    }
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
    updateUIForLoggedInUser();

    if (window.location.pathname.includes('booking.html')) {
      window.location.reload();
    } else {
      alert('Registration successful! You can now book a car.');
    }
  } catch (error) {
    showAuthError(error.message);
  }
};

window.logout = async function() {
  try {
    await supabase.auth.signOut();
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
    alert('Error logging out: ' + error.message);
  }
};

export { supabase, currentUser };
