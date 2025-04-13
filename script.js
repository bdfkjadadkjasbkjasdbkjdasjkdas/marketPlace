const TELEGRAM_USERNAME = 'evgen87654321';
let items = JSON.parse(localStorage.getItem('marketItems') || '[]');

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
    localStorage.setItem('marketItems', JSON.stringify(items));
    displayItems();
    clearInputs();
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
  localStorage.setItem('marketItems', JSON.stringify(items));
  displayItems();
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
