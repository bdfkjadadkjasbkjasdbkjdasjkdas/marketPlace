const TELEGRAM_USERNAME = 'evgen87654321';
let items = [];

// Load items from Replit Object Storage
fetch('/api/items')
  .then(response => {
    if (!response.ok) throw new Error('Failed to fetch items');
    return response.json();
  })
  .then(data => {
    items = Array.isArray(data) ? data : [];
    displayItems();
  })
  .catch(error => {
    console.error('Error loading items:', error);
    items = [];
    displayItems();
  });

function addItem() {
  const telegram = window.Telegram.WebApp;
  const user = telegram.initDataUnsafe?.user;
  const username = user?.username?.toLowerCase();

  if (username !== TELEGRAM_USERNAME.toLowerCase()) {
    alert('Только для @evgen87654321');
    return;
  }

  const name = document.getElementById('itemName').value;
  const price = document.getElementById('itemPrice').value;
  const imageFile = document.getElementById('itemImage').files[0];

  if (!name || !price || !imageFile) {
    alert('Please fill all fields');
    return;
  }

  if (price < 0) {
    alert('Price cannot be negative');
    return;
  }

  const reader = new FileReader();
  reader.onload = function(e) {
    const newItem = { 
      name, 
      price, 
      image: e.target.result 
    };
    items.push(newItem);
    fetch('/api/items', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(items)
    })
    .then(() => {
      displayItems();
      clearInputs();
    })
    .catch(error => console.error('Error saving items:', error));
  };
  reader.readAsDataURL(imageFile);
}

function clearInputs() {
  document.getElementById('itemName').value = '';
  document.getElementById('itemPrice').value = '';
  document.getElementById('itemImage').value = '';
}

function deleteItem(index) {
  const telegram = window.Telegram.WebApp;
  const user = telegram.initDataUnsafe?.user;
  const username = user?.username?.toLowerCase();

  if (username !== TELEGRAM_USERNAME.toLowerCase()) {
    alert('Only @evgen87654321 can delete items');
    return;
  }

  items.splice(index, 1);
  fetch('/api/items', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(items)
  })
  .then(() => {
    displayItems();
  })
  .catch(error => console.error('Error saving items:', error));
}

function displayItems() {
  const container = document.getElementById('itemsContainer');
  const telegram = window.Telegram.WebApp;
  const user = telegram.initDataUnsafe?.user;
  const username = user?.username?.toLowerCase();
  const isAdmin = username === TELEGRAM_USERNAME.toLowerCase();

  container.innerHTML = '';

  items.forEach((item, index) => {
    const itemElement = document.createElement('div');
    itemElement.className = 'item';
    itemElement.innerHTML = `
      <img src="${item.image}" alt="${item.name}">
      <h3>${item.name}</h3>
      <p>${item.price} ₽</p>
      ${isAdmin ? `<button class="delete-btn" onclick="event.stopPropagation(); deleteItem(${index})">Удалить</button>` : ''}
    `;
    itemElement.onclick = () => {
      window.location.href = `https://t.me/${TELEGRAM_USERNAME}`;
    };
    container.appendChild(itemElement);
  });
}

displayItems();
