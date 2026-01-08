let currentUser = null;

window.addEventListener('DOMContentLoaded', async function() {
  await checkAuth();
  setupScrollEffect();
  await loadCars();
  setupFormHandlers();
});

async function checkAuth() {
  try {
    const response = await fetch('auth/check_session.php');
    const data = await response.json();

    if (!data.authenticated) {
      alert('Please login to manage cars');
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

  if (userInfo && currentUser) {
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

function setupFormHandlers() {
  const carForm = document.getElementById('car-form');
  const editForm = document.getElementById('edit-form');

  if (carForm) {
    carForm.addEventListener('submit', handleAddCar);
  }

  if (editForm) {
    editForm.addEventListener('submit', handleEditCar);
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

    displayCars(data.cars);
  } catch (error) {
    console.error('Error loading cars:', error);
    showMessage('Error loading cars', 'error');
  }
}

function displayCars(cars) {
  const tbody = document.getElementById('cars-tbody');

  if (!cars || cars.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; color: #666;">No cars found</td></tr>';
    return;
  }

  tbody.innerHTML = cars.map(function(car) {
    return '<tr>' +
      '<td>' + car.id + '</td>' +
      '<td>' + car.model + '</td>' +
      '<td>$' + parseFloat(car.price_per_day).toFixed(2) + '</td>' +
      '<td><span class="status-badge ' + car.status + '">' + car.status + '</span></td>' +
      '<td>' + (car.description || 'N/A') + '</td>' +
      '<td>' +
      '<div class="action-btns">' +
      '<button class="edit-btn" onclick="showEditForm(' + car.id + ')">Edit</button>' +
      '<button class="delete-btn" onclick="deleteCar(' + car.id + ')">Delete</button>' +
      '</div>' +
      '</td>' +
      '</tr>';
  }).join('');
}

function showAddCarForm() {
  document.getElementById('add-car-form').style.display = 'block';
  document.getElementById('edit-car-form').style.display = 'none';
}

function hideAddCarForm() {
  document.getElementById('add-car-form').style.display = 'none';
  document.getElementById('car-form').reset();
}

async function handleAddCar(e) {
  e.preventDefault();

  const formData = {
    model: document.getElementById('model').value,
    price_per_day: document.getElementById('price').value,
    status: document.getElementById('status').value,
    description: document.getElementById('description').value,
    image_url: document.getElementById('image_url').value
  };

  try {
    const response = await fetch('api/add_car.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    });

    const data = await response.json();

    if (!response.ok) {
      showMessage(data.error || 'Error adding car', 'error');
      return;
    }

    showMessage('Car added successfully!', 'success');
    hideAddCarForm();
    await loadCars();
  } catch (error) {
    showMessage('Error adding car. Please try again.', 'error');
  }
}

async function showEditForm(carId) {
  try {
    const response = await fetch('api/get_cars.php');
    const data = await response.json();

    const car = data.cars.find(function(c) {
      return c.id == carId;
    });

    if (!car) {
      showMessage('Car not found', 'error');
      return;
    }

    document.getElementById('edit-id').value = car.id;
    document.getElementById('edit-model').value = car.model;
    document.getElementById('edit-price').value = car.price_per_day;
    document.getElementById('edit-status').value = car.status;
    document.getElementById('edit-description').value = car.description || '';
    document.getElementById('edit-image_url').value = car.image_url || '';

    document.getElementById('add-car-form').style.display = 'none';
    document.getElementById('edit-car-form').style.display = 'block';

    document.getElementById('edit-car-form').scrollIntoView({ behavior: 'smooth' });
  } catch (error) {
    showMessage('Error loading car details', 'error');
  }
}

function hideEditCarForm() {
  document.getElementById('edit-car-form').style.display = 'none';
  document.getElementById('edit-form').reset();
}

async function handleEditCar(e) {
  e.preventDefault();

  const formData = {
    id: document.getElementById('edit-id').value,
    model: document.getElementById('edit-model').value,
    price_per_day: document.getElementById('edit-price').value,
    status: document.getElementById('edit-status').value,
    description: document.getElementById('edit-description').value,
    image_url: document.getElementById('edit-image_url').value
  };

  try {
    const response = await fetch('api/update_car.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    });

    const data = await response.json();

    if (!response.ok) {
      showMessage(data.error || 'Error updating car', 'error');
      return;
    }

    showMessage('Car updated successfully!', 'success');
    hideEditCarForm();
    await loadCars();
  } catch (error) {
    showMessage('Error updating car. Please try again.', 'error');
  }
}

async function deleteCar(carId) {
  if (!confirm('Are you sure you want to delete this car?')) {
    return;
  }

  try {
    const response = await fetch('api/delete_car.php', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ id: carId })
    });

    const data = await response.json();

    if (!response.ok) {
      showMessage(data.error || 'Error deleting car', 'error');
      return;
    }

    showMessage('Car deleted successfully!', 'success');
    await loadCars();
  } catch (error) {
    showMessage('Error deleting car. Please try again.', 'error');
  }
}

function showMessage(message, type) {
  const messageDiv = document.getElementById('message');
  messageDiv.textContent = message;
  messageDiv.className = 'message ' + type;
  messageDiv.style.display = 'block';

  setTimeout(function() {
    messageDiv.style.display = 'none';
  }, 5000);
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
