const TELEGRAM_USERNAME = 'evgen87654321';
let items = [
  {
    name: 'Steam пополнение',
    price: '1р = 1.2₽',
    image: 'https://cdn-icons-png.flaticon.com/512/3670/3670382.png',
    message: 'Здравствуйте, хочу купить Steam пополнение в размере'
  },
  {
    name: 'V-Bucks Fortnite 1000',
    price: '700₽',
    image: 'i.png',
    message: 'Здравствуйте, хочу купить V-Bucks Fortnite в размере 1000'
  },
  {
    name: 'V-Bucks Fortnite 2800',
    price: '1900₽',
    image: 'i.png',
    message: 'Здравствуйте, хочу купить V-Bucks Fortnite в размере 2800'
  },
  {
    name: 'TG Stars 50',
    price: '80₽',
    image: 'https://cdn-icons-png.flaticon.com/512/1828/1828970.png',
    message: 'Здравствуйте, хочу купить TG Stars в размере 50'
  }
];

function displayItems() {
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
  container.innerHTML = '';

  items.forEach((item, index) => {
    const itemElement = document.createElement('div');
    itemElement.className = 'item';
    itemElement.innerHTML = `
      <img src="${item.image}" alt="${item.name}">
      <h3>${item.name}</h3>
      <p>${item.price}</p>
    `;
    itemElement.onclick = () => {
      const message = encodeURIComponent(item.message);
      window.location.href = `https://t.me/${TELEGRAM_USERNAME}?start=${message}`;
    };
    container.appendChild(itemElement);
  });
}

displayItems();
