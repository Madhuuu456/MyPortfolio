const API = (window.PORTFOLIO_API_URL || '').replace(/\/$/, '');

const form = document.getElementById('loginForm');
const note = document.getElementById('loginNote');
const inbox = document.getElementById('inbox');
const messages = document.getElementById('messages');

async function loadInbox() {
    try {
        const token = sessionStorage.getItem('madhuAdminToken');

        const response = await fetch(API + '/api/admin/enquiries', {
            headers: {
                Authorization: 'Bearer ' + token
            }
        });

        if (!response.ok) {
            throw new Error('Unable to load enquiries.');
        }

        const rows = await response.json();

        messages.replaceChildren();

        if (!rows.length) {
            messages.textContent = 'No enquiries yet.';
            return;
        }

        rows.forEach(item => {
            const article = document.createElement('article');
            const heading = document.createElement('b');

            heading.textContent = item.name + ' · ' + item.email;

            article.append(
                heading,
                document.createElement('br'),
                document.createTextNode(item.message),
                document.createElement('br'),
                document.createTextNode(
                    new Date(item.createdAt).toLocaleString()
                )
            );

            messages.appendChild(article);
        });

    } catch (error) {
        messages.textContent = error.message;
    }
}

// Admin login
form.addEventListener('submit', async function (event) {
    event.preventDefault();

    note.textContent = 'Signing in...';

    const button = form.querySelector('button');
    button.disabled = true;

    try {
        const response = await fetch(API + '/api/admin/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: document.getElementById('username').value,
                password: document.getElementById('password').value
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Login failed');
        }

        sessionStorage.setItem('madhuAdminToken', data.token);

        form.hidden = true;
        inbox.hidden = false;

        note.textContent = 'Login successful!';

        await loadInbox();

    } catch (error) {
        note.textContent = error.message;
    } finally {
        button.disabled = false;
    }
});

// Logout
document.getElementById('logout').addEventListener('click', function () {
    sessionStorage.removeItem('madhuAdminToken');

    inbox.hidden = true;
    form.hidden = false;

    note.textContent = 'You have logged out.';
});

// Restore existing session
if (sessionStorage.getItem('madhuAdminToken')) {
    form.hidden = true;
    inbox.hidden = false;
    loadInbox();
}