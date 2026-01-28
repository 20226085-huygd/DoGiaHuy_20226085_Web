const API_URL = 'http://localhost:3678/api/users';

let currentPage = 1;
let currentLimit = 10;
let currentSearch = '';
let editingUserId = null;

const elements = {
    usersTableBody: document.getElementById('usersTableBody'),
    userModal: document.getElementById('userModal'),
    userForm: document.getElementById('userForm'),
    modalTitle: document.getElementById('modalTitle'),
    addUserBtn: document.getElementById('addUserBtn'),
    cancelBtn: document.getElementById('cancelBtn'),
    closeBtn: document.querySelector('.close'),
    searchInput: document.getElementById('searchInput'),
    searchBtn: document.getElementById('searchBtn'),
    clearSearchBtn: document.getElementById('clearSearchBtn'),
    prevBtn: document.getElementById('prevBtn'),
    nextBtn: document.getElementById('nextBtn'),
    pageInfo: document.getElementById('pageInfo'),
    limitSelect: document.getElementById('limitSelect'),
    errorMessage: document.getElementById('errorMessage'),
    successMessage: document.getElementById('successMessage')
};

async function fetchUsers() {
    try {
        showLoading();
        
        let url = `${API_URL}?page=${currentPage}&limit=${currentLimit}`;
        if (currentSearch) {
            url += `&search=${encodeURIComponent(currentSearch)}`;
        }

        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.success) {
            renderUsers(data.data);
            updatePagination(data.pagination);
        } else {
            showError('Failed to fetch users');
        }
    } catch (error) {
        showError(`Error fetching users: ${error.message}`);
        console.error('Error:', error);
    }
}

function renderUsers(users) {
    elements.usersTableBody.innerHTML = '';

    if (users.length === 0) {
        elements.usersTableBody.innerHTML = `
            <tr>
                <td colspan="5" class="no-data">No users found</td>
            </tr>
        `;
        return;
    }

    users.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.id}</td>
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>${user.phone}</td>
            <td>
                <button class="btn btn-edit" onclick="editUser(${user.id})">Edit</button>
                <button class="btn btn-danger" onclick="deleteUser(${user.id})">Delete</button>
            </td>
        `;
        elements.usersTableBody.appendChild(row);
    });
}

function showLoading() {
    elements.usersTableBody.innerHTML = `
        <tr>
            <td colspan="5" class="loading">Loading users...</td>
        </tr>
    `;
}

function updatePagination(pagination) {
    elements.pageInfo.textContent = `Page ${pagination.page} of ${pagination.totalPages} (${pagination.total} total)`;
    elements.prevBtn.disabled = pagination.page === 1;
    elements.nextBtn.disabled = pagination.page === pagination.totalPages;
}

async function createUser(userData) {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
            throw new Error(data.message || 'Failed to create user');
        }

        showSuccess('User created successfully!');
        closeModal();
        await fetchUsers();
    } catch (error) {
        showError(`Error creating user: ${error.message}`);
        console.error('Error:', error);
    }
}

async function updateUser(id, userData) {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
            throw new Error(data.message || 'Failed to update user');
        }

        showSuccess('User updated successfully!');
        closeModal();
        await fetchUsers();
    } catch (error) {
        showError(`Error updating user: ${error.message}`);
        console.error('Error:', error);
    }
}

async function deleteUser(id) {
    if (!confirm('Are you sure you want to delete this user?')) {
        return;
    }

    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
            throw new Error(data.message || 'Failed to delete user');
        }

        showSuccess('User deleted successfully!');
        await fetchUsers();
    } catch (error) {
        showError(`Error deleting user: ${error.message}`);
        console.error('Error:', error);
    }
}

async function editUser(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`);
        const data = await response.json();

        if (!response.ok || !data.success) {
            throw new Error(data.message || 'Failed to fetch user');
        }

        const user = data.data;
        editingUserId = id;
        
        elements.modalTitle.textContent = 'Edit User';
        document.getElementById('name').value = user.name || '';
        document.getElementById('username').value = user.username || '';
        document.getElementById('email').value = user.email || '';
        document.getElementById('phone').value = user.phone || '';
        document.getElementById('website').value = user.website || '';
        document.getElementById('street').value = user.address?.street || '';
        document.getElementById('suite').value = user.address?.suite || '';
        document.getElementById('city').value = user.address?.city || '';
        document.getElementById('zipcode').value = user.address?.zipcode || '';
        document.getElementById('lat').value = user.address?.geo?.lat || '';
        document.getElementById('lng').value = user.address?.geo?.lng || '';
        document.getElementById('companyName').value = user.company?.name || '';
        document.getElementById('catchPhrase').value = user.company?.catchPhrase || '';
        document.getElementById('bs').value = user.company?.bs || '';

        openModal();
    } catch (error) {
        showError(`Error fetching user: ${error.message}`);
        console.error('Error:', error);
    }
}

