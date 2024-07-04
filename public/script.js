// Fonksiyonlar

// Kullanıcı girişi yapma
const logIn = () => {
    const name = document.getElementById('login-name').value;
    const password = document.getElementById('login-password').value;

    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, password })
    })
    .then(response => {
        if (response.ok) {
            return response.text();
        } else {
            throw new Error('Kullanıcı adı veya şifre yanlış');
        }
    })
    .then(data => {
        document.getElementById('login').style.display = 'none';
        document.getElementById('messaging').style.display = 'block';
        sessionStorage.setItem('loggedInUser', name);
        document.getElementById('logged-in-user').innerText = name;
        fetchUsers();
        startMessagePolling(name);
    })
    .catch(error => {
        alert(error)
    });
    document.getElementById('login-name').value=null;
    document.getElementById('login-password').value=null;
};

// Kullanıcı çıkışı yapma
const logOut = () => {
    sessionStorage.removeItem('loggedInUser');
    document.getElementById('messaging').style.display = 'none';
    document.getElementById('login').style.display = 'flex';
    stopMessagePolling();
};

// Kullanıcı kaydolma
const signUp = () => {
    const name = document.getElementById('signup-name').value;
    const password = document.getElementById('signup-password').value;

    fetch('/items', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, password })
    })
    .then(response => response.text())
    .then(data => {
        alert('Kullanıcı oluşturuldu')
    })
    .catch(error => console.error('Error:', error));
    document.getElementById('signup-name').value=null;
    document.getElementById('signup-password').value=null;
};

function showSignUp(){
    document.getElementById('login').style.display = 'none';
    document.getElementById('signup').style.display='flex';
}

function showLogin(){
    document.getElementById('signup').style.display='none';
    document.getElementById('login').style.display='flex';
}

// Kullanıcı listesini alıp gösterme
const fetchUsers = () => {
    fetch('/users')
    .then(response => response.json())
    .then(users => {
        const userContainer = document.getElementById('user-list');
        userContainer.innerHTML = '';
        users.forEach(user => {
            const userElement = document.createElement('div');
            userElement.innerText = user.name;
            userElement.classList.add('user');
            userElement.addEventListener('click', () => {
                currentReceiver = user.name;
                fetchMessages();
            });
            userContainer.appendChild(userElement);
        });
    })
    .catch(error => console.error('Error:', error));
};

// Mesaj gönderme
const sendMessage = () => {
    const sender = sessionStorage.getItem('loggedInUser');
    const message = document.getElementById('message').value;

    fetch('/send-message', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ sender, receiver: currentReceiver, message })
    })
    .then(response => response.text())
    .then(data => {
        document.getElementById('message').value = '';
        fetchMessages();
    })
    .catch(error => console.error('Error:', error));
};

// Mesajları alıp gösterme
const fetchMessages = () => {
    const user = sessionStorage.getItem('loggedInUser');

    fetch(`/messages/${user}/${currentReceiver}`)
    .then(response => response.json())
    .then(messages => {
        const messageContainer = document.getElementById('messages');
        messageContainer.innerHTML = '';
        messages.forEach(msg => {
            const messageElement = document.createElement('div');
            messageElement.innerText = `${msg.sender}: ${msg.message}`;
            messageElement.classList.add('message');
            messageElement.classList.add(msg.sender === user ? 'sent' : 'received');
            messageContainer.appendChild(messageElement);
        });
    })
    .catch(error => console.error('Error:', error));
};

// Oturum açılmışsa otomatik olarak giriş yapma
document.addEventListener('DOMContentLoaded', () => {
    const loggedInUser = sessionStorage.getItem('loggedInUser');
    if (loggedInUser) {
        document.getElementById('login').style.display = 'none';
        document.getElementById('messaging').style.display = 'block';
        document.getElementById('logged-in-user').innerText = loggedInUser;
        fetchUsers();
        startMessagePolling(loggedInUser);
    }
});

// Mesaj alım aralığı
let messagePollingInterval;

// Mesaj alma işlemine başlama
const startMessagePolling = (user) => {
    messagePollingInterval = setInterval(() => {
        if (currentReceiver) {
            fetchMessages();
        }
    }, 5000); // 5 saniyede bir mesajları kontrol et
};

// Mesaj alma işlemine son verme
const stopMessagePolling = () => {
    clearInterval(messagePollingInterval);
};
