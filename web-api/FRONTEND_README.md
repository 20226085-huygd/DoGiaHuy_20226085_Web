# Frontend User Management Application

A modern, responsive web application for managing users with full CRUD operations.

## Features

✅ **Read**: Display users in a beautiful table with name, email, and phone  
✅ **Create**: Modal form to add new users  
✅ **Update/Edit**: Edit users via popup modal form  
✅ **Delete**: Remove users with confirmation  
✅ **Search**: Filter users by name in real-time  
✅ **Pagination**: Navigate through pages with configurable items per page  
✅ **Error Handling**: Comprehensive error messages and success notifications  
✅ **Async/Await**: All API calls use async/await (no .then())  
✅ **Manual UI Updates**: UI updates after POST/PUT/DELETE operations  

## Tech Stack

- **HTML5** - Semantic markup
- **CSS3** - Modern styling with gradients, animations, and responsive design
- **Vanilla JavaScript** - No frameworks, pure ES6+
- **Fetch API** - For HTTP requests with async/await

## How to Run

### 1. Start the Backend Server

```bash
npm run dev
```

### 2. Open the Frontend

Open your browser and navigate to:
```
http://localhost:3678
```

The frontend is served as static files from the `/public` directory.

## Usage Guide

### View Users
- Users are displayed in a table showing ID, Name, Email, and Phone
- Table automatically loads on page load

### Search Users
1. Type a name in the search box
2. Click "Search" or press Enter
3. Click "Clear" to reset the search

### Add New User
1. Click the "+ Add New User" button
2. Fill in the form (Name, Username, and Email are required)
3. Click "Save User"
4. Table updates automatically

### Edit User
1. Click the "Edit" button on any user row
2. Modal opens with pre-filled data
3. Modify the fields
4. Click "Save User"
5. Table updates automatically

### Delete User
1. Click the "Delete" button on any user row
2. Confirm the deletion
3. Table updates automatically

### Pagination
- Use "Previous" and "Next" buttons to navigate
- Change items per page using the dropdown (5, 10, 20, or 50)
- Current page and total count displayed

## File Structure

```
public/
├── index.html      # Main HTML structure
├── styles.css      # All styling and animations
└── app.js          # JavaScript logic with async/await
```

## Key Features Implementation

### Async/Await Pattern
All API calls use async/await:
```javascript
async function fetchUsers() {
    const response = await fetch(url);
    const data = await response.json();
    // Handle data
}
```

### Manual UI Updates
After POST/PUT/DELETE operations, the UI is manually refreshed:
```javascript
await createUser(userData);
await fetchUsers(); // Manual refresh
```

### Error Handling
Try-catch blocks with user-friendly error messages:
```javascript
try {
    // API call
} catch (error) {
    showError(`Error: ${error.message}`);
}
```

## Design Highlights

- **Gradient Background**: Purple gradient for modern look
- **Modal Forms**: Smooth animations for form popups
- **Responsive Design**: Works on mobile, tablet, and desktop
- **Hover Effects**: Interactive buttons and table rows
- **Loading States**: Shows loading message while fetching data
- **Success/Error Messages**: Auto-dismiss notifications

## Browser Compatibility

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## API Endpoints Used

- `GET /api/users?page=1&limit=10&search=name` - Fetch users
- `GET /api/users/:id` - Get single user
- `POST /api/users` - Create user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

## Notes

- All data is stored in-memory on the backend
- Changes persist until server restart
- No authentication required (demo purposes)
- CORS enabled for cross-origin requests