function openModal() {
    elements.userModal.classList.remove('hidden');
}

function closeModal() {
    elements.userModal.classList.add('hidden');
    elements.userForm.reset();
    editingUserId = null;
    elements.modalTitle.textContent = 'Add New User';
}

function showError(message) {
    elements.errorMessage.textContent = message;
    elements.errorMessage.classList.remove('hidden');
    elements.successMessage.classList.add('hidden');
    
    setTimeout(() => {
        elements.errorMessage.classList.add('hidden');
    }, 5000);
}

function showSuccess(message) {
    elements.successMessage.textContent = message;
    elements.successMessage.classList.remove('hidden');
    elements.errorMessage.classList.add('hidden');
    
    setTimeout(() => {
        elements.successMessage.classList.add('hidden');
    }, 3000);
}

function getFormData() {
    return {
        name: document.getElementById('name').value,
        username: document.getElementById('username').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        website: document.getElementById('website').value,
        address: {
            street: document.getElementById('street').value,
            suite: document.getElementById('suite').value,
            city: document.getElementById('city').value,
            zipcode: document.getElementById('zipcode').value,
            geo: {
                lat: document.getElementById('lat').value,
                lng: document.getElementById('lng').value
            }
        },
        company: {
            name: document.getElementById('companyName').value,
            catchPhrase: document.getElementById('catchPhrase').value,
            bs: document.getElementById('bs').value
        }
    };
}

elements.addUserBtn.addEventListener('click', () => {
    editingUserId = null;
    elements.modalTitle.textContent = 'Add New User';
    elements.userForm.reset();
    openModal();
});

elements.cancelBtn.addEventListener('click', closeModal);
elements.closeBtn.addEventListener('click', closeModal);

elements.userModal.addEventListener('click', (e) => {
    if (e.target === elements.userModal) {
        closeModal();
    }
});

elements.userForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const userData = getFormData();
    
    if (editingUserId) {
        await updateUser(editingUserId, userData);
    } else {
        await createUser(userData);
    }
});

elements.searchBtn.addEventListener('click', async () => {
    currentSearch = elements.searchInput.value.trim();
    currentPage = 1;
    await fetchUsers();
});

elements.searchInput.addEventListener('keypress', async (e) => {
    if (e.key === 'Enter') {
        currentSearch = elements.searchInput.value.trim();
        currentPage = 1;
        await fetchUsers();
    }
});

elements.clearSearchBtn.addEventListener('click', async () => {
    currentSearch = '';
    elements.searchInput.value = '';
    currentPage = 1;
    await fetchUsers();
});

elements.prevBtn.addEventListener('click', async () => {
    if (currentPage > 1) {
        currentPage--;
        await fetchUsers();
    }
});

elements.nextBtn.addEventListener('click', async () => {
    currentPage++;
    await fetchUsers();
});

elements.limitSelect.addEventListener('change', async () => {
    currentLimit = parseInt(elements.limitSelect.value);
    currentPage = 1;
    await fetchUsers();
});

document.addEventListener('DOMContentLoaded', () => {
    fetchUsers();
});
